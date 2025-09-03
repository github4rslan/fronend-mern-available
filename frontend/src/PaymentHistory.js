// src/PaymentHistory.js
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // adjust path if needed

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  // axios instance with Bearer token
  const authedApi = useMemo(() => {
    const instance = api;
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return instance;
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    async function fetchPayments() {
      try {
        const res = await authedApi.get("/payment/history");
        setPayments(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [token, navigate, authedApi]);

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>📜 Payment History</h2>
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

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {payments.map((p) => (
            <li
              key={p._id}
              style={{
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                background: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              💵 Amount: <strong>${p.amount}</strong> <br />
              Status:{" "}
              <span
                style={{
                  color: p.status === "success" ? "green" : "red",
                }}
              >
                {p.status}
              </span>{" "}
              <br />
              Date: {new Date(p.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
