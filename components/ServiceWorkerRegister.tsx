"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const onLoad = async () => {
      try {
        const response = await fetch("/sw.js", { method: "HEAD", cache: "no-store" });

        // If there is no service worker file, clear any stale registrations
        // so old cached shells do not keep the app stuck after deploys.
        if (!response.ok) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration) => registration.unregister()));
          return;
        }

        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker registrado com sucesso:", registration.scope);
      } catch (err) {
        console.log("Falha ao registrar o Service Worker:", err);
      }
    };

    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
