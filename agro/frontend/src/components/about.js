import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4">About AgroAsist</h1>
        <p className="text-gray-700 mb-4">
          AgroAsist is an innovative platform dedicated to optimizing agricultural productivity 
          through technology, data analytics, and sustainable practices. Our goal is to empower 
          farmers with real-time insights, market access, and resource-efficient solutions that 
          enhance crop yields while promoting environmental sustainability.
        </p>
        <p className="text-gray-700">
          By leveraging AI, IoT, and blockchain technology, we provide a seamless and scalable 
          solution for farmers, agribusinesses, and policymakers. Join us in transforming 
          agriculture for a better, more sustainable future.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
