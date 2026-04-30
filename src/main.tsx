import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { registerServiceWorker } from "./hooks/use-offline";
import { initNativeApp, isNative } from "./lib/native";

// Register service worker for offline support (web only — Capacitor uses native shell)
if (!isNative) {
  registerServiceWorker();
}

// Initialize native app behaviors (no-op on web)
initNativeApp();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
