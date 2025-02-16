import React, { useState, useEffect } from "react";

const WeatherLocation = ({ onWeatherData }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser.");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = "7926bc35a3394814c078b74ef95ab3fe"; 
            const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitude}`;

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch weather data.");

            const data = await response.json();
            if (data.error) throw new Error(data.error.info);

            const weatherDetails = {
              temperature: data.current.temperature,
              humidity: data.current.humidity,
              rainfallPercentage: data.current.precip,
            };

            console.log("Weather data fetched:", weatherDetails);
            setWeatherData(weatherDetails);
            onWeatherData(weatherDetails);
            setError(null);
          },
          (geoError) => {
            setError(`Error getting location: ${geoError.message}`);
            setLoading(false);
          }
        );
      } catch (err) {
        setError(`An unexpected error occurred: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-6 border border-gray-300 rounded-xl shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-4">Weather Details</h1>
      {loading && <p className="text-center text-gray-500">Fetching weather data...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {weatherData && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-medium mb-2 text-center">Fetched Weather Data:</h2>
          <p className="text-lg mb-1"><strong>Temperature:</strong> {weatherData.temperature}°C</p>
          <p className="text-lg mb-1"><strong>Humidity:</strong> {weatherData.humidity}%</p>
          <p className="text-lg"><strong>Rainfall:</strong> {weatherData.rainfallPercentage} mm</p>
        </div>
      )}
    </div>
  );
};

export default WeatherLocation;
