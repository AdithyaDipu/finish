import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const Marketplace = () => {
  const [crops, setCrops] = useState([{ name: '', quantity: '', price: '' }]);
  const [farmerCrops, setFarmerCrops] = useState([]); // Stores crops listed by the logged-in farmer
  const { user } = useContext(UserContext); // Access the logged-in user details

  useEffect(() => {
    if (user && user.role === 'farmer') {
      fetchFarmerCrops();
    }
  }, [user]); // Fetch crops when the user is loaded

  // ✅ Fetch crops listed by the farmer
  const fetchFarmerCrops = async () => {
    try {
      const response = await fetch(`http://localhost:5000/marketplace/farmer/${user._id}`);
      const data = await response.json();
      if (data.success) {
        setFarmerCrops(data.crops);
      } else {
        console.error('Failed to fetch crops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  // ✅ Handle changes for new crops
  const handleCropChange = (index, field, value) => {
    const newCrops = [...crops];
    newCrops[index][field] = value;
    setCrops(newCrops);
  };

  // ✅ Add new crop row
  const addCrop = () => {
    setCrops([...crops, { name: '', quantity: '', price: '' }]);
  };

  // ✅ Submit new crops
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'farmer') {
      alert('You must be logged in as a farmer to add crops.');
      return;
    }

    const payload = { farmerId: user._id, crops };

    try {
      const response = await fetch('http://localhost:5000/marketplace/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert('Crops added successfully!');
        setCrops([{ name: '', quantity: '', price: '' }]); // Reset form
        fetchFarmerCrops(); // Refresh the listed crops after adding new ones
      } else {
        alert('Failed to add crops: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding crops:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // ✅ Handle price & quantity update for existing crops
  const handleFieldChange = (cropId, field, value) => {
    const updatedCrops = farmerCrops.map((crop) => 
      crop._id === cropId ? { ...crop, [field]: value } : crop
    );
    setFarmerCrops(updatedCrops);
  };

  const handleUpdate = async (crop) => {
    const { _id, price, quantity } = crop;
    try {
      const response = await fetch(`http://localhost:5000/marketplace/update/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(price), quantity: Number(quantity) }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Crop updated successfully!');
        fetchFarmerCrops();
      } else {
        alert('Failed to update crop: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating crop:', error);
    }
  };

  // ✅ Delete crop
  const handleDelete = async (cropId) => {
    if (!window.confirm('Are you sure you want to delete this crop?')) return;

    try {
      const response = await fetch(`http://localhost:5000/marketplace/delete/${cropId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('Crop removed successfully!');
        fetchFarmerCrops();
      } else {
        alert('Failed to remove crop: ' + data.message);
      }
    } catch (error) {
      console.error('Error removing crop:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-semibold text-center mb-8">Manage Your Crops</h1>

      {/* Crop Listing Form */}
      <form className="bg-white p-6 shadow-md rounded-md" onSubmit={handleSubmit}>
        {crops.map((crop, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-6 border-b pb-4">
            <div>
              <label className="block mb-2 font-medium">Crop Name*</label>
              <input
                type="text"
                value={crop.name}
                onChange={(e) => handleCropChange(index, 'name', e.target.value)}
                className="border border-gray-300 w-full p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Quantity (kg)*</label>
              <input
                type="number"
                value={crop.quantity}
                onChange={(e) => handleCropChange(index, 'quantity', e.target.value)}
                className="border border-gray-300 w-full p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Price (₹ per kg)*</label>
              <input
                type="number"
                value={crop.price}
                onChange={(e) => handleCropChange(index, 'price', e.target.value)}
                className="border border-gray-300 w-full p-2 rounded"
                required
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCrop}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
        >
          Add Another Crop
        </button>
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Submit Crops
        </button>
      </form>

      {/* Listed Crops */}
      <h2 className="text-2xl font-semibold text-center mt-10">Your Listed Crops</h2>
      {farmerCrops.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No crops listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {farmerCrops.map((crop) => (
            <div key={crop._id} className="bg-white p-4 shadow-md rounded-lg border">
              <h3 className="text-xl font-semibold text-green-600">{crop.name}</h3>

              {/* ✅ Editable Quantity */}
              <div className="flex flex-col mt-2">
                <label className="text-gray-700">Quantity (kg):</label>
                <input
                  type="number"
                  value={crop.quantity}
                  onChange={(e) => handleFieldChange(crop._id, 'quantity', e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              {/* ✅ Editable Price */}
              <div className="flex flex-col mt-2">
                <label className="text-gray-700">Price (₹ per kg):</label>
                <input
                  type="number"
                  value={crop.price}
                  onChange={(e) => handleFieldChange(crop._id, 'price', e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              {/* Update Button */}
              <button
                className="bg-blue-500 text-white py-2 px-4 mt-3 rounded hover:bg-blue-700"
                onClick={() => handleUpdate(crop)}
              >
                Update Crop
              </button>

              {/* Delete Button */}
              <button
                className="bg-red-500 text-white py-2 px-4 mt-2 rounded hover:bg-red-600"
                onClick={() => handleDelete(crop._id)}
              >
                Remove Crop
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
