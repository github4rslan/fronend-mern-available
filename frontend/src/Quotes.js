import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import quotes from "./data/quotes.json"; // ✅ local file

export default function Quotes() {
  const [quote, setQuote] = useState(quotes[0]); // start with first
  const navigate = useNavigate();

  const fetchQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>💬 Daily Quote</h1>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          maxWidth: "600px",
          margin: "auto",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontSize: "20px", fontStyle: "italic", marginBottom: "15px" }}>
          "{quote.content}"
        </p>
        <p style={{ fontWeight: "bold", fontSize: "18px", color: "#555" }}>
          — {quote.author}
        </p>

        <button
          onClick={fetchQuote}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          New Quote
        </button>
      </div>

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
