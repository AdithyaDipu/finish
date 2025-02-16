import React, { useState, useEffect } from 'react';
import homebg3 from '../images/homebg3.png';
import treeimage from '../images/treeimage.png'

export default function SoilDataPage() {
  const [soilData, setSoilData] = useState({
    moisture: 0,
    temperature: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/soil-data');
        const data = await response.json();
        setSoilData(data);
      } catch (error) {
        console.error('Error fetching soil data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div 
      className="p-6 min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ backgroundImage: `url(${treeimage})` }} // Add your local image path here
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {Object.entries(soilData).map(([key, value]) => (
          <div key={key} className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-6 text-center transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-700 capitalize mb-4">{key}</h2>
            <p className="text-4xl font-extrabold text-green-600">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
