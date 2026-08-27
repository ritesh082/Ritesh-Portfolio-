"use client";

import { useEffect } from "react";

if (typeof window !== "undefined") {
  const isExtensionError = (msg?: any, stack?: string) => {
    const text = String(msg || "") + " " + String(stack || "");
    return (
      text.includes("chrome-extension://") ||
      text.includes("moz-extension://") ||
      text.includes("embed_script.js") ||
      text.includes("oihbmmeelledioenpfcfehdjhdnlfibj") ||
      text.includes("Minified React error #299") ||
      text.includes("invariant=299")
    );
  };

  // 1. Intercept window.onerror
  const originalOnError = window.onerror;
  window.onerror = function (msg, url, lineNo, columnNo, error) {
    if (isExtensionError(msg, error?.stack) || isExtensionError(url)) {
      return true; // Prevents browser & Next.js error popup
    }
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any);
    }
    return false;
  };

  // 2. Intercept window 'error' events
  window.addEventListener(
    "error",
    (e) => {
      if (
        isExtensionError(e.message, e.error?.stack) ||
        isExtensionError(e.filename)
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );

  // 3. Intercept 'unhandledrejection'
  window.addEventListener(
    "unhandledrejection",
    (e) => {
      if (isExtensionError(e.reason?.message, e.reason?.stack)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true
  );

  // 4. Intercept console.error (Next.js Dev Overlay captures console.error)
  const originalConsoleError = console.error;
  console.error = function (...args: any[]) {
    const fullMessage = args
      .map((arg) =>
        typeof arg === "object" ? arg?.stack || String(arg) : String(arg)
      )
      .join(" ");

    if (isExtensionError(fullMessage)) {
      return; // Suppress from Next.js dev overlay
    }
    originalConsoleError.apply(console, args);
  };
}

export default function ExtensionShield() {
  useEffect(() => {
    // Shield active
  }, []);

  return null;
}

