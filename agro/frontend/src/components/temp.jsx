import React, { useState, useEffect, useContext } from 'react';
import './CropRecommendation.css';
import { UserContext } from '../UserContext';

function CropRecommendation({ weatherData }) {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    projectName: '',
    Nitrogen: '',
    Phosporus: '',
    Potassium: '',
    Temperature: '',
    Humidity: '',
    Ph: '',
    Rainfall: '',
    category: 'fruits'
  });

  const [result, setResult] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [documentId, setDocumentId] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (weatherData) {
      setFormData((prevData) => ({
        ...prevData,
        Temperature: weatherData.temperature || '',
        Humidity: weatherData.humidity || '',
        Rainfall: weatherData.rainfallPercentage || '',
      }));
    }
  }, [weatherData]);

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/soil-data');
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          Nitrogen: data.nitrogen,
          Phosporus: data.phosphorus,
          Potassium: data.potassium,
        }));
      } catch (error) {
        console.error('Error fetching soil data:', error);
      }
    };
    fetchSoilData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setFormData((prevData) => ({
        ...prevData,
        Ph: (Math.random() * (6.5 - 6) + 6).toFixed(2)
      }));
    }, 4000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setStatus('Predicting...');
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data.top_10_crops);
      setDocumentId(data.document_id);
      setStatus('Prediction successful! Select crops to save.');
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setStatus('An error occurred while predicting. Please try again.');
    }
  };

  const handleSelectCrop = (crop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSaveCrops = async () => {
    if (!documentId) {
      setStatus('Document ID is missing!');
      return;
    }

    setStatus('Saving selected crops...');
    try {
      const response = await fetch('http://127.0.0.1:5000/store-selected-crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          phone: formData.phone,
          selected_crops: selectedCrops,
          document_id: documentId,
          project_name: formData.projectName,
          category: formData.category 
        }),
      });
      const data = await response.json();
      setStatus(data.message);
    } catch (error) {
      console.error('Error saving selected crops:', error);
      setStatus('An error occurred while saving selected crops.');
    }
  };

  return (
    <div className="crop-recommendation-page">
      <div className="crop-container">
        <h1 className="crop-title">🌱 Smart Crop Recommendation System 🌿</h1>
        <form className="crop-form" onSubmit={handlePredict}>
          <div className="crop-input-group">
            <input type="email" name="email" placeholder="User Email" value={formData.email} readOnly />
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} readOnly />
            <input type="text" name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} required />
            <input type="number" name="Nitrogen" placeholder="Nitrogen" value={formData.Nitrogen} onChange={handleChange} required />
            <input type="number" name="Phosporus" placeholder="Phosphorus" value={formData.Phosporus} onChange={handleChange} required />
            <input type="number" name="Potassium" placeholder="Potassium" value={formData.Potassium} onChange={handleChange} required />
            <input type="number" name="Temperature" placeholder="Temperature (°C)" value={formData.Temperature} onChange={handleChange} required />
            <input type="number" name="Humidity" placeholder="Humidity (%)" value={formData.Humidity} onChange={handleChange} required />
            <input type="number" name="Ph" placeholder="pH Level" value={formData.Ph} onChange={handleChange} required />
            <input type="number" name="Rainfall" placeholder="Rainfall (mm)" value={formData.Rainfall} onChange={handleChange} required />
            <select name="category" value={formData.category} onChange={handleChange} required className="block w-full p-2 border border-gray-300 rounded mt-2">
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="both">Both</option>
            </select>
          </div>
          <button className="crop-btn" type="submit">Predict</button>
        </form>
        <p className="crop-status">{status}</p>
        {result && (
          <div className="crop-result-section">
            <h2 className="crop-result-title">🌾 Recommended Crops</h2>
            <ul className="crop-list">
              {result.map((item, index) => (
                <li key={index} className="crop-item">
                  <label className="crop-label">
                    <input type="checkbox" value={item.crop} checked={selectedCrops.includes(item.crop)} onChange={() => handleSelectCrop(item.crop)} />
                    <span className="crop-name">{item.crop}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button className="crop-btn save-btn" onClick={handleSaveCrops}>Save Selected Crops</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropRecommendation;