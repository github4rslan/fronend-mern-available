// src/pages/Tasks.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // axios instance with baseURL to your Render backend

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  // Build an auth-enabled API client (Bearer token). 
  // If your backend expects just the raw token, change to Authorization: token
  const authedApi = useMemo(() => {
    const instance = api; // reuse your axios instance
    instance.defaults.headers.common.Authorization = token;
    return instance;
  }, [token]);

  async function fetchTasks() {
    try {
      setError("");
      const { data } = await authedApi.get("/tasks");
      setTasks(data);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to load tasks");
      if (e.response?.status === 401) navigate("/login");
    }
  }

  async function addTask(e) {
    e.preventDefault();
    try {
      setError("");
      await authedApi.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to add task");
    }
  }

  async function deleteTask(id) {
    try {
      setError("");
      await authedApi.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to delete task");
    }
  }

  async function toggleComplete(id, completed) {
    try {
      setError("");
      await authedApi.put(`/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to update task");
    }
  }

  function startEdit(task) {
    setEditId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      setError("");
      await authedApi.put(`/tasks/${editId}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditId(null);
      fetchTasks();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to save changes");
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ padding: "20px", maxWidth: "650px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>📝 My Tasks</h2>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Dashboard
      </button>

      {error && (
        <div style={{ color: "red", marginBottom: 12, textAlign: "center" }}>
          {error}
        </div>
      )}

      {/* Add Task */}
      <form
        onSubmit={addTask}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          style={{ flex: "1 1 40%", padding: "8px" }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={{ flex: "1 1 50%", padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Add
        </button>
      </form>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No tasks yet. Add one!
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task._id}
              style={{
                background: "#fff",
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {editId === task._id ? (
                <form
                  onSubmit={saveEdit}
                  style={{ flex: 1, display: "flex", gap: "10px" }}
                >
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ flex: 1, padding: "6px" }}
                  />
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ flex: 2, padding: "6px" }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "blue",
                      color: "white",
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        toggleComplete(task._id, task.completed)
                      }
                    />
                    <span
                      style={{
                        marginLeft: "10px",
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      <strong>{task.title}</strong> - {task.description}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => startEdit(task)}
                      style={{
                        marginRight: "10px",
                        background: "orange",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        color: "white",
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      style={{
                        background: "red",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        color: "white",
                      }}
                    >
                      ❌ Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
