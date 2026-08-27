"use client";

import React, { lazy } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

// Lazy load the 3D character scene to avoid blocking initial render
const CharacterScene = lazy(() => import("./Character/CharacterScene"));

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] pt-28 pb-16 md:pb-24 flex flex-col justify-center overflow-hidden bg-warm-ambient w-full max-w-full">
      {/* Sunset gradient ambient lighting depth */}
      <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-gradient-to-bl from-[#ff3e8d]/10 via-[#ffb347]/8 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-gradient-to-tr from-[#ff3e8d]/8 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          
          {/* ── Left Column: Dominant Editorial Headline & CTAs (60%) ── */}
          <div className="lg:col-span-7 space-y-7 max-w-2xl">
            {/* Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-[11px] font-mono tracking-widest uppercase text-[#ff3e8d] font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
              <span>Creative Strategist // Digital Growth</span>
            </motion.div>

            {/* Primary Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.92] text-[#0f172a]"
            >
              Digital Growth <br />
              <span className="harsh-text uppercase italic inline-block pr-2 sm:pr-3">Alchemist</span>
            </motion.h1>

            {/* Supporting Narrative with Accent Callout Border */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border-l-[6px] md:border-l-[8px] border-[#ff3e8d] pl-5 bg-white/70 backdrop-blur-sm py-3.5 rounded-r-2xl shadow-sm"
            >
              <p className="text-base sm:text-lg text-[#0f172a] leading-snug font-bold">
                I bridge the gap between creative vision and measurable results. Turning raw data into high-fidelity campaigns.
              </p>
            </motion.div>

            {/* CTA Buttons with Interaction Triggers */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-3"
            >
              {/* Primary CTA */}
              <a
                href="#work"
                data-char-action="work"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("work");
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 harsh-gradient text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
              >
                <span>Explore Selected Work</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {/* Secondary CTA */}
              <a
                href="/Ritesh_Patel_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-char-action="resume"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 border-2 border-[#0f172a] bg-white hover:bg-[#0f172a] hover:text-white text-xs font-black uppercase tracking-wider text-[#0f172a] transition-all duration-300 rounded-xl shadow-[4px_4px_0px_0px_#ffb347]"
              >
                <FileText className="w-4 h-4 text-[#ff3e8d] group-hover:text-white transition-colors" />
                <span>Download Resume</span>
              </a>
            </motion.div>
          </div>

          {/* ── Right Column: Grounded 3D Interactive Character (40%) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col items-center justify-center pt-4 lg:pt-0"
          >
            {/* Ambient Backlight Halo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-br from-[#ff3e8d]/18 via-[#ffb347]/12 to-transparent blur-[60px]" />
            </div>

            {/* Character Viewport (Grounded & Sized to ~35-40% visual emphasis) */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] aspect-[4/5]">
              <React.Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full border-2 border-[#ff3e8d]/25 border-t-[#ff3e8d] animate-spin" />
                  </div>
                }
              >
                <CharacterScene className="w-full h-full" />
              </React.Suspense>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
