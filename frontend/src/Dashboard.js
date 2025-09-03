import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const isAdmin = user?.role === "admin"; // ✅ check if admin

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
        Welcome to Dashboard 🎉
      </h1>
      {user && (
        <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
          Logged in as <strong>{user.name}</strong> ({user.email}) —{" "}
          <span
            style={{
              color: isAdmin ? "green" : "gray",
              fontWeight: "bold",
            }}
          >
            {isAdmin ? "Admin" : "User"}
          </span>
        </p>
      )}

      <h2 style={{ marginBottom: "20px", fontSize: "1.8rem" }}>
        🚀 Available Features
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "25px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Common features */}
        <Link to="/weather" style={cardStyle}>🌦 Weather</Link>
        <Link to="/news" style={cardStyle}>📰 News</Link>
        <Link to="/crypto" style={cardStyle}>💰 Crypto</Link>
        <Link to="/quotes" style={cardStyle}>💬 Quotes</Link>
        <Link to="/tasks" style={cardStyle}>📝 Tasks (CRUD)</Link>
        <Link to="/payment" style={cardStyle}>💳 Mock Payment</Link>
        <Link to="/payment-history" style={cardStyle}>📜 Payment History</Link>

        {/* ✅ Admin-only features */}
        {isAdmin && (
          <>
            <Link to="/admin/users" style={cardStyle}>
              👥 Registered Users
            </Link>
            <Link to="/admin/add-user" style={cardStyle}>
              ➕ Add User
            </Link>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          padding: "12px 25px",
          backgroundColor: "#dc3545",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#b02a37")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
      >
        Logout
      </button>
    </div>
  );
}

const cardStyle = {
  padding: "30px 20px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textDecoration: "none",
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  transition: "0.3s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
