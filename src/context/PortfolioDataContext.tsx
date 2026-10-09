"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import defaultData from "@/data/portfolioData.json";
import { PortfolioData } from "@/types/portfolio";

export const LOCAL_STORAGE_KEY = "ritesh_portfolio_custom_data_v1";
export const DRAFT_STORAGE_KEY = "ritesh_portfolio_admin_draft_v1";

interface PortfolioDataContextType {
  data: PortfolioData;
  isLoading: boolean;
  updateData: (newData: PortfolioData) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  importData: (importedData: PortfolioData) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType>({
  data: defaultData as PortfolioData,
  isLoading: false,
  updateData: async () => false,
  resetToDefaults: async () => false,
  importData: async () => false,
  refreshData: async () => {},
});

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(() => {
    // Initial SSR / hydration safety check: check if localStorage has saved data
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.personal && parsed.experiences) {
            return parsed as PortfolioData;
          }
        }
      } catch {
        // Fallback to defaultData
      }
    }
    return defaultData as PortfolioData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchServerData = useCallback(async () => {
    // 1. First, check localStorage for immediate availability
    let localData: PortfolioData | null = null;
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.personal && parsed.experiences) {
            localData = parsed as PortfolioData;
            setData(parsed);
          }
        }
      } catch {
        // ignore
      }
    }

    // 2. Fetch fresh data from server
    try {
      const res = await fetch("/api/portfolio-data", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.personal) {
          const serverData: PortfolioData = json.data;

          const localTimestamp = localData?.lastUpdated || 0;
          const serverTimestamp = serverData.lastUpdated || 0;

          // If local data has newer changes that haven't synced to disk, preserve local and push to server
          if (localData && localTimestamp > serverTimestamp) {
            setData(localData);
            try {
              await fetch("/api/portfolio-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localData),
              });
            } catch (syncErr) {
              console.warn("Auto-syncing newer local data to server encountered:", syncErr);
            }
          } else {
            // Server data is newer or identical
            setData(serverData);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
              } catch {
                // Ignore storage quota errors
              }
            }
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch portfolio data from /api/portfolio-data:", err);
    }
  }, []);

  useEffect(() => {
    fetchServerData().finally(() => setIsLoading(false));

    // Listen for cross-tab or cross-component sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.personal) {
            setData(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<PortfolioData>;
      if (customEvent.detail) {
        setData(customEvent.detail);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("portfolio_data_updated", handleCustomSync);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("portfolio_data_updated", handleCustomSync);
      }
    };
  }, [fetchServerData]);

  const updateData = async (newData: PortfolioData): Promise<boolean> => {
    try {
      const dataWithTimestamp: PortfolioData = {
        ...newData,
        lastUpdated: Date.now(),
      };

      // 1. Immediately update state
      setData(dataWithTimestamp);

      // 2. Persist to localStorage instantly
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataWithTimestamp));
        } catch {
          // storage quota handler
        }
        window.dispatchEvent(
          new CustomEvent("portfolio_data_updated", { detail: dataWithTimestamp })
        );
      }

      // 3. Persist to server disk
      const res = await fetch("/api/portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithTimestamp),
      });

      const resJson = await res.json();
      return Boolean(resJson.success);
    } catch (err) {
      console.error("Failed to save portfolio data to server:", err);
      // Even if server failed (e.g. offline/read-only), localStorage has saved it
      return true;
    }
  };

  const resetToDefaults = async (): Promise<boolean> => {
    try {
      const resetPayload: PortfolioData = {
        ...(defaultData as PortfolioData),
        lastUpdated: Date.now(),
      };

      setData(resetPayload);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resetPayload));
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
          // ignore
        }
        window.dispatchEvent(
          new CustomEvent("portfolio_data_updated", { detail: resetPayload })
        );
      }

      const res = await fetch("/api/portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetPayload),
      });

      const resJson = await res.json();
      return Boolean(resJson.success);
    } catch (err) {
      console.error("Failed to reset portfolio data:", err);
      return false;
    }
  };

  const importData = async (importedData: PortfolioData): Promise<boolean> => {
    return updateData(importedData);
  };

  return (
    <PortfolioDataContext.Provider
      value={{
        data,
        isLoading,
        updateData,
        resetToDefaults,
        importData,
        refreshData: fetchServerData,
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioDataProvider");
  }
  return context;
}

