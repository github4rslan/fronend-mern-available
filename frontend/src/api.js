// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-node-js-8eqf.onrender.com/api",
  // withCredentials: false // keep false unless you're using cookies/sessions
});

export default api;
