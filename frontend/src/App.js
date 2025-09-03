import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Weather from "./Weather";
import News from "./News";
import Crypto from "./Crypto";
import Quotes from "./Quotes";
import Tasks from "./Tasks"; // ✅ NEW CRUD page
import AdminUsers from "./AdminUsers";
import AdminAddUser from "./AdminAddUser";
import Payment from "./Payment";
import PaymentHistory from "./PaymentHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/news" element={<News />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/tasks" element={<Tasks />} /> {/* ✅ NEW route */}
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/add-user" element={<AdminAddUser />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
