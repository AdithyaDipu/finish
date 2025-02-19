import React, { useState, useEffect } from 'react';

export default function SoilDataPage() {
  const [soilData, setSoilData] = useState({
    moisture: "N/A",
    temperature: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
  });

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/api/soil-data', {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Received Data:", data);
      setSoilData(data);

    } catch (error) {
      console.error("❌ Error fetching soil data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data once when component mounts
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="p-6 min-h-screen flex items-center justify-center bg-cover bg-center bg-green-100">
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
