// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "../router"; // tu router con layout y rutas
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
