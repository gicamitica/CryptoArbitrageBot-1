import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress extension errors in console (MetaMask, etc.)
window.addEventListener('error', (e) => {
  // Ignore errors from browser extensions
  if (e.filename && e.filename.includes('chrome-extension://')) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
