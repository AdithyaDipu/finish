import React from 'react';
import { useNavigate } from 'react-router-dom';
import treeimage from '../images/treeimage.png';

function ProjectSelection() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-white" 
      style={{ backgroundImage: `url(${treeimage})` }}
    >
      <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-8 text-center bg-white bg-opacity-70 px-6 py-4 rounded-lg shadow-md">
        AgroAssist Project Selection
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          className="px-6 py-3 bg-green-100 text-green-700 text-lg font-medium rounded-lg shadow-md hover:bg-green-200 transition"
          onClick={() => navigate('/croprec')}
        >
          Create New Project
        </button>
        <button 
          className="px-6 py-3 bg-green-100 text-green-700 text-lg font-medium rounded-lg shadow-md hover:bg-green-200 transition"
          onClick={() => navigate('/existproj')}
        >
          Existing Project
        </button>
      </div>
    </div>
  );
}

export default ProjectSelection;
