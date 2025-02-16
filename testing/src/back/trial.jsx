import React, { useState } from 'react';
import axios from 'axios';

const CropInput = () => {
  const [formData, setFormData] = useState({
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPredictions([]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/recommend_crop', formData);
      if (response.data.recommended_crops) {
        setPredictions(response.data.recommended_crops);
      } else {
        setError('No crops recommended.');
      }
    } catch (err) {
      setError('Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Enter Crop Data</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" name="N" placeholder="Nitrogen (N)" onChange={handleChange} required />
        <input type="number" name="P" placeholder="Phosphorus (P)" onChange={handleChange} required />
        <input type="number" name="K" placeholder="Potassium (K)" onChange={handleChange} required />
        <input type="number" name="temperature" placeholder="Temperature (°C)" onChange={handleChange} required />
        <input type="number" name="humidity" placeholder="Humidity (%)" onChange={handleChange} required />
        <input type="number" name="ph" placeholder="Soil pH" onChange={handleChange} required />
        <input type="number" name="rainfall" placeholder="Rainfall (mm)" onChange={handleChange} required />
        
        <button type="submit" disabled={loading}>{loading ? 'Predicting...' : 'Get Recommendations'}</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {predictions.length > 0 && (
        <div>
          <h3>Top 10 Recommended Crops</h3>
          <ul>
            {predictions.map((crop, index) => (
              <li key={index}>{crop}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CropInput;
