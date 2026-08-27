"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Maximize2, TrendingUp, Phone, Layers, Share2, Play } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import ProofModal from "./ProofModal";

// Custom SVG Icons for Instagram & YouTube
function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

interface ProofModalState {
  isOpen: boolean;
  imageSrc: string;
  imageAlt: string;
  sourceLabel: string;
  title: string;
}

export default function ResultsSection() {
  const [modalState, setModalState] = useState<ProofModalState>({
    isOpen: false,
    imageSrc: "",
    imageAlt: "",
    sourceLabel: "",
    title: "",
  });

  const openModal = (imageSrc: string, imageAlt: string, sourceLabel: string, title: string) => {
    setModalState({
      isOpen: true,
      imageSrc,
      imageAlt,
      sourceLabel,
      title,
    });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const INSTAGRAM_REEL_URL =
    "https://www.instagram.com/reel/DaK3sgMIUJ5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==&igsi=MzRlODBiNWFlZA==";

  return (
    <section id="results" className="relative py-28 border-t border-slate-200/80 bg-white text-[#0f172a] select-none w-full max-w-full overflow-hidden">
      {/* Background Soft Lighting Glow & Precision Micro Grid */}
      <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] bg-gradient-to-r from-[#ff3e8d]/5 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-gradient-to-l from-[#ffb347]/5 to-transparent blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">
        {/* Section Title Header & Stat Summary Band */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 border-b border-slate-200 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2.5 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-[0.25em]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
              <span>PERFORMANCE TRACK RECORD</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0f172a] uppercase leading-none">
              Results that speak louder than <span className="harsh-text">slides.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#64748b] leading-relaxed font-medium pt-1">
              Every campaign is engineered for real impact. Here is how the numbers have moved across real executions and paid media campaigns.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-start justify-start sm:justify-end gap-6 sm:gap-10 shrink-0 self-start lg:self-center"
          >
            <div className="text-left sm:text-right whitespace-nowrap">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff3e8d] to-[#ffb347] whitespace-nowrap leading-none">
                1 YR
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] mt-1.5 font-bold">
                Experience
              </div>
            </div>
            <div className="text-left sm:text-right whitespace-nowrap">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ffb347] to-[#ff3e8d] whitespace-nowrap leading-none">
                MULTI+
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] mt-1.5 font-bold">
                Ad Sets
              </div>
            </div>
            <div className="text-left sm:text-right whitespace-nowrap">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff3e8d] to-[#ffb347] whitespace-nowrap leading-none">
                +45%
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] mt-1.5 font-bold">
                Median ROAS
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4 Cinematic Result Showcases */}
        <div className="space-y-12 sm:space-y-16">

          {/* ================================================== */}
          {/* RESULT 01 — INSTAGRAM (Social Performance) */}
          {/* ================================================== */}
          <motion.div
            data-char-action="result"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-slate-50/70 border border-slate-200/90 rounded-2xl p-8 sm:p-10 overflow-hidden group hover:border-[#ff3e8d]/50 hover:shadow-xl transition-all duration-300 shadow-sm"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] harsh-gradient" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Category & Title */}
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-widest bg-[#ff3e8d]/10 px-3 py-1 rounded-full border border-[#ff3e8d]/20">
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>SOCIAL PERFORMANCE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#0f172a] tracking-tight">
                  VIRAL CONTENT IMPACT
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#64748b] leading-relaxed max-w-sm font-medium">
                  High-retention creative hooks delivering organic audience scaling across short-form reels.
                </p>
              </div>

              {/* Primary Animated Metric Hero */}
              <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-center py-2">
                <div className="font-sans text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0f172a] leading-none">
                  <AnimatedCounter value={262} suffix="K+" />
                </div>
                <div className="font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-widest mt-2">
                  VIEWS ON A SINGLE POST
                </div>
                <div className="font-mono text-[11px] text-[#64748b] mt-0.5">
                  Verified standalone organic reach
                </div>
              </div>

              {/* CTA Action Column */}
              <div className="lg:col-span-3 flex lg:justify-end items-center">
                <a
                  href={INSTAGRAM_REEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3.5 harsh-gradient text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
                >
                  <span>VIEW ON INSTAGRAM</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Kinetic Micro Line Accent */}
            <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-[10px] text-[#64748b]">
              <span>CHANNEL // INSTAGRAM REELS</span>
              <span className="font-bold text-[#ff3e8d]">VERIFIED ORGANIC METRIC</span>
            </div>
          </motion.div>


          {/* ================================================== */}
          {/* RESULT 02 — META ADS (Meta Ads Performance) */}
          {/* ================================================== */}
          <motion.div
            data-char-action="result"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-slate-50/70 border border-slate-200/90 rounded-2xl p-8 sm:p-10 overflow-hidden group hover:border-[#ff3e8d]/50 hover:shadow-xl transition-all duration-300 shadow-sm"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#ff3e8d] via-[#ffb347] to-[#ff3e8d]" />

            <div className="space-y-7 relative z-10">
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-widest bg-[#ff3e8d]/10 px-3 py-1 rounded-full border border-[#ff3e8d]/20 w-fit">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>META ADS PERFORMANCE</span>
                </div>

                <div className="font-mono text-xs text-[#64748b] flex items-center gap-2">
                  <span>ALL-OVER BUDGET:</span>
                  <span className="text-[#0f172a] font-bold">₹400</span>
                </div>
              </div>

              {/* Asymmetric Metric Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Primary Metric: Impressions */}
                <div className="md:col-span-6 space-y-1">
                  <div className="font-sans text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0f172a] leading-none">
                    <AnimatedCounter value={23.6} decimals={1} suffix="K+" />
                  </div>
                  <div className="font-mono text-xs text-[#64748b] uppercase font-bold tracking-wider pt-1">
                    IMPRESSIONS DELIVERED
                  </div>
                </div>

                {/* Supporting Metric: Cost Per Landing Page View */}
                <div className="md:col-span-6 space-y-1 md:border-l md:border-slate-200 md:pl-8">
                  <div className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#ff3e8d] leading-none">
                    <AnimatedCounter value={0.64} decimals={2} prefix="₹" />
                  </div>
                  <div className="font-mono text-xs text-[#0f172a] uppercase font-bold tracking-wider pt-1">
                    COST PER LANDING PAGE VIEW
                  </div>
                  <div className="font-mono text-[11px] text-[#64748b]">
                    Traffic optimization &amp; creative scaling efficiency
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200">
                <div className="font-mono text-[10px] text-[#64748b]">
                  SOURCE: META ADS DASHBOARD
                </div>

                <button
                  onClick={() =>
                    openModal(
                      "/posters/Meta results.png",
                      "Meta Ads Performance Results - Ritesh Patel",
                      "SOURCE: META ADS DASHBOARD",
                      "META ADS CAMPAIGN PROOF — 23.6K+ IMPRESSIONS @ ₹0.64 PER LANDING PAGE VIEW"
                    )
                  }
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3 border-2 border-[#0f172a] bg-white hover:bg-[#0f172a] hover:text-white text-xs font-mono font-bold tracking-wider uppercase text-[#0f172a] transition-all duration-300 rounded-xl shadow-[3px_3px_0px_0px_#ffb347] cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#ff3e8d] group-hover/btn:text-white transition-colors" />
                  <span>VIEW CAMPAIGN PROOF</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>


          {/* ================================================== */}
          {/* RESULT 03 — GOOGLE ADS (Funnel Priority Order) */}
          {/* ================================================== */}
          <motion.div
            data-char-action="result"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-slate-50/70 border border-slate-200/90 rounded-2xl p-8 sm:p-10 overflow-hidden group hover:border-[#ff3e8d]/50 hover:shadow-xl transition-all duration-300 shadow-sm"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] harsh-gradient" />

            <div className="space-y-7 relative z-10">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-widest bg-[#ff3e8d]/10 px-3 py-1 rounded-full border border-[#ff3e8d]/20">
                  <Phone className="w-3.5 h-3.5" />
                  <span>GOOGLE ADS PERFORMANCE</span>
                </div>
                <div className="font-mono text-[11px] text-[#64748b] hidden sm:block uppercase font-semibold">
                  SEARCH CAMPAIGN CONVERSION FUNNEL
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* 1. Main Priority Hero Column: Total Impressions */}
                <div className="lg:col-span-5 bg-white border border-slate-200 p-7 rounded-xl space-y-2 shadow-sm">
                  <div className="font-mono text-xs text-[#ff3e8d] font-bold tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff3e8d] animate-ping" />
                    <span>MAIN HIGHLIGHT // REACH</span>
                  </div>
                  <div className="font-sans text-5xl sm:text-7xl font-black tracking-tight text-[#0f172a] leading-none">
                    <AnimatedCounter value={14.8} decimals={1} suffix="K+" />
                  </div>
                  <div className="font-mono text-sm text-[#0f172a] uppercase font-bold tracking-wider pt-1">
                    TOTAL IMPRESSIONS
                  </div>
                  <p className="font-sans text-xs text-[#64748b] pt-1">
                    High-intent search impressions delivered across targeted queries.
                  </p>
                </div>

                {/* 2. Priority Grid: Clicks -> Local Actions -> Calls/Sales -> Budget */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
                  {/* Step 2: Clicks */}
                  <div className="space-y-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
                    <div className="font-sans text-2xl sm:text-3xl font-black text-[#0f172a]">
                      <AnimatedCounter value={1.62} decimals={2} suffix="K" />
                    </div>
                    <div className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-bold">
                      CLICKS GENERATED
                    </div>
                  </div>

                  {/* Step 3: Local Actions */}
                  <div className="space-y-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
                    <div className="font-sans text-2xl sm:text-3xl font-black text-[#0f172a]">
                      <AnimatedCounter value={162} />
                    </div>
                    <div className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-bold">
                      LOCAL ACTIONS
                    </div>
                  </div>

                  {/* Step 4: Sales / Verified Phone Calls */}
                  <div className="space-y-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
                    <div className="font-sans text-2xl sm:text-3xl font-black text-[#ff3e8d]">
                      <AnimatedCounter value={33} />
                    </div>
                    <div className="font-mono text-[11px] text-[#0f172a] uppercase tracking-wider font-bold">
                      VERIFIED CALLS / SALES
                    </div>
                  </div>

                  {/* Step 5: All-over Budget / Total Spend */}
                  <div className="space-y-1 bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
                    <div className="font-sans text-2xl sm:text-3xl font-black text-[#0f172a]">
                      <AnimatedCounter value={2810.40} decimals={2} prefix="₹" />
                    </div>
                    <div className="font-mono text-[11px] text-[#64748b] uppercase tracking-wider font-bold">
                      TOTAL SPEND
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-200">
                <div className="font-mono text-[10px] text-[#64748b]">
                  SOURCE: GOOGLE ADS DASHBOARD
                </div>

                <button
                  onClick={() =>
                    openModal(
                      "/posters/Google ad results.png",
                      "Google Ads Performance Results - Ritesh Patel",
                      "SOURCE: GOOGLE ADS DASHBOARD",
                      "GOOGLE ADS CAMPAIGN PROOF — 14.8K+ IMPRESSIONS, 1.62K CLICKS, 162 ACTIONS, 33 CALLS"
                    )
                  }
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3 border-2 border-[#0f172a] bg-white hover:bg-[#0f172a] hover:text-white text-xs font-mono font-bold tracking-wider uppercase text-[#0f172a] transition-all duration-300 rounded-xl shadow-[3px_3px_0px_0px_#ff3e8d] cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#ff3e8d] group-hover/btn:text-white transition-colors" />
                  <span>VIEW CAMPAIGN PROOF</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>


          {/* ================================================== */}
          {/* RESULT 04 — YOUTUBE (YouTube Performance) */}
          {/* ================================================== */}
          <motion.div
            data-char-action="result"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-slate-50/70 border border-slate-200/90 rounded-2xl p-8 sm:p-10 overflow-hidden group hover:border-[#ff3e8d]/50 hover:shadow-xl transition-all duration-300 shadow-sm"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] harsh-gradient" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Category & Details */}
              <div className="lg:col-span-5 space-y-3">
                <div className="inline-flex items-center gap-2 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-widest bg-[#ff3e8d]/10 px-3 py-1 rounded-full border border-[#ff3e8d]/20">
                  <YoutubeIcon className="w-3.5 h-3.5" />
                  <span>YOUTUBE PERFORMANCE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#0f172a] tracking-tight">
                  LONG-FORM CONTENT SCALE
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#64748b] leading-relaxed max-w-sm font-medium">
                  YouTube audience growth and high-retention video content performance over time.
                </p>
              </div>

              {/* Primary Metric: Lifetime Views */}
              <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-center py-2">
                <div className="font-sans text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0f172a] leading-none">
                  <AnimatedCounter value={75.8} decimals={1} suffix="K+" />
                </div>
                <div className="font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-widest mt-2">
                  LIFETIME VIEWS
                </div>
                <div className="font-mono text-[11px] text-[#64748b] mt-0.5">
                  Personal channel metrics
                </div>
              </div>

              {/* Action Column */}
              <div className="lg:col-span-3 flex lg:justify-end items-center">
                <button
                  onClick={() =>
                    openModal(
                      "/posters/yt results.jpg",
                      "YouTube Studio Analytics Proof - Ritesh Patel",
                      "SOURCE: YOUTUBE STUDIO",
                      "YOUTUBE STUDIO ANALYTICS — 75.8K+ LIFETIME VIEWS"
                    )
                  }
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3.5 harsh-gradient text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>VIEW ANALYTICS PROOF</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Kinetic Micro Line Accent */}
            <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between font-mono text-[10px] text-[#64748b]">
              <span>SOURCE: YOUTUBE STUDIO</span>
              <span className="font-bold text-[#ff3e8d]">VERIFIED CHANNEL METRIC</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Proof Lightbox Modal */}
      <ProofModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        imageSrc={modalState.imageSrc}
        imageAlt={modalState.imageAlt}
        sourceLabel={modalState.sourceLabel}
        title={modalState.title}
      />
    </section>
  );
}
