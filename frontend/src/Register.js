import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "./api"; // 👈 import axios instance

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      return;
    }

    try {
      // 👇 use api.js instead of fetch
      const res = await api.post("/auth/register", form);

      setMessage("✅ Registration successful! Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Register</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Register
        </button>

        <Link
          to="/login"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "10px",
            color: "#007bff",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
}
