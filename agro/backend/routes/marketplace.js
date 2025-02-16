const express = require('express');
const Crop = require('../models/crops');
const router = express.Router();
const mongoose = require('mongoose'); // ✅ Import mongoose


// Add crops to the marketplace
router.post('/add', async (req, res) => {
  try {
    const { farmerId, crops } = req.body;

    if (!farmerId || !crops || !Array.isArray(crops) || crops.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid crop data.',
      });
    }

    // Save each crop to the database
    const cropPromises = crops.map((crop) =>
      new Crop({
        farmer: farmerId,
        name: crop.name,
        quantity: crop.quantity,
        price: crop.price,
      }).save()
    );

    await Promise.all(cropPromises);

    res.status(201).json({
      success: true,
      message: 'Crops added successfully!',
    });
  } catch (error) {
    console.error('Error adding crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
});

// Get all crops listed by a specific farmer
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    const crops = await Crop.find({ farmer: farmerId });

    res.status(200).json({
      success: true,
      crops,
    });
  } catch (error) {
    console.error('Error retrieving farmer crops:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
});

router.get('/all', async (req, res) => {
  try {
    const crops = await Crop.find().populate('farmer', 'firstName lastName');
    res.status(200).json({ success: true, crops });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Purchase a crop (Reduce quantity)
// ✅ Purchase a crop (Reduce quantity safely without transactions)
router.post('/buy', async (req, res) => {
  try {
    const { cropId, quantity } = req.body;

    // Find the crop and update it atomically
    const crop = await Crop.findOneAndUpdate(
      { _id: cropId, quantity: { $gte: quantity } }, // Ensure enough stock is available
      { $inc: { quantity: -quantity } }, // Reduce quantity
      { new: true } // Return the updated document
    );

    if (!crop) {
      return res.status(400).json({ success: false, message: 'Not enough stock available or crop not found' });
    }

    res.status(200).json({ success: true, message: 'Purchase successful!', updatedCrop: crop });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.put('/update/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;
    const { price, quantity } = req.body;

    // Find and update the crop
    const updatedCrop = await Crop.findByIdAndUpdate(
      cropId,
      { price, quantity },
      { new: true } // Return updated document
    );

    if (!updatedCrop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, message: 'Crop updated successfully', updatedCrop });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.delete('/delete/:cropId', async (req, res) => {
  try {
    const { cropId } = req.params;

    // Find and remove the crop
    const deletedCrop = await Crop.findByIdAndDelete(cropId);

    if (!deletedCrop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, message: 'Crop removed successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



module.exports = router;
