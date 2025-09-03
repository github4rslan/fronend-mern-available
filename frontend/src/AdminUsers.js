// src/AdminUsers.js  (or src/pages/AdminUsers.js)
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // adjust path if this file is under src/pages -> "../api"

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("auth_token");

  // If your backend expects just the raw token (not Bearer), change the line below accordingly.
  const authedApi = useMemo(() => {
    const instance = api;
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    return instance;
  }, [token]);

  async function fetchUsers() {
    try {
      setError("");
      const { data } = await authedApi.get("/admin/users");
      setUsers(data);
    } catch (e) {
      const msg = e.response?.data?.error || "Failed to load users";
      setError(msg);
      if (e.response?.status === 401) navigate("/login", { replace: true });
    }
  }

  async function changeRole(id, role) {
    try {
      await authedApi.put(`/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.error || "Error updating role");
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await authedApi.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.error || "Error deleting user");
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h2>👥 Registered Users</h2>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          margin: "10px 0",
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

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f4f4f4" }}>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Role</th>
            <th style={th}>Joined</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={td}>{u.name}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.role}</td>
              <td style={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td style={td}>
                {u.role === "user" ? (
                  <button onClick={() => changeRole(u._id, "admin")} style={btn("green")}>
                    Promote to Admin
                  </button>
                ) : (
                  <button onClick={() => changeRole(u._id, "user")} style={btn("orange")}>
                    Demote to User
                  </button>
                )}
                <button onClick={() => deleteUser(u._id)} style={btn("red")}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td style={{ padding: 12, textAlign: "center" }} colSpan={5}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "10px", textAlign: "left" };
const td = { padding: "10px", textAlign: "left" };
const btn = (color) => ({
  marginRight: "8px",
  padding: "6px 10px",
  background: color,
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
});
