const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/users');
const Crop = require('../models/crops');

const router = express.Router();

// ✅ Middleware to Verify Admin Token
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    if (!token) {
      return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });
    }

    // ✅ Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use env secret key
    req.user = decoded;

    // ✅ Check Admin Privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// ✅ Get All Users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Delete a User & Their Crops
router.delete('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ Also delete all crops associated with this user
    await Crop.deleteMany({ farmer: userId });

    res.status(200).json({ success: true, message: 'User and their crops deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Get All Crops
router.get('/crops', verifyAdmin, async (req, res) => {
  try {
    const crops = await Crop.find().populate('farmer', 'firstName lastName email');
    res.status(200).json({ success: true, crops });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Delete a Crop
router.delete('/crops/:cropId', verifyAdmin, async (req, res) => {
  try {
    const { cropId } = req.params;

    // Validate cropId format
    if (!mongoose.Types.ObjectId.isValid(cropId)) {
      return res.status(400).json({ success: false, message: 'Invalid Crop ID' });
    }

    const crop = await Crop.findByIdAndDelete(cropId);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    res.status(200).json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Get Crops by User
router.get('/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }

    const crops = await Crop.find({ farmer: userId });

    res.status(200).json({ success: true, crops });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
