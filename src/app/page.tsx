'use client';

import React, { useState } from "react";
import CinematicIntro from "@/components/CinematicIntro";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkReel from "@/components/WorkReel";
import ResultsSection from "@/components/ResultsSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import PortfolioCharacter from "@/components/PortfolioCharacter";
import { RotateCcw, Mail } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.78v8.37H6.46v-8.37M7.86 6.55a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
    </svg>
  );
}

export default function Home() {
  const [introFinished, setIntroFinished] = useState<boolean>(false);
  const [introKey, setIntroKey] = useState<number>(0);

  const handleReplayIntro = () => {
    setIntroFinished(false);
    setIntroKey((prev: number) => prev + 1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#0f172a] relative">
      {/* 1. Simplified Warm Intro Sequence */}
      <CinematicIntro key={introKey} onComplete={() => setIntroFinished(true)} />

      {/* 2. Sticky Navigation */}
      <Navbar visible={introFinished} />

      {/* Floating Social Sidebar */}
      <aside className="fixed left-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col items-center gap-4 bg-white/85 backdrop-blur-md p-2.5 rounded-2xl border border-slate-200/80 shadow-lg shadow-black/5 pointer-events-auto">
        <a
          href="https://instagram.com/as_ritesh"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-[#64748b] hover:text-[#ff3e8d] hover:bg-[#ff3e8d]/10 transition-all duration-200"
          title="Instagram (@as_ritesh)"
          aria-label="Instagram Profile"
        >
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/ritesh-patel1/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-[#64748b] hover:text-[#0a66c2] hover:bg-[#0a66c2]/10 transition-all duration-200"
          title="LinkedIn Profile"
          aria-label="LinkedIn Profile"
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>
        <a
          href="mailto:riteshpatelofficial18@gmail.com"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-[#64748b] hover:text-[#ffb347] hover:bg-[#ffb347]/10 transition-all duration-200"
          title="Email (riteshpatelofficial18@gmail.com)"
          aria-label="Email Contact"
        >
          <Mail className="w-4 h-4" />
        </a>
        <div className="w-4 h-px bg-slate-200 my-1" />
        <div className="relative flex items-center justify-center w-3 h-3" title="Available for work">
          <div className="absolute inset-0 bg-[#ff3e8d] rounded-full opacity-40 animate-ping" />
          <div className="w-1.5 h-1.5 bg-[#ff3e8d] rounded-full shadow-sm" />
        </div>
      </aside>

      {/* 3. Hero Section */}
      <HeroSection />

      {/* 3.5 Infinite Marquee Banner */}
      <section className="py-10 md:py-14 border-y border-slate-200/80 overflow-hidden bg-white">
        <div className="animate-marquee-left whitespace-nowrap flex gap-10 items-center">
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">Creative Analysis</span>
          <span className="text-[#ff3e8d] text-4xl md:text-6xl font-bold opacity-40">—</span>
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">Data Velocity</span>
          <span className="text-[#ffb347] text-4xl md:text-6xl font-bold opacity-40">—</span>
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">High-Fi Campaigns</span>
          <span className="text-[#ff3e8d] text-4xl md:text-6xl font-bold opacity-40">—</span>
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">Growth Strategy</span>
          <span className="text-[#ffb347] text-4xl md:text-6xl font-bold opacity-40">—</span>
          {/* Duplicate loop */}
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">Creative Analysis</span>
          <span className="text-[#ff3e8d] text-4xl md:text-6xl font-bold opacity-40">—</span>
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">Data Velocity</span>
          <span className="text-[#ffb347] text-4xl md:text-6xl font-bold opacity-40">—</span>
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">High-Fi Campaigns</span>
          <span className="text-[#ff3e8d] text-4xl md:text-6xl font-bold opacity-40">—</span>
          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(15,23,42,0.2)]">Growth Strategy</span>
          <span className="text-[#ffb347] text-4xl md:text-6xl font-bold opacity-40">—</span>
        </div>
      </section>

      {/* 4. Portfolio Sections */}
      <WorkReel />
      <ResultsSection />
      <AboutSection />
      <ExperienceSection />
      <ContactSection />

      {/* 5. Interactive 2D Portfolio Character Buddy */}
      <PortfolioCharacter />

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-slate-200/80 bg-white font-mono text-xs text-[#64748b] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-bold text-[#0f172a]">© 2026 Ritesh Patel</span> — Digital Growth &amp; Creative Strategy
        </div>

        <button
          onClick={handleReplayIntro}
          className="flex items-center gap-2 hover:text-[#ff3e8d] transition-colors cursor-pointer group px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#ff3e8d]/40"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-90 text-[#ff3e8d]" />
          <span>Replay intro</span>
        </button>
      </footer>
    </main>
  );
}