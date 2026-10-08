"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import defaultData from "@/data/portfolioData.json";
import { PortfolioData } from "@/types/portfolio";

const LOCAL_STORAGE_KEY = "ritesh_portfolio_custom_data_v1";

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
  const [data, setData] = useState<PortfolioData>(defaultData as PortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchServerData = useCallback(async () => {
    try {
      const res = await fetch("/api/portfolio-data", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.personal) {
          setData(json.data);
          try {
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
            }
          } catch {
            // Ignore quota errors if data has large fields
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch portfolio data from /api/portfolio-data:", err);
    }

    // Fallback to localStorage
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.personal && parsed.experiences) {
            setData(parsed);
          }
        }
      }
    } catch (err) {
      console.warn("Could not read custom portfolio data from localStorage:", err);
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
      setData(newData);

      // 1. Dispatch custom event for instant local reactive sync
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("portfolio_data_updated", { detail: newData })
        );
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        } catch {
          // Ignore quota error, server persist handles it
        }
      }

      // 2. Persist to server disk
      const res = await fetch("/api/portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      const resJson = await res.json();
      return resJson.success;
    } catch (err) {
      console.error("Failed to save portfolio data:", err);
      return false;
    }
  };

  const resetToDefaults = async (): Promise<boolean> => {
    try {
      setData(defaultData as PortfolioData);
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        window.dispatchEvent(
          new CustomEvent("portfolio_data_updated", { detail: defaultData })
        );
      }

      const res = await fetch("/api/portfolio-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultData),
      });

      const resJson = await res.json();
      return resJson.success;
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
