"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Save,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
  Share2,
  Sparkles,
  BarChart3,
  LogOut,
  Eye,
  X,
  Download,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Phone,
  Key,
  ShieldCheck,
} from "lucide-react";
import { usePortfolioData, DRAFT_STORAGE_KEY } from "@/context/PortfolioDataContext";
import {
  PortfolioData,
  ExperienceItem,
  AiProjectItem,
  PosterItem,
  ResultsData,
} from "@/types/portfolio";

export default function AdminPage() {
  const { data: globalData, updateData, resetToDefaults } = usePortfolioData();
  const [formData, setFormData] = useState<PortfolioData | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);
  const initialLoadDone = useRef<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Password Management Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
  const [currentPwdInput, setCurrentPwdInput] = useState<string>("");
  const [newPwdInput, setNewPwdInput] = useState<string>("");
  const [confirmNewPwdInput, setConfirmNewPwdInput] = useState<string>("");
  const [pwdModalMsg, setPwdModalMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "resume" | "experiences" | "socials" | "projects" | "results" | "posters"
  >("resume");

  // Save / Upload UI Feedback
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Drag & drop active state for posters
  const [dragOverPosterId, setDragOverPosterId] = useState<string | null>(null);
  const [isDraggingNewPoster, setIsDraggingNewPoster] = useState<boolean>(false);

  // File Input Refs
  const resumeFileInputRef = useRef<HTMLInputElement>(null);

  // Check saved session on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem("portfolio_admin_auth");
    if (sessionToken && sessionToken.startsWith("valid_admin_session")) {
      setIsAuthenticated(true);
    }
  }, []);

  // Initialize form state (checking local draft first to prevent loss on refresh)
  useEffect(() => {
    if (initialLoadDone.current) return;

    if (typeof window !== "undefined") {
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && parsed.personal && parsed.experiences) {
            setFormData(parsed);
            setIsDirty(true);
            setHasRestoredDraft(true);
            initialLoadDone.current = true;
            return;
          }
        }
      } catch {
        // ignore
      }
    }

    if (globalData) {
      setFormData(JSON.parse(JSON.stringify(globalData)));
      initialLoadDone.current = true;
    }
  }, [globalData]);

  // Auto-save draft to localStorage whenever formData is modified
  useEffect(() => {
    if (!formData || !initialLoadDone.current || !globalData) return;

    try {
      const isDifferent =
        JSON.stringify({ ...formData, lastUpdated: 0 }) !==
        JSON.stringify({ ...globalData, lastUpdated: 0 });

      setIsDirty(isDifferent);

      if (isDifferent && typeof window !== "undefined") {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      } else if (!isDifferent && typeof window !== "undefined") {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [formData, globalData]);

  // Warn user if refreshing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to refresh?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Handle Login via Server-side Auth API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthenticating(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: password.trim() }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setIsAuthenticated(true);
        localStorage.setItem("portfolio_admin_auth", resData.token || "valid_admin_session");
        setIsAuthenticating(false);
      } else {
        setAuthError(resData.error || "Incorrect password. Access denied.");
        setIsAuthenticating(false);
      }
    } catch {
      setAuthError("Authentication service error. Please try again.");
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_auth");
    setIsAuthenticated(false);
    setPassword("");
  };

  // Handle Change Password Submit via Server API
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdModalMsg(null);

    if (newPwdInput.trim().length < 6) {
      setPwdModalMsg({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }
    if (newPwdInput.trim() !== confirmNewPwdInput.trim()) {
      setPwdModalMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          currentPassword: currentPwdInput.trim(),
          newPassword: newPwdInput.trim(),
        }),
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setPwdModalMsg({
          type: "success",
          text: "Password updated successfully on server! Keep your new password safe.",
        });

        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setCurrentPwdInput("");
          setNewPwdInput("");
          setConfirmNewPwdInput("");
          setPwdModalMsg(null);
          setSaveSuccess("Admin password updated!");
          setTimeout(() => setSaveSuccess(null), 3000);
        }, 2000);
      } else {
        setPwdModalMsg({ type: "error", text: resData.error || "Failed to update password." });
      }
    } catch {
      setPwdModalMsg({ type: "error", text: "Network error while saving password." });
    }
  };

  // Save All Changes
  const handleSaveChanges = async () => {
    if (!formData) return;
    setIsSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    const success = await updateData(formData);
    setIsSaving(false);

    if (success) {
      setIsDirty(false);
      setHasRestoredDraft(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
      setSaveSuccess("Portfolio updated successfully! Changes are live.");
      setTimeout(() => setSaveSuccess(null), 4000);
    } else {
      setSaveError("Failed to save changes to server disk. Your edits remain cached locally.");
      setTimeout(() => setSaveError(null), 4000);
    }
  };

  // Discard Unsaved Draft
  const handleDiscardDraft = () => {
    if (confirm("Are you sure you want to discard unsaved edits and restore the published portfolio?")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
      setFormData(JSON.parse(JSON.stringify(globalData)));
      setIsDirty(false);
      setHasRestoredDraft(false);
      setSaveSuccess("Draft discarded. Reverted to published portfolio.");
      setTimeout(() => setSaveSuccess(null), 3000);
    }
  };

  // Handle Resume File Selection with real server upload
  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }

    try {
      setUploadMessage("Uploading resume PDF to project...");
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const resData = await res.json();
      if (resData.success && resData.url) {
        setFormData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            personal: {
              ...prev.personal,
              resumeUrl: resData.url,
              resumeFileName: resData.fileName || file.name,
            },
          };
        });
        setUploadMessage(`Resume successfully uploaded: ${resData.url}! Click 'Save All Changes' to apply.`);
      } else {
        throw new Error(resData.error || "Upload failed");
      }
    } catch (err) {
      console.error("Resume upload error:", err);
      // Fallback to setting path
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          personal: {
            ...prev.personal,
            resumeUrl: `/${cleanName}`,
            resumeFileName: cleanName,
          },
        };
      });
      setUploadMessage(`Resume path set to /${cleanName}.`);
    }

    setTimeout(() => setUploadMessage(null), 6000);

    if (resumeFileInputRef.current) {
      resumeFileInputRef.current.value = "";
    }
  };

  // Helper to upload file directly to server public folder
  const uploadFileToServer = async (
    file: File,
    folder: string = ""
  ): Promise<{ success: boolean; url: string; fileName: string; isVideo?: boolean } | null> => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const resData = await res.json();
      if (resData.success && resData.url) {
        const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
        return { success: true, url: resData.url, fileName: resData.fileName, isVideo };
      }
      return null;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  // Helper to read an image file as Data URL (fallback)
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle Drag & Drop / File selection for Poster Images & Videos
  const handlePosterMediaUpload = async (posterIndex: number, file: File) => {
    const isMedia =
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      /\.(png|jpg|jpeg|webp|gif|svg|mp4|webm|mov|m4v)$/i.test(file.name);

    if (!isMedia) {
      alert("Please upload an image file (PNG, JPG, WEBP) or video (MP4, WEBM, MOV).");
      return;
    }

    setSaveSuccess("Uploading media asset...");
    const uploadRes = await uploadFileToServer(file, "posters");

    if (uploadRes && uploadRes.url) {
      setFormData((prev) => {
        if (!prev) return prev;
        const updated = [...prev.posters];
        updated[posterIndex] = {
          ...updated[posterIndex],
          src: uploadRes.url,
          mediaType: uploadRes.isVideo ? "video" : "image",
        };
        return { ...prev, posters: updated };
      });
      setSaveSuccess(`Media uploaded for poster #${posterIndex + 1}! Click 'Save All Changes' to save.`);
    } else {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const isVideo = file.type.startsWith("video/");
        setFormData((prev) => {
          if (!prev) return prev;
          const updated = [...prev.posters];
          updated[posterIndex] = {
            ...updated[posterIndex],
            src: dataUrl,
            mediaType: isVideo ? "video" : "image",
          };
          return { ...prev, posters: updated };
        });
        setSaveSuccess(`Updated media for poster #${posterIndex + 1}!`);
      } catch (err) {
        console.error(err);
        alert("Failed to process media file.");
      }
    }
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // Handle Drag & Drop / Upload for Proof Images (Instagram, Meta, Google, YouTube)
  const handleProofMediaUpload = async (
    target: "instagram" | "meta" | "google" | "youtube",
    file: File
  ) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }

    setSaveSuccess(`Uploading ${target} proof screenshot...`);
    const uploadRes = await uploadFileToServer(file, "posters");
    const urlToUse = uploadRes?.url || (await readFileAsDataUrl(file));

    setFormData((prev) => {
      if (!prev) return prev;
      const updatedResults = { ...prev.results };
      if (target === "instagram") {
        updatedResults.instagram = {
          ...updatedResults.instagram,
          proofImage: urlToUse,
          proofType: "image",
        };
      } else if (target === "meta") {
        updatedResults.metaAds = {
          ...updatedResults.metaAds,
          proofImage: urlToUse,
          proofType: "image",
        };
      } else if (target === "google") {
        updatedResults.googleAds = {
          ...updatedResults.googleAds,
          proofImage: urlToUse,
          proofType: "image",
        };
      } else if (target === "youtube") {
        updatedResults.youtube = {
          ...updatedResults.youtube,
          proofImage: urlToUse,
          proofType: "image",
        };
      }
      return { ...prev, results: updatedResults };
    });
    setSaveSuccess(`Updated ${target} proof image!`);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // Add new Poster / Reel
  const handleAddPoster = () => {
    const newPoster: PosterItem = {
      id: `poster-${Date.now()}`,
      src: "/posters/1.png",
      title: "NEW CAMPAIGN ASSET",
      tag: "CREATIVE STRATEGY",
      mediaType: "image",
      offsetStyle: "translate-y-0",
    };
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        posters: [...(prev.posters || []), newPoster],
      };
    });
    setSaveSuccess("New Poster / Reel added! You can now customize or upload media.");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Add new Internship
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      num: String((formData?.experiences?.length || 0) + 1).padStart(2, "0"),
      company: "NEW COMPANY",
      context: "Role Title (Date – Present)",
      focusAreas: ["META ADS", "GROWTH STRATEGY"],
      summary: "Key achievements, campaigns managed, and contributions delivered during this role.",
    };
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        experiences: [...(prev.experiences || []), newExp],
      };
    });
    setSaveSuccess("New Internship added! Scroll down to edit details.");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Move poster Up / Down
  const movePoster = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      if (!prev) return prev;
      const posters = [...prev.posters];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= posters.length) return prev;

      const temp = posters[index];
      posters[index] = posters[targetIndex];
      posters[targetIndex] = temp;

      return { ...prev, posters };
    });
  };

  // Delete poster / reel
  const handleDeletePoster = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updated = prev.posters.filter((_, i) => i !== index);
      return { ...prev, posters: updated };
    });
    setSaveSuccess("Poster removed! Click 'Save All Changes' to save.");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Delete internship / experience
  const handleDeleteExperience = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updated = prev.experiences.filter((_, i) => i !== index);
      return { ...prev, experiences: updated };
    });
    setSaveSuccess("Internship removed! Click 'Save All Changes' to save.");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Add AI Project
  const handleAddProject = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newProj: AiProjectItem = {
        id: `proj-${Date.now()}`,
        number: String((prev.aiProjects?.length || 0) + 1).padStart(2, "0"),
        title: "NEW AI PROJECT",
        subtitle: "Brief project subtitle & problem solved",
        badge: "AI Automation",
        category: "Agent / Pipeline",
        description: "Detailed overview of the engineering, architecture, and marketing impact.",
        highlights: ["Key capability 1", "Key capability 2"],
        techStack: ["Next.js", "TypeScript", "Python", "LLMs"],
        metrics: [
          { label: "Efficiency", value: "10x Faster" },
          { label: "Accuracy", value: "99.8%" },
        ],
        liveUrl: "",
        videoUrl: "",
        githubUrl: "https://github.com/ritesh082",
      };
      return { ...prev, aiProjects: [...(prev.aiProjects || []), newProj] };
    });
    setSaveSuccess("New AI Project added! Scroll down to configure details.");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Delete AI Project
  const handleDeleteProject = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updated = prev.aiProjects.filter((_, i) => i !== index);
      return { ...prev, aiProjects: updated };
    });
    setSaveSuccess("AI Project removed! Click 'Save All Changes' to apply.");
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // Export JSON backup file
  const handleExportJson = () => {
    if (!formData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "portfolioData.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSaveSuccess("Exported portfolioData.json!");
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // Import JSON backup file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.personal && json.experiences) {
          setFormData(json);
          updateData(json);
          setSaveSuccess("Imported and applied data successfully!");
          setTimeout(() => setSaveSuccess(null), 3000);
        } else {
          alert("Invalid portfolio JSON structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Reset to Defaults
  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all portfolio data to default?")) {
      const success = await resetToDefaults();
      if (success) {
        setSaveSuccess("Reset to default successfully!");
        setTimeout(() => setSaveSuccess(null), 3000);
      }
    }
  };

  // ──────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3e8d]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffb347]/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#111827]/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-8"
        >
          <div className="text-center space-y-3">
            <div className="w-14 h-14 harsh-gradient rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg shadow-[#ff3e8d]/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Portfolio Admin
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Manage resume, internship points, results, proof screenshots, and creative posters.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-[#1e293b] border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-[#ff3e8d] transition-colors"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 harsh-gradient text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{isAuthenticating ? "Authenticating..." : "Unlock Dashboard"}</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-slate-400 hover:text-[#ff3e8d] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>← Return to Public Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#ff3e8d] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-[#ff3e8d] selection:text-white pb-24">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-[#111827]/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 harsh-gradient rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase text-white tracking-tight">
                  Portfolio Admin Panel
                </h1>
                {isDirty ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    UNSAVED DRAFT
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    LIVE SYNCED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Manage resume, results, posters, internships, contacts &amp; projects
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportJson}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download portfolioData.json file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export JSON</span>
            </button>

            <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#ffb347]" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#ff3e8d]" />
              <span>Preview Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsPasswordModalOpen(true);
                setPwdModalMsg(null);
                setCurrentPwdInput("");
                setNewPwdInput("");
                setConfirmNewPwdInput("");
              }}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Change Admin Password"
            >
              <Key className="w-3.5 h-3.5 text-[#ffb347]" />
              <span>Password</span>
            </button>

            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-5 py-2 harsh-gradient text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Change Password Modal ── */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPasswordModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#111827] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 cursor-default"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl harsh-gradient text-white flex items-center justify-center shadow-md">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-lg text-white uppercase">
                      Change Admin Password
                    </h3>
                    <p className="font-mono text-[11px] text-slate-400">
                      Set a custom password for your admin portal
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPwdInput}
                    onChange={(e) => setCurrentPwdInput(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPwdInput}
                    onChange={(e) => setNewPwdInput(e.target.value)}
                    placeholder="Enter new password (min. 4 chars)"
                    required
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPwdInput}
                    onChange={(e) => setConfirmNewPwdInput(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                {pwdModalMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      pwdModalMsg.type === "success"
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                        : "bg-red-500/15 border border-red-500/30 text-red-300"
                    }`}
                  >
                    {pwdModalMsg.type === "success" ? (
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    )}
                    <span>{pwdModalMsg.text}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 harsh-gradient text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-lg hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Update Admin Password</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast Notifications ── */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-mono font-bold"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{saveSuccess}</span>
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 p-4 bg-red-500 text-white rounded-2xl shadow-xl flex items-center gap-3 text-xs font-mono font-bold"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{saveError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* ── Restored Draft Notice ── */}
        <AnimatePresence>
          {hasRestoredDraft && isDirty && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-amber-300 uppercase">
                    Restored Unsaved Local Draft
                  </h4>
                  <p className="text-[11px] font-sans text-slate-300">
                    Your previous edits were recovered from local cache. Click &apos;Save Changes&apos; to publish or discard to revert.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition-colors cursor-pointer"
                >
                  Discard Draft
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="px-4 py-1.5 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Publishing..." : "Publish Live"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Navigation Tabs ── */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "resume"
                ? "bg-[#ff3e8d] text-white shadow-lg shadow-[#ff3e8d]/25"
                : "bg-[#161f30] text-slate-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Resume &amp; Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "results"
                ? "bg-[#ff3e8d] text-white shadow-lg shadow-[#ff3e8d]/25"
                : "bg-[#161f30] text-slate-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Results &amp; Proofs</span>
          </button>

          <button
            onClick={() => setActiveTab("posters")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "posters"
                ? "bg-[#ff3e8d] text-white shadow-lg shadow-[#ff3e8d]/25"
                : "bg-[#161f30] text-slate-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Posters &amp; Reels ({formData.posters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("experiences")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "experiences"
                ? "bg-[#ff3e8d] text-white shadow-lg shadow-[#ff3e8d]/25"
                : "bg-[#161f30] text-slate-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Internships ({formData.experiences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("socials")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "socials"
                ? "bg-[#ff3e8d] text-white shadow-lg shadow-[#ff3e8d]/25"
                : "bg-[#161f30] text-slate-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Contact &amp; Socials</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#ff3e8d] text-white shadow-lg shadow-[#ff3e8d]/25"
                : "bg-[#161f30] text-slate-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Projects ({formData.aiProjects.length})</span>
          </button>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 1: RESUME & PROFILE */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "resume" && (
          <div className="space-y-8">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <h2 className="text-xl font-black uppercase text-white flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-[#ff3e8d]" />
                    <span>Resume PDF Management</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select or customize your latest resume PDF path.
                  </p>
                </div>

                <a
                  href={formData.personal.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>View Current Resume</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#ff3e8d]" />
                </a>
              </div>

              {/* Upload Drop Zone */}
              <div
                onClick={() => resumeFileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-[#ff3e8d] bg-[#161f30]/60 hover:bg-[#161f30] rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer space-y-3 group"
              >
                <input
                  type="file"
                  ref={resumeFileInputRef}
                  onChange={handleResumeFileSelect}
                  accept=".pdf,application/pdf"
                  className="hidden"
                />

                <div className="w-16 h-16 harsh-gradient rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase font-mono">
                    Click to Select Resume PDF
                  </p>
                  <p className="text-xs text-slate-400">
                    Supports .PDF format (e.g. Ritesh_Patel.pdf)
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full text-[11px] font-mono text-[#ffb347]">
                  <span>Active Link: {formData.personal.resumeUrl}</span>
                </div>
              </div>

              {uploadMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{uploadMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Resume Path / URL
                  </label>
                  <input
                    type="text"
                    value={formData.personal.resumeUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, resumeUrl: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Resume File Name
                  </label>
                  <input
                    type="text"
                    value={formData.personal.resumeFileName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, resumeFileName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Profile & Hero Headings Card */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black uppercase text-white border-b border-slate-800 pb-4">
                Personal Information &amp; Bio
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.personal.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, name: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Badge / Availability Text
                  </label>
                  <input
                    type="text"
                    value={formData.personal.badgeText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, badgeText: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={formData.personal.heroHeading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, heroHeading: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Hero Subtitle &amp; Narrative
                  </label>
                  <textarea
                    rows={3}
                    value={formData.personal.heroSubtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, heroSubtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Availability / Work Note
                  </label>
                  <input
                    type="text"
                    value={formData.personal.availability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: { ...formData.personal, availability: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 2: RESULTS & PROOFS (ALL 4 CARDS) */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-black uppercase text-white flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-[#ff3e8d]" />
                <span>Performance Results &amp; Proof Cards</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize every number, title, subtext, proof image, and link for the 4 Performance Cards.
              </p>
            </div>

            {/* Top Stat Summary Band */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-mono font-bold uppercase text-[#ff3e8d] tracking-wider">
                Top Summary Stat Badges (Top Right Band)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Experience Badge (e.g. 1 YR)
                  </label>
                  <input
                    type="text"
                    value={formData.results.topStats?.experienceYears || "1 YR"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          topStats: {
                            ...formData.results.topStats,
                            experienceYears: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Ad Sets Badge (e.g. MULTI+)
                  </label>
                  <input
                    type="text"
                    value={formData.results.topStats?.adSets || "MULTI+"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          topStats: {
                            ...formData.results.topStats,
                            adSets: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Median ROAS Badge (e.g. +45%)
                  </label>
                  <input
                    type="text"
                    value={formData.results.topStats?.medianRoas || "+45%"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          topStats: {
                            ...formData.results.topStats,
                            medianRoas: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CARD 1: INSTAGRAM / VIRAL CONTENT IMPACT */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#ff3e8d]/20 text-[#ff3e8d] font-mono text-xs font-bold rounded-lg uppercase">
                    CARD 01
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">
                    Social Performance — Viral Content Impact
                  </h3>
                </div>

                {/* Proof Mode Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-[#1e293b] border border-slate-700 rounded-xl font-mono text-[11px] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            instagram: { ...prev.results.instagram, proofType: "link" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.instagram.proofType === "link" || !formData.results.instagram.proofType
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔗 External Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            instagram: {
                              ...prev.results.instagram,
                              proofType: "image",
                              proofImage: prev.results.instagram.proofImage || "/posters/1.png",
                            },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.instagram.proofType === "image"
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🖼️ Image Proof
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={formData.results.instagram.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          instagram: {
                            ...formData.results.instagram,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Views Number &amp; Suffix (e.g. 262 + K+)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.results.instagram.viewsValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            instagram: {
                              ...formData.results.instagram,
                              viewsValue: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-2/3 px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                    <input
                      type="text"
                      value={formData.results.instagram.viewsSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            instagram: {
                              ...formData.results.instagram,
                              viewsSuffix: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="K+"
                      className="w-1/3 px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Card Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.results.instagram.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          instagram: {
                            ...formData.results.instagram,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Stat Label
                  </label>
                  <input
                    type="text"
                    value={formData.results.instagram.viewsLabel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          instagram: {
                            ...formData.results.instagram,
                            viewsLabel: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Proof Section: Link OR Image */}
              {formData.results.instagram.proofType === "image" ? (
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Instagram Screenshot Proof (Drag &amp; drop or upload)
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProofMediaUpload("instagram", file);
                    }}
                    className="border-2 border-dashed border-slate-700 hover:border-[#ff3e8d] bg-[#161f30]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-colors"
                  >
                    <div className="w-28 h-20 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      {formData.results.instagram.proofImage ? (
                        <img
                          src={formData.results.instagram.proofImage}
                          alt="Instagram Proof"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <input
                        type="text"
                        placeholder="Proof Image Path (e.g. /posters/instagram_proof.png)"
                        value={formData.results.instagram.proofImage || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              instagram: {
                                ...formData.results.instagram,
                                proofImage: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Proof Modal Title"
                        value={formData.results.instagram.proofTitle || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              instagram: {
                                ...formData.results.instagram,
                                proofTitle: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                    </div>
                    <label className="px-4 py-2 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProofMediaUpload("instagram", file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Instagram Target URL (Opens in new tab)
                  </label>
                  <input
                    type="url"
                    value={formData.results.instagram.url || ""}
                    placeholder="https://www.instagram.com/reel/..."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          instagram: {
                            ...formData.results.instagram,
                            url: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              )}
            </div>

            {/* CARD 2: META ADS PERFORMANCE */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#ffb347]/20 text-[#ffb347] font-mono text-xs font-bold rounded-lg uppercase">
                    CARD 02
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">
                    Meta Ads Performance &amp; Proof
                  </h3>
                </div>

                {/* Proof Mode Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-[#1e293b] border border-slate-700 rounded-xl font-mono text-[11px] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            metaAds: { ...prev.results.metaAds, proofType: "image" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.metaAds.proofType === "image" || !formData.results.metaAds.proofType
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🖼️ Image Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            metaAds: { ...prev.results.metaAds, proofType: "link" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.metaAds.proofType === "link"
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔗 External Link
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    All-over Budget (e.g. ₹400)
                  </label>
                  <input
                    type="text"
                    value={formData.results.metaAds.budget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          metaAds: {
                            ...formData.results.metaAds,
                            budget: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Impressions Delivered (e.g. 23.6 K+)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.results.metaAds.impressionsValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            metaAds: {
                              ...formData.results.metaAds,
                              impressionsValue: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-2/3 px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                    <input
                      type="text"
                      value={formData.results.metaAds.impressionsSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            metaAds: {
                              ...formData.results.metaAds,
                              impressionsSuffix: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="K+"
                      className="w-1/3 px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Cost Per Landing Page View (e.g. 0.64)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.results.metaAds.cplvPrefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            metaAds: {
                              ...formData.results.metaAds,
                              cplvPrefix: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="₹"
                      className="w-1/4 px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none text-center"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.results.metaAds.cplvValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            metaAds: {
                              ...formData.results.metaAds,
                              cplvValue: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-3/4 px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Proof Section: Link OR Image */}
              {formData.results.metaAds.proofType === "link" ? (
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Meta Ads Campaign / Report Link
                  </label>
                  <input
                    type="url"
                    value={formData.results.metaAds.url || ""}
                    placeholder="https://facebook.com/ads/..."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          metaAds: {
                            ...formData.results.metaAds,
                            url: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Meta Campaign Proof Image (Drag &amp; drop or upload screenshot)
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProofMediaUpload("meta", file);
                    }}
                    className="border-2 border-dashed border-slate-700 hover:border-[#ff3e8d] bg-[#161f30]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-colors"
                  >
                    <div className="w-28 h-20 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={formData.results.metaAds.proofImage}
                        alt="Meta Proof"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <input
                        type="text"
                        placeholder="Proof Image URL"
                        value={formData.results.metaAds.proofImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              metaAds: {
                                ...formData.results.metaAds,
                                proofImage: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Proof Title / Description"
                        value={formData.results.metaAds.proofTitle || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              metaAds: {
                                ...formData.results.metaAds,
                                proofTitle: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                    </div>
                    <label className="px-4 py-2 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProofMediaUpload("meta", file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 3: GOOGLE ADS PERFORMANCE */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#ff3e8d]/20 text-[#ff3e8d] font-mono text-xs font-bold rounded-lg uppercase">
                    CARD 03
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">
                    Google Ads Performance &amp; Funnel Metrics
                  </h3>
                </div>

                {/* Proof Mode Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-[#1e293b] border border-slate-700 rounded-xl font-mono text-[11px] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            googleAds: { ...prev.results.googleAds, proofType: "image" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.googleAds.proofType === "image" || !formData.results.googleAds.proofType
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🖼️ Image Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            googleAds: { ...prev.results.googleAds, proofType: "link" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.googleAds.proofType === "link"
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔗 External Link
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Total Impressions
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.results.googleAds.impressionsValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          googleAds: {
                            ...formData.results.googleAds,
                            impressionsValue: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Clicks (K)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.results.googleAds.clicksValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          googleAds: {
                            ...formData.results.googleAds,
                            clicksValue: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Local Actions
                  </label>
                  <input
                    type="number"
                    value={formData.results.googleAds.localActionsValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          googleAds: {
                            ...formData.results.googleAds,
                            localActionsValue: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Calls / Sales
                  </label>
                  <input
                    type="number"
                    value={formData.results.googleAds.callsValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          googleAds: {
                            ...formData.results.googleAds,
                            callsValue: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Total Spend (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.results.googleAds.spendValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          googleAds: {
                            ...formData.results.googleAds,
                            spendValue: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Proof Section: Link OR Image */}
              {formData.results.googleAds.proofType === "link" ? (
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Google Ads Shared Dashboard / Report URL
                  </label>
                  <input
                    type="url"
                    value={formData.results.googleAds.url || ""}
                    placeholder="https://ads.google.com/..."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          googleAds: {
                            ...formData.results.googleAds,
                            url: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Google Ads Campaign Proof Image (Drag &amp; drop or upload)
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProofMediaUpload("google", file);
                    }}
                    className="border-2 border-dashed border-slate-700 hover:border-[#ff3e8d] bg-[#161f30]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-colors"
                  >
                    <div className="w-28 h-20 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={formData.results.googleAds.proofImage}
                        alt="Google Proof"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <input
                        type="text"
                        placeholder="Google Proof Image URL"
                        value={formData.results.googleAds.proofImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              googleAds: {
                                ...formData.results.googleAds,
                                proofImage: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Google Proof Title"
                        value={formData.results.googleAds.proofTitle || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              googleAds: {
                                ...formData.results.googleAds,
                                proofTitle: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                    </div>
                    <label className="px-4 py-2 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProofMediaUpload("google", file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 4: YOUTUBE PERFORMANCE */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#ff3e8d]/20 text-[#ff3e8d] font-mono text-xs font-bold rounded-lg uppercase">
                    CARD 04
                  </span>
                  <h3 className="text-lg font-black uppercase text-white">
                    YouTube Performance &amp; Views
                  </h3>
                </div>

                {/* Proof Mode Selector */}
                <div className="flex items-center gap-1.5 p-1 bg-[#1e293b] border border-slate-700 rounded-xl font-mono text-[11px] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            youtube: { ...prev.results.youtube, proofType: "image" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.youtube.proofType === "image" || !formData.results.youtube.proofType
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🖼️ Image Proof
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          results: {
                            ...prev.results,
                            youtube: { ...prev.results.youtube, proofType: "link" },
                          },
                        };
                      });
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      formData.results.youtube.proofType === "link"
                        ? "bg-[#ff3e8d] text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🔗 External Link
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={formData.results.youtube.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          youtube: {
                            ...formData.results.youtube,
                            title: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Lifetime Views (e.g. 75.8 K+)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.results.youtube.viewsValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            youtube: {
                              ...formData.results.youtube,
                              viewsValue: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-2/3 px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                    <input
                      type="text"
                      value={formData.results.youtube.viewsSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          results: {
                            ...formData.results,
                            youtube: {
                              ...formData.results.youtube,
                              viewsSuffix: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="K+"
                      className="w-1/3 px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Card Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.results.youtube.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          youtube: {
                            ...formData.results.youtube,
                            subtitle: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Proof Section: Link OR Image */}
              {formData.results.youtube.proofType === "link" ? (
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    YouTube Video / Channel URL
                  </label>
                  <input
                    type="url"
                    value={formData.results.youtube.url || ""}
                    placeholder="https://youtube.com/@channel or https://youtube.com/shorts/..."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        results: {
                          ...formData.results,
                          youtube: {
                            ...formData.results.youtube,
                            url: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    YouTube Analytics Proof Image (Drag &amp; drop or upload screenshot)
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleProofMediaUpload("youtube", file);
                    }}
                    className="border-2 border-dashed border-slate-700 hover:border-[#ff3e8d] bg-[#161f30]/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-colors"
                  >
                    <div className="w-28 h-20 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={formData.results.youtube.proofImage}
                        alt="YouTube Proof"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <input
                        type="text"
                        placeholder="YouTube Proof Image URL"
                        value={formData.results.youtube.proofImage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              youtube: {
                                ...formData.results.youtube,
                                proofImage: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Proof Title / Label"
                        value={formData.results.youtube.proofTitle || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            results: {
                              ...formData.results,
                              youtube: {
                                ...formData.results.youtube,
                                proofTitle: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                      />
                    </div>
                    <label className="px-4 py-2 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl cursor-pointer shrink-0">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProofMediaUpload("youtube", file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 3: POSTERS & CREATIVE REEL (DRAG & DROP) */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "posters" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black uppercase text-white flex items-center gap-2.5">
                  <ImageIcon className="w-5 h-5 text-[#ff3e8d]" />
                  <span>Creative Work Reel Posters</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Drag and drop images onto any poster card to replace it instantly, reorder, or add new posters.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPoster}
                className="px-4 py-2.5 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add Poster / Reel</span>
              </button>
            </div>

            {/* Poster Cards Grid with Drag & Drop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formData.posters.map((poster, index) => {
                const isDragOver = dragOverPosterId === poster.id;
                const isVideo =
                  poster.mediaType === "video" ||
                  /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(poster.src) ||
                  poster.src.startsWith("data:video");

                return (
                  <div
                    key={poster.id || index}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverPosterId(poster.id);
                    }}
                    onDragLeave={() => setDragOverPosterId(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverPosterId(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handlePosterMediaUpload(index, file);
                    }}
                    className={`bg-[#111827] border rounded-3xl p-5 space-y-4 transition-all relative group ${
                      isDragOver
                        ? "border-[#ff3e8d] ring-2 ring-[#ff3e8d]/40 bg-[#1e293b]"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Header Row: Index + Reorder + Delete */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg harsh-gradient text-white flex items-center justify-center font-mono font-bold text-xs">
                          {index + 1}
                        </span>
                        <span className="font-mono text-xs text-slate-400 font-bold uppercase">
                          ITEM #{index + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            isVideo
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          }`}
                        >
                          {isVideo ? "🎬 VIDEO" : "🖼️ IMAGE"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => movePoster(index, "up")}
                          disabled={index === 0}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Move Left / Earlier"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePoster(index, "down")}
                          disabled={index === formData.posters.length - 1}
                          className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Move Right / Later"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePoster(index)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer ml-1"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Drag & Drop Poster/Video Thumbnail Container */}
                    <div className="relative aspect-[4/5] bg-[#090d16] border border-slate-700/80 rounded-2xl overflow-hidden group/img">
                      {isVideo ? (
                        <video
                          src={poster.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <img
                          src={poster.src}
                          alt={poster.title}
                          className="w-full h-full object-cover object-top"
                        />
                      )}

                      {/* Drag overlay hint */}
                      <div className="absolute inset-0 bg-[#0f172a]/85 backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <Upload className="w-8 h-8 text-[#ff3e8d] animate-bounce" />
                        <p className="font-mono text-xs font-bold text-white uppercase">
                          Drop Image or Video Here
                        </p>
                        <p className="font-mono text-[10px] text-slate-400">
                          Supports PNG, JPG, MP4, WEBM
                        </p>
                        <label className="px-3 py-1.5 harsh-gradient text-white text-[10px] font-mono font-bold uppercase rounded-lg cursor-pointer shadow-sm">
                          Browse Media File
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePosterMediaUpload(index, file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {isDragOver && (
                        <div className="absolute inset-0 bg-[#ff3e8d]/30 border-2 border-[#ff3e8d] flex items-center justify-center font-mono text-sm font-bold text-white uppercase">
                          Drop to Replace!
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          Asset / Reel Headline
                        </label>
                        <input
                          type="text"
                          value={poster.title}
                          onChange={(e) => {
                            const updated = [...formData.posters];
                            updated[index].title = e.target.value.toUpperCase();
                            setFormData({ ...formData, posters: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase text-slate-400">
                            Category / Tag
                          </label>
                          <input
                            type="text"
                            value={poster.tag}
                            onChange={(e) => {
                              const updated = [...formData.posters];
                              updated[index].tag = e.target.value.toUpperCase();
                              setFormData({ ...formData, posters: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold uppercase text-slate-400">
                            Media Type
                          </label>
                          <select
                            value={poster.mediaType || (isVideo ? "video" : "image")}
                            onChange={(e) => {
                              const updated = [...formData.posters];
                              updated[index].mediaType = e.target.value as "image" | "video";
                              setFormData({ ...formData, posters: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-400">
                          Media URL / Path
                        </label>
                        <input
                          type="text"
                          value={poster.src}
                          onChange={(e) => {
                            const updated = [...formData.posters];
                            updated[index].src = e.target.value;
                            setFormData({ ...formData, posters: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-[11px] focus:border-[#ff3e8d] outline-none text-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 4: INTERNSHIPS / EXPERIENCE */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase text-white">
                  Work Experience &amp; Internships
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add, update or delete internship records and their respective bullet point focus tags.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddExperience}
                className="px-4 py-2.5 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Internship</span>
              </button>
            </div>

            {formData.experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl harsh-gradient text-white flex items-center justify-center font-mono font-bold text-xs">
                      {exp.num || index + 1}
                    </span>
                    <span className="font-mono text-xs text-slate-400 uppercase font-bold">
                      Chapter #{index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteExperience(index)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[index].company = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Role &amp; Duration (e.g. Digital Marketing Intern (May 2026 – Present))
                    </label>
                    <input
                      type="text"
                      value={exp.context}
                      onChange={(e) => {
                        const updated = [...formData.experiences];
                        updated[index].context = e.target.value;
                        setFormData({ ...formData, experiences: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center justify-between">
                    <span>Key Focus Badges / Pointers (Click '×' to remove)</span>
                  </label>

                  <div className="flex flex-wrap gap-2 p-3 bg-[#1e293b]/60 border border-slate-700 rounded-2xl">
                    {exp.focusAreas.map((area, areaIdx) => (
                      <span
                        key={areaIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0f172a] border border-slate-600 text-[#ffb347] font-mono text-xs rounded-lg font-bold"
                      >
                        <span>{area}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.experiences];
                            updated[index].focusAreas = updated[index].focusAreas.filter(
                              (_, i) => i !== areaIdx
                            );
                            setFormData({ ...formData, experiences: updated });
                          }}
                          className="hover:text-red-400 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      placeholder="+ Type new pointer & hit Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim().toUpperCase();
                          const updated = [...formData.experiences];
                          updated[index].focusAreas.push(val);
                          setFormData({ ...formData, experiences: updated });
                          e.currentTarget.value = "";
                        }
                      }}
                      className="px-3 py-1 bg-transparent text-white placeholder-slate-500 font-mono text-xs focus:outline-none min-w-[200px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Summary &amp; Deliverables
                  </label>
                  <textarea
                    rows={3}
                    value={exp.summary}
                    onChange={(e) => {
                      const updated = [...formData.experiences];
                      updated[index].summary = e.target.value;
                      setFormData({ ...formData, experiences: updated });
                    }}
                    className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 5: CONTACT & SOCIALS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "socials" && (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-black uppercase text-white">
                Contact &amp; Social Channels
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure direct email, phone, LinkedIn, Instagram, and social handles across the portfolio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-400">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                      socials: { ...formData.socials, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-400">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                      socials: { ...formData.socials, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-400">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socials.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://www.linkedin.com/in/..."
                  className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-400">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socials.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-400">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socials.github}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socials: { ...formData.socials, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase text-slate-400">
                  Response Time Note
                </label>
                <input
                  type="text"
                  value={formData.contact.responseTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, responseTime: e.target.value },
                    })
                  }
                  placeholder="e.g. < 24 Hours"
                  className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* TAB 6: PROJECTS & AI APPS */}
        {/* ────────────────────────────────────────────────────────── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase text-white">
                  AI Projects &amp; Software Work
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update live links, GitHub URLs, metrics, and tech stack tags for your showcased AI projects.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddProject}
                className="px-4 py-2.5 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {formData.aiProjects.map((proj, index) => (
              <div
                key={proj.id || index}
                className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl harsh-gradient text-white flex items-center justify-center font-mono font-bold text-xs">
                      {proj.number || index + 1}
                    </span>
                    <span className="font-bold text-white text-base">
                      {proj.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteProject(index)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].title = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Category / Architecture
                    </label>
                    <input
                      type="text"
                      value={proj.category}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].category = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={proj.badge}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].badge = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={proj.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].subtitle = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Project Description
                    </label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].description = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Live Web App URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={proj.liveUrl || ""}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].liveUrl = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      placeholder="https://app.example.com"
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      Demo Video URL (YouTube / Loom)
                    </label>
                    <input
                      type="url"
                      value={proj.videoUrl || ""}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].videoUrl = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase text-slate-400">
                      GitHub Repo URL
                    </label>
                    <input
                      type="url"
                      value={proj.githubUrl || ""}
                      onChange={(e) => {
                        const updated = [...formData.aiProjects];
                        updated[index].githubUrl = e.target.value;
                        setFormData({ ...formData, aiProjects: updated });
                      }}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-[#ff3e8d] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase text-slate-400">
                    Tech Stack Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-[#1e293b]/60 border border-slate-700 rounded-2xl">
                    {proj.techStack.map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0f172a] border border-slate-600 text-[#ff3e8d] font-mono text-xs rounded-lg font-bold"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.aiProjects];
                            updated[index].techStack = updated[index].techStack.filter(
                              (_, i) => i !== techIdx
                            );
                            setFormData({ ...formData, aiProjects: updated });
                          }}
                          className="hover:text-red-400 p-0.5 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add tech & hit Enter"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          const updated = [...formData.aiProjects];
                          updated[index].techStack.push(val);
                          setFormData({ ...formData, aiProjects: updated });
                          e.currentTarget.value = "";
                        }
                      }}
                      className="px-3 py-1 bg-transparent text-white placeholder-slate-500 font-mono text-xs focus:outline-none min-w-[150px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Bottom Controls ── */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 text-xs font-mono font-bold uppercase rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All to Defaults</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="px-8 py-3.5 harsh-gradient text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-lg hover:opacity-95 transition-opacity flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* ── Sticky Floating Action Bar on Unsaved Changes ── */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-xl w-[94%] sm:w-auto bg-[#111827]/95 backdrop-blur-xl border border-[#ff3e8d]/50 rounded-2xl shadow-2xl shadow-black/80 p-3 px-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <p className="text-xs font-mono font-bold text-white uppercase tracking-wide">
                  Unsaved Changes Detected
                </p>
                <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                  Auto-saved in local draft • Publish to push live
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition-colors cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-4 py-1.5 harsh-gradient text-white text-xs font-mono font-bold uppercase rounded-xl shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
