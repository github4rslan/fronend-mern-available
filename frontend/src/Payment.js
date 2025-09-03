// src/Payment.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // adjust path if inside src/pages use ../api

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  // attach token to axios instance
  const authedApi = useMemo(() => {
    const instance = api;
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return instance;
  }, [token]);

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  async function handlePayment(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("❌ Please enter a valid amount");
      setLoading(false);
      return;
    }

    try {
      await authedApi.post("/payment/create-checkout-session", { amount });
      setMessage(`✅ Mock payment of $${numericAmount} successful!`);
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>
      <h2>💳 Mock Payment Gateway</h2>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "20px",
          padding: "8px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        ⬅ Back
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form
        onSubmit={handlePayment}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (USD)"
          style={{ padding: "10px" }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "gray" : "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
