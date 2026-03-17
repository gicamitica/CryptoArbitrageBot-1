import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress extension errors globally
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('chrome-extension') || 
     args[0].includes('Origin not allowed'))
  ) {
    return; // Suppress extension errors
  }
  originalError.apply(console, args);
};

// Suppress runtime errors from extensions
window.addEventListener('error', (e) => {
  if (
    (e.filename && e.filename.includes('chrome-extension://')) ||
    (e.message && e.message.includes('Origin not allowed'))
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

// Suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (e) => {
  if (
    e.reason?.message?.includes('chrome-extension') ||
    e.reason?.message?.includes('Origin not allowed')
  ) {
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
