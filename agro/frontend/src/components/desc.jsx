import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';

function ProjectEntries() {
  const { user } = useContext(UserContext);
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [cropDetails, setCropDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!user || !user.email) return;
      setStatus('Fetching your projects...');
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-user-projects?email=${encodeURIComponent(user.email)}`);
        const data = await response.json();

        if (response.ok && data.entries) {
          setEntries(data.entries);
          setStatus(`Found ${data.entries.length} project(s) under your email.`);
        } else {
          setEntries([]);
          setStatus(data.message || 'No projects found.');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setStatus('An error occurred while fetching your projects. Please check the API and server connection.');
      }
    };

    fetchUserProjects();
  }, [user]);

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
    fetch(`http://127.0.0.1:5000/get-crop-details?crop_name=${encodeURIComponent(crop)}`)
      .then(response => response.json())
      .then(data => {
        if (data.name) {
          setCropDetails(data);
          setError('');
        } else {
          setCropDetails(null);
          setError('Crop details not found');
        }
      })
      .catch(err => {
        console.error('Error fetching crop details:', err);
        setCropDetails(null);
        setError('Failed to fetch crop details. Please check the server connection.');
      });
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-green-100 to-green-300 min-h-screen">
      <h2 className="text-3xl font-bold text-green-800 mb-4">🌾 Your Projects</h2>
      <p className="text-green-700 mb-6">{status}</p>
      {entries.length > 0 && (
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-green-900 mb-4">Project: {entry.project_name}</h3>
              <div className="flex flex-wrap gap-4">
                {entry.selected_crops.map((crop, idx) => (
                  <div key={idx} className="w-full">
                    <div
                      className="px-4 py-2 bg-green-200 text-green-800 rounded-lg cursor-pointer hover:bg-green-300 transition transform hover:scale-105"
                      onClick={() => handleCropClick(crop)}
                    >
                      {crop}
                    </div>
                    {selectedCrop === crop && (
                      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                        {/* Placeholder for Image */}
                        <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                          <span className="text-gray-500 text-sm">[Add Crop Image Here]</span>
                        </div>
                        {cropDetails ? (
                          <div>
                            <h3 className="text-xl font-bold text-green-800 mb-2">🌱 {cropDetails.name}</h3>
                            <p className="text-green-700"><strong>Soil:</strong> {cropDetails.soil}</p>
                            <p className="text-green-700"><strong>Planting:</strong> {cropDetails.planting}</p>
                            <p className="text-green-700"><strong>Timeline:</strong> {cropDetails.timeline}</p>
                            <p className="text-green-700"><strong>Fertilizers:</strong> {cropDetails.fertilizers}</p>
                            <p className="text-green-700"><strong>Harvesting:</strong> {cropDetails.harvesting}</p>
                            <p className="text-green-700"><strong>Fertilizer Schedule:</strong> {cropDetails.fertilizer_schedule}</p>
                            <p className="text-green-700"><strong>Pest Control:</strong> {cropDetails.pest_control}</p>
                          </div>
                        ) : (
                          <p className="text-red-600">{error || 'Loading crop details...'}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectEntries;
