// src/AdminAddUser.js  (if inside src/pages, change import to ../api)
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // adjust path if needed

export default function AdminAddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("auth_token");

  // If your backend expects just the raw token, use: instance.defaults.headers.common.Authorization = token;
    const authedApi = useMemo(() => {
    const instance = api;
      instance.defaults.headers.common.Authorization = token;
    return instance;
  }, [token]);

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await authedApi.post("/admin/users", form);
      setMessage("✅ User created successfully!");
      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    }
  }

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "auto" }}>
      <h2>➕ Add New User</h2>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "15px",
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
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Create User
        </button>
      </form>
    </div>
  );
}
