import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { registerServiceWorker } from "./hooks/use-offline";
import { initNativeApp, isNative } from "./lib/native";
import { setPendingNavigation, resolvePushRoute } from "./lib/pending-navigation";

// Register service worker for offline support (web only — Capacitor uses native shell)
if (!isNative) {
  registerServiceWorker();
}

// Initialize native app behaviors (no-op on web)
initNativeApp();

// Capture cold-start push notification taps BEFORE React mounts so the
// router can navigate to the right screen as soon as it is ready.
if (isNative) {
  (async () => {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const delivered = await PushNotifications.getDeliveredNotifications();
      const launch = delivered?.notifications?.[0];
      if (launch?.data) {
        setPendingNavigation(resolvePushRoute(launch.data as Record<string, unknown>));
      }
    } catch {
      /* not critical */
    }
  })();
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
