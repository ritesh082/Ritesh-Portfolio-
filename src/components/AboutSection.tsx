"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

export default function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  // Motion variants with explicit typing for Framer Motion & reduced motion accessibility
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const capabilities = [
    {
      num: "01",
      title: "CREATE",
      desc: "Social creatives, content, campaigns",
    },
    {
      num: "02",
      title: "RUN",
      desc: "Meta Ads, Google Ads, social execution",
    },
    {
      num: "03",
      title: "MEASURE",
      desc: "Campaign results, content performance, analytics",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-28 border-t border-slate-200/80 bg-white text-[#0f172a] select-none w-full max-w-full overflow-hidden"
    >
      {/* Soft Ambient Sunset Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] bg-gradient-to-tr from-[#ff3e8d]/5 via-[#ffb347]/5 to-transparent blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-24">
        
        {/* ================================================== */}
        {/* 1. CINEMATIC OPENING & PRIMARY STATEMENT */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Eyebrow Label */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2.5 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-[0.25em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
            <span>IDENTITY &amp; PERSPECTIVE</span>
          </motion.div>

          {/* Main Cinematic Title */}
          <div className="overflow-hidden">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#0f172a] tracking-tight leading-none"
            >
              Beyond the <span className="harsh-text">metrics.</span>
            </motion.h2>
          </div>

          {/* Staggered Primary Identity Statements */}
          <motion.div
            variants={staggerContainer}
            className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 border-t border-slate-200"
          >
            <motion.div variants={fadeInUp} className="group p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
              <span className="block font-mono text-[11px] text-[#ff3e8d] font-bold tracking-widest uppercase mb-1">
                01 // FOCUS
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0f172a] tracking-tight">
                DIGITAL MARKETER.
              </h3>
            </motion.div>

            <motion.div variants={fadeInUp} className="group p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
              <span className="block font-mono text-[11px] text-[#ff3e8d] font-bold tracking-widest uppercase mb-1">
                02 // ACTION
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0f172a] tracking-tight">
                CREATIVE EXECUTOR.
              </h3>
            </motion.div>

            <motion.div variants={fadeInUp} className="group p-6 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm hover:border-[#ff3e8d]/40 transition-colors">
              <span className="block font-mono text-[11px] text-[#ff3e8d] font-bold tracking-widest uppercase mb-1">
                03 // MINDSET
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0f172a] tracking-tight">
                GROWTH ALCHEMIST.
              </h3>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ================================================== */}
        {/* 2. STRATEGIST TOOLKIT (BENTO GRID PATTERN) */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Section Subhead */}
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-between border-b border-slate-200 pb-5"
          >
            <span className="font-mono text-xs text-[#ff3e8d] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#ff3e8d] rounded-full" />
              STRATEGIST TOOLKIT
            </span>
            <span className="font-mono text-xs text-[#64748b] uppercase tracking-widest hidden sm:inline font-semibold">
              CORE CAPABILITIES
            </span>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tile 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:border-[#ff3e8d]/50 hover:shadow-lg transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl harsh-gradient text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
                01
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0f172a] tracking-tight mb-2">Creative Strategy &amp; Positioning</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Crafting narrative frameworks before assets are designed. Audience mapping and brand alignment with measurable outcomes.
                </p>
              </div>
            </div>

            {/* Tile 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:border-[#ff3e8d]/50 hover:shadow-lg transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#ffb347] to-[#ff3e8d] text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
                02
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0f172a] tracking-tight mb-2">Paid Social Architecture</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  End-to-end campaign execution across Meta, TikTok, and YouTube with rapid multivariate testing loops.
                </p>
              </div>
            </div>

            {/* Tile 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:border-[#ff3e8d]/50 hover:shadow-lg transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl harsh-gradient text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
                03
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0f172a] tracking-tight mb-2">Performance Creative Direction</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Bridging visual art direction and conversion data to produce scroll-stopping assets engineered to convert.
                </p>
              </div>
            </div>

            {/* Tile 4 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:border-[#ff3e8d]/50 hover:shadow-lg transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-[#ffb347] to-[#ff3e8d] text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
                04
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0f172a] tracking-tight mb-2">A/B Testing Systems</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Statistical rigor meets creative intuition. Systematic creative iteration and funnel optimization.
                </p>
              </div>
            </div>

            {/* Tile 5 */}
            <div className="lg:col-span-2 bg-slate-50 border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:border-[#ff3e8d]/50 hover:shadow-lg transition-all space-y-4">
              <div className="w-10 h-10 rounded-2xl harsh-gradient text-white flex items-center justify-center font-mono font-black text-sm shadow-sm">
                05
              </div>
              <div>
                <h3 className="text-xl font-black text-[#0f172a] tracking-tight mb-2">Reporting &amp; Visual Storytelling</h3>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  Turning raw ad analytics and spreadsheets into crisp, actionable executive narratives that drive business decisions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================================================== */}
        {/* 3. SHORT INTRO & EDUCATION / CURRENT IDENTITY */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-8 border-t border-slate-200"
        >
          {/* Left Column: Short Personal / Professional Intro */}
          <motion.div variants={fadeInUp} className="lg:col-span-7 space-y-6">
            <span className="font-mono text-xs text-[#ff3e8d] uppercase tracking-[0.25em] font-bold block">
              APPROACH &amp; PHILOSOPHY
            </span>
            <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f172a] leading-snug tracking-tight border-l-4 border-[#ff3e8d] pl-6 py-2 bg-slate-50/70 rounded-r-2xl">
              &ldquo;I work at the intersection of creativity and performance — designing campaigns, testing hooks, measuring conversion, and constantly optimizing the process.&rdquo;
            </blockquote>
          </motion.div>

          {/* Right Column: Education & Identity */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 space-y-6 bg-slate-50 p-8 sm:p-10 border border-slate-200 rounded-3xl shadow-sm">
            {/* Education */}
            <div className="space-y-1.5">
              <span className="font-mono text-[11px] text-[#64748b] uppercase tracking-widest font-bold block">
                EDUCATION
              </span>
              <h4 className="text-xl sm:text-2xl font-black uppercase text-[#0f172a] tracking-tight">
                BBA — Digital Marketing
              </h4>
            </div>

            {/* Current Identity Line */}
            <div className="space-y-1.5 pt-4 border-t border-slate-200">
              <span className="font-mono text-[11px] text-[#64748b] uppercase tracking-widest font-bold block">
                CURRENT IDENTITY
              </span>
              <p className="font-mono text-xs font-bold text-[#ff3e8d] tracking-wider uppercase leading-relaxed">
                PERFORMANCE · CREATIVE · GROWTH · CAMPAIGNS
              </p>
            </div>

            {/* Human Tone Final Lines */}
            <div className="pt-4 border-t border-slate-200 space-y-2 font-mono text-xs text-[#64748b] tracking-wider uppercase font-bold">
              <p className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d]" />
                Still learning.
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb347]" />
                Still building.
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d]" />
                Still optimizing.
              </p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
