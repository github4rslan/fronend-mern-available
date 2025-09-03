import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Weather() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("London"); // default city
  const navigate = useNavigate();

  const API_KEY = "d8d672f40b4d4a36a35223846252308"; // your WeatherAPI key

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    fetchWeather(city); // load default city
  }, [navigate]);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`
      );
      const data = await res.json();

      if (data.error) {
        setWeather(null);
        alert(data.error.message);
      } else {
        setWeather(data);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  function handleSearch(e) {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  }

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>🌦 Weather</h1>
      {user && (
        <p>
          Logged in as <strong>{user.name}</strong> ({user.email})
        </p>
      )}

      {/* Search City */}
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading weather...</p>
      ) : weather && weather.current ? (
        <div style={{ textAlign: "center" }}>
          <p>
            <strong>{weather.location.name}</strong> (
            {weather.location.country})
          </p>
          <p>
            {weather.current.temp_c}°C — {weather.current.condition.text}
          </p>
          <img src={weather.current.condition.icon} alt="weather icon" />
        </div>
      ) : (
        <p>Enter a city to see weather</p>
      )}

      {/* Back to Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
