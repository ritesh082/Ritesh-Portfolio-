"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface SelectedExperience {
  id: string;
  num: string;
  company: string;
  context: string;
  focusAreas: string[];
  summary: string;
}

const SELECTED_EXPERIENCES: SelectedExperience[] = [
  {
    id: "first-attempt",
    num: "01",
    company: "FIRST ATTEMPT",
    context: "Digital Marketing Intern (May 2026 – Present)",
    focusAreas: [
      "META ADS (33K IMPRESSIONS)",
      "15X REACH GROWTH",
      "ON-PAGE SEO",
      "GOOGLE BUSINESS PROFILE",
    ],
    summary:
      "Delivered 33,000 impressions on a ₹400 test budget, grew client reach 15x (7K to 110K+), optimized on-page SEO for First Job Hub, and generated 100+ GBP views in 10 days.",
  },
  {
    id: "findtern",
    num: "02",
    company: "FINDTERN",
    context: "Operations Intern (Nov 2025 – Jan 2026)",
    focusAreas: [
      "QA BUG TESTING (100+)",
      "DIGITAL CONTENT",
      "DATA RESEARCH",
      "OPERATIONS",
    ],
    summary:
      "Conducted QA testing identifying 100+ bugs, managed digital marketing content creation, and performed operational data research across fast-paced cross-functional workflows.",
  },
  {
    id: "drone-rangers",
    num: "03",
    company: "DRONE RANGERS",
    context: "Business Development Intern (Aug 2025 – Oct 2025)",
    focusAreas: [
      "CLIENT OUTREACH (300+)",
      "LEAD GENERATION (25 LEADS)",
      "AUDIENCE RESEARCH",
      "CAMPAIGN PLANNING",
    ],
    summary:
      "Led client outreach across ~300 prospective clients, generated 25 qualified sales leads through audience research and strategic campaign planning.",
  },
];

export default function ExperienceSection() {
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <section
      id="experience"
      className="relative py-28 border-t border-slate-200/80 bg-[#fffafb] text-[#0f172a] select-none w-full max-w-full overflow-hidden"
    >
      {/* Background Sunset Ambient Glow */}
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-gradient-to-l from-[#ff3e8d]/5 to-transparent blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-r from-[#ffb347]/5 to-transparent blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">

        {/* ================================================== */}
        {/* SECTION TITLE & EYEBROW */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="space-y-4 max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2.5 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-[0.25em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
            <span>EXPERIENCE JOURNEY</span>
          </motion.div>

          {/* Main Headline */}
          <div className="overflow-hidden">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-[#0f172a] tracking-tight leading-none"
            >
              Hands-on <span className="harsh-text">Impact.</span>
            </motion.h2>
          </div>

          {/* Supporting Statement */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-[#64748b] max-w-2xl leading-relaxed font-medium pt-1"
          >
            Different teams. Different challenges. The same habit of rapid iteration, testing, and driving measurable growth.
          </motion.p>
        </motion.div>

        {/* ================================================== */}
        {/* CURATED EXPERIENCE CHAPTERS */}
        {/* ================================================== */}
        <div className="space-y-8 sm:space-y-12">
          {SELECTED_EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="group relative bg-white border border-slate-200/90 rounded-3xl p-8 lg:p-12 hover:border-[#ff3e8d]/50 transition-all duration-500 hover:shadow-xl overflow-hidden shadow-sm"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#ff3e8d]/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform" />

              {/* Header Row */}
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-slate-100 pb-6 mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-xl font-black text-[#0f172a] shadow-sm">
                    {idx === 0 ? "F" : "T"}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black uppercase text-[#0f172a] tracking-tight">
                        {exp.company}
                      </h3>
                      <span className="px-3 py-1 harsh-gradient text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {exp.context}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#64748b] mt-1 font-semibold">
                      CHAPTER [{exp.num}] · Growth Execution
                    </p>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-xl font-black harsh-text">
                    {idx === 0 ? "+45% ROAS & Scale" : "Growth Ops & Reach"}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#64748b] font-bold">
                    Primary Impact Focus
                  </div>
                </div>
              </div>

              {/* Grid of Focus Areas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {exp.focusAreas.map((area) => (
                  <div
                    key={area}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1 hover:border-[#ff3e8d]/30 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d]" />
                    <div className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[#0f172a] pt-1">
                      {area}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Statement */}
              <p className="font-mono text-xs sm:text-sm text-[#64748b] leading-relaxed border-l-2 border-[#ff3e8d] pl-4 py-1 font-medium bg-slate-50/50 rounded-r-xl">
                {exp.summary}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ================================================== */}
        {/* SECTION END: CALL TO ACTION BANNER */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="pt-12 border-t border-slate-200 flex flex-col items-center justify-center text-center space-y-6"
        >
          <motion.div variants={fadeInUp} className="space-y-2 max-w-2xl">
            <p className="font-mono text-xs text-[#ff3e8d] font-bold tracking-[0.25em] uppercase">
              READY TO ACCELERATE
            </p>
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-[#0f172a] tracking-tight leading-tight">
              I don&apos;t just plan campaigns. <br />
              <span className="harsh-text">I execute them end-to-end.</span>
            </h3>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-1.5 text-[#64748b]"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-[#0f172a]">
              LET&apos;S BUILD TOGETHER
            </span>
            <ArrowDown className="w-4 h-4 text-[#ff3e8d] animate-bounce" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
