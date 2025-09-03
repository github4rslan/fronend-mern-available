import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Crypto() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCrypto();
  }, [navigate]);

  const fetchCrypto = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
      );
      const data = await res.json();
      setCoins(data);
    } catch (err) {
      console.error("Crypto fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>💰 Top 10 Cryptocurrencies</h1>

      {loading ? (
        <p>Loading crypto data...</p>
      ) : (
        <table
          style={{
            width: "90%",
            margin: "20px auto",
            borderCollapse: "collapse",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#007bff", color: "white" }}>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Coin</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Market Cap</th>
              <th style={thStyle}>24h Change</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin, index) => (
              <tr key={coin.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    style={{ width: "25px", verticalAlign: "middle", marginRight: "8px" }}
                  />
                  {coin.name} ({coin.symbol.toUpperCase()})
                </td>
                <td style={tdStyle}>${coin.current_price.toLocaleString()}</td>
                <td style={tdStyle}>${coin.market_cap.toLocaleString()}</td>
                <td
                  style={{
                    ...tdStyle,
                    color: coin.price_change_percentage_24h >= 0 ? "green" : "red",
                  }}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

const thStyle = {
  padding: "12px",
  textAlign: "center",
  fontSize: "16px",
};

const tdStyle = {
  padding: "12px",
  textAlign: "center",
  fontSize: "15px",
};
