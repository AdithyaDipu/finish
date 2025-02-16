import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserCrops = () => {
  const { userId } = useParams(); // Get user ID from URL
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserAndCrops();
  }, []);

  const fetchUserAndCrops = async () => {
    try {
      const response = await fetch(`http://localhost:5000/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setCrops(data.crops);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching user & crops:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to delete a crop
  const deleteCrop = async (cropId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this crop?');

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/admin/crops/${cropId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('Crop deleted successfully!');
        setCrops(crops.filter((crop) => crop._id !== cropId)); // ✅ Remove crop from UI
      } else {
        alert('Failed to delete crop: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting crop:', error);
      alert('An error occurred while deleting the crop.');
    }
  };

  if (loading) return <p>Loading user and crops...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-semibold text-center mb-8">
        Crops Listed by {user?.firstName} {user?.lastName}
      </h1>

      {crops.length === 0 ? (
        <p className="text-gray-500 text-center">No crops listed by this user.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crops.map((crop) => (
            <div key={crop._id} className="bg-white p-6 shadow-md rounded-md border flex flex-col items-center">
              <h3 className="text-xl font-semibold text-green-600">{crop.name}</h3>
              <p className="text-gray-700">Quantity: {crop.quantity} kg</p>
              <p className="text-gray-700">Price: ₹{crop.price} per kg</p>
              <button
                onClick={() => deleteCrop(crop._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete Crop
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserCrops;
