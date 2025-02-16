import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

const MarketplaceList = () => {
  const { user } = useContext(UserContext);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch all available crops
  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch('http://localhost:5000/marketplace/all');
      const data = await response.json();
      if (data.success) {
        setCrops(data.crops);
      } else {
        console.error('Failed to fetch crops:', data.message);
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handlePurchase = async (cropId) => {
    if (!user) {
      alert('You must be logged in to buy crops.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/marketplace/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cropId, quantity }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Purchase successful!');
        fetchCrops(); // Refresh the crop list
      } else {
        alert('Failed to purchase: ' + data.message);
      }
    } catch (error) {
      console.error('Error purchasing crop:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-semibold text-center mb-8">Available Crops</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {crops.length === 0 ? (
          <p className="text-center text-gray-500">No crops available.</p>
        ) : (
          crops.map((crop) => (
            <div key={crop._id} className="bg-white p-4 shadow-md rounded-lg border">
              <h3 className="text-xl font-semibold text-green-600">{crop.name}</h3>
              <p className="text-gray-700">Quantity: {crop.quantity} kg</p>
              <p className="text-gray-700">Price: ₹{crop.price} per kg</p>
              <p className="text-gray-500">
                Seller: {crop.farmer.firstName} {crop.farmer.lastName}
              </p>
              <div className="flex items-center mt-4">
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  max={crop.quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 p-2 w-20 rounded"
                />
                <button
                  className="bg-blue-500 text-white py-2 px-4 ml-4 rounded hover:bg-blue-600"
                  onClick={() => handlePurchase(crop._id)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketplaceList;
