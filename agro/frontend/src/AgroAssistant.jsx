import React, { useState } from "react";
import WeatherLocation from "./components/weather";
import CropRecommendation from "./components/temp";

function AgroAssistant() {
  const [weatherData, setWeatherData] = useState(null);

  return (
    <div>
      <h1>Smart Agro Assistant</h1>
      <WeatherLocation onWeatherData={setWeatherData} />
      {weatherData && <CropRecommendation weatherData={weatherData} />}
    </div>
  );
}

export default AgroAssistant;
