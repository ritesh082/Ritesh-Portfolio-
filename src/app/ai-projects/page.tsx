"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  Bot, 
  Terminal, 
  ShieldCheck, 
  Search, 
  Share2, 
  CheckCircle2, 
  Layers, 
  Play, 
  Code2, 
  FileJson, 
  Cpu, 
  RefreshCw, 
  ArrowUpRight, 
  ExternalLink,
  Zap,
  Globe,
  Database,
  Sliders,
  Maximize2
} from "lucide-react";

interface AiProjectDetail {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  cliPreview: {
    command: string;
    outputLines: { text: string; color?: string }[];
  };
  metrics: { label: string; value: string }[];
  architecture: { title: string; desc: string }[];
}

const AI_PROJECTS: AiProjectDetail[] = [
  {
    id: "seo-audit-tool",
    number: "01",
    title: "Website SEO & Audit Tool",
    subtitle: "Automated website health checker built with AI-assisted development",
    badge: "AI-Assisted Dev",
    category: "Full-Site Crawler & Auditing Engine",
    description: "A full-site crawler and auditing tool that scans an entire website and generates automated reports across SEO, accessibility, performance, and security. Conceptualized the feature set and directed AI-assisted development to build it.",
    highlights: [
      "Full-site crawler with sitemap parsing, recursive/BFS crawling, and URL deduplication",
      "5 automated audit modules: SEO, Accessibility, Performance, Security, Broken Links (25+ checks total)",
      "JSON-based reporting engine generating separate module-wise reports per crawl",
      "Interactive CLI with full-audit mode, individual module testing, and reusable crawl data"
    ],
    techStack: ["Node.js", "Playwright", "TypeScript", "JSON Reporting Engine", "BFS Crawling", "CLI Engine"],
    metrics: [
      { label: "Audit Modules", value: "5 Modules" },
      { label: "Total Checkpoints", value: "25+ Rules" },
      { label: "Crawl Strategy", value: "BFS + Sitemap" }
    ],
    architecture: [
      { title: "Recursive BFS Engine", desc: "Crawls domain links with instant duplicate rejection and sitemap fallback." },
      { title: "5-Tier Audit Pipeline", desc: "Executes SEO, A11y, Core Web Vitals, HTTPS/headers, and 404 broken link scans." },
      { title: "Modular JSON Exporter", desc: "Outputs clean schema-valid JSON reports for individual or full audit runs." }
    ],
    cliPreview: {
      command: "node dist/cli.js --crawl https://brand.com --mode full --export json",
      outputLines: [
        { text: "[INFO] Initializing Playwright BFS Crawler on https://brand.com", color: "text-slate-400" },
        { text: "[CRAWL] Parsed sitemap.xml — Found 48 unique endpoints", color: "text-blue-400" },
        { text: "[AUDIT 1/5] SEO Health: 100% Title tags, 98% Meta descriptions, 4 missing alt text", color: "text-emerald-400" },
        { text: "[AUDIT 2/5] Accessibility (WCAG 2.1 AA): 0 Critical contrast issues detected", color: "text-emerald-400" },
        { text: "[AUDIT 3/5] Performance: LCP 1.1s | CLS 0.02 | FID 18ms (Passed Core Web Vitals)", color: "text-amber-400" },
        { text: "[AUDIT 4/5] Security: HSTS Enabled, CSP Valid, 0 mixed content warnings", color: "text-emerald-400" },
        { text: "[AUDIT 5/5] Broken Link Verifier: 142 internal links scanned, 0 broken URLs", color: "text-emerald-400" },
        { text: "[SUCCESS] Full report saved to ./reports/audit-report-brand-2026.json", color: "text-[#ffb347]" }
      ]
    }
  },
  {
    id: "browser-qa-agent",
    number: "02",
    title: "Personal AI Browser QA Agent",
    subtitle: "Autonomous browser automation and QA testing agent",
    badge: "Multi-Provider AI & MCP",
    category: "Autonomous Agentic Testing",
    description: "An AI-powered browser automation agent that can navigate web applications, run test suites, and self-heal when page layouts change — built with a multi-provider AI orchestration layer so it never fully fails even if one AI provider goes down.",
    highlights: [
      "Multi-provider AI orchestration across OpenAI, Claude, and Gemini with automatic failover",
      "Self-healing locator engine that recovers broken element selectors automatically",
      "Smart assertion engine covering 13 assertion types with retry logic",
      "Test evidence engine capturing screenshots, DOM snapshots, and failure logs",
      "26 MCP tools, validated across 29 automated regression test suites"
    ],
    techStack: ["Playwright", "Model Context Protocol (MCP)", "OpenAI GPT-4o", "Claude 3.5 Sonnet", "Google Gemini", "TypeScript"],
    metrics: [
      { label: "MCP Tools", value: "26 Tools" },
      { label: "Regression Suites", value: "29 Test Suites" },
      { label: "Assertion Types", value: "13 Smart Types" }
    ],
    architecture: [
      { title: "Multi-Provider Failover", desc: "Tri-model fallback (OpenAI ↔ Claude ↔ Gemini) ensures 99.99% agent uptime." },
      { title: "Self-Healing Selectors", desc: "Semantic DOM tree matching heals outdated CSS/XPath selectors on UI changes." },
      { title: "Evidence Recorder", desc: "Captures full DOM snapshots, action timelines, and visual screenshots on failure." }
    ],
    cliPreview: {
      command: "mcp-agent run-suite --suite e2e-checkout --provider auto-fallback",
      outputLines: [
        { text: "[ORCHESTRATOR] Primary: Claude 3.5 | Backup 1: OpenAI GPT-4o | Backup 2: Gemini 1.5", color: "text-slate-400" },
        { text: "[MCP] Loaded 26 MCP browser tools & 29 regression suites", color: "text-blue-400" },
        { text: "[ACTION] Navigating to /checkout -> Filling form fields autonomously", color: "text-slate-300" },
        { text: "[WARN] Selector button#submit-btn missing (DOM change detected)", color: "text-amber-400" },
        { text: "[SELF-HEAL] Semantic locator matched button[data-testid='pay-now'] (Confidence 0.98)", color: "text-emerald-400" },
        { text: "[ASSERTION 13/13] Order confirmation screen rendered (Latency: 840ms)", color: "text-emerald-400" },
        { text: "[EVIDENCE] Captured visual snapshot & DOM log -> ./evidence/run-8492.png", color: "text-[#ffb347]" },
        { text: "[RESULT] 29/29 Suites Passed. Zero Failures.", color: "text-emerald-400" }
      ]
    }
  },
  {
    id: "post-link-collector",
    number: "03",
    title: "Post Link Collector CLI",
    subtitle: "Zero-API social media link scraper",
    badge: "Zero-API Scraper",
    category: "CLI Scraper & Ingestion Engine",
    description: "A command-line tool that collects the latest post and video links from YouTube, LinkedIn, Instagram, and Facebook through direct web scraping — no API keys or paid services required.",
    highlights: [
      "Multi-platform support: YouTube, LinkedIn, Instagram, Facebook",
      "Multiple input modes: CLI arguments, file input, interactive paste mode",
      "Automatic deduplication (zero duplicate links)",
      "Export to TXT, CSV, and JSON with a clean rich-terminal UI"
    ],
    techStack: ["Python", "Direct Web Scraping", "Rich CLI", "CSV / JSON / TXT Exporter", "Deduplication Engine"],
    metrics: [
      { label: "Platforms Supported", value: "4 Platforms" },
      { label: "API Keys Required", value: "0 (Zero API)" },
      { label: "Export Formats", value: "TXT, CSV, JSON" }
    ],
    architecture: [
      { title: "Direct Web Scraping", desc: "Extracts latest post URLs directly without expensive rate-limited APIs." },
      { title: "Zero-Duplicate Filter", desc: "In-memory URL hash map guarantees 100% unique links across batch runs." },
      { title: "Rich Terminal Interface", desc: "Interactive paste, CLI args, and structured multi-format export." }
    ],
    cliPreview: {
      command: "python link_collector.py --platforms youtube linkedin instagram --export csv",
      outputLines: [
        { text: "[CLI] Post Link Collector v2.4 (Zero-API Mode)", color: "text-slate-400" },
        { text: "[INGEST] Target profiles loaded (YouTube, LinkedIn, Instagram, Facebook)", color: "text-blue-400" },
        { text: "[SCRAPING] YouTube Channel -> Extracted 42 video links", color: "text-emerald-400" },
        { text: "[SCRAPING] LinkedIn Profile -> Extracted 28 post URLs", color: "text-emerald-400" },
        { text: "[SCRAPING] Instagram Profile -> Extracted 36 reel & post links", color: "text-emerald-400" },
        { text: "[DEDUP] Scanned 106 total links -> 0 duplicates found", color: "text-amber-400" },
        { text: "[EXPORT] Successfully generated links_export_2026.csv (106 items)", color: "text-[#ffb347]" }
      ]
    }
  }
];

export default function AiProjectsPage() {
  const [activeTab, setActiveTab] = useState<string>("seo-audit-tool");

  const selectedProject = AI_PROJECTS.find(p => p.id === activeTab) || AI_PROJECTS[0];

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#0f172a] relative selection:bg-[#ff3e8d] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#ff3e8d]/8 via-[#ffb347]/8 to-transparent blur-[160px] pointer-events-none rounded-full" />
      
      {/* ── Top Header Bar ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0f172a] hover:text-[#ff3e8d] transition-colors"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-white group-hover:border-[#ff3e8d] flex items-center justify-center transition-colors shadow-sm">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span>Back to Portfolio</span>
          </Link>

          {/* System Badge */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#64748b] bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-[#ff3e8d] animate-pulse" />
            <span className="font-bold text-[#0f172a]">3 AI PRODUCTION SYSTEMS</span>
          </div>

          {/* Connect Action */}
          <Link
            href="/#contact"
            className="px-4 py-2 harsh-gradient text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          >
            Get In Touch
          </Link>
        </div>
      </header>

      {/* ── Main Showcase Container ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">
        
        {/* 1. HERO TITLE */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-mono font-bold tracking-widest uppercase text-[#ff3e8d]">
            <Sparkles className="w-3.5 h-3.5 text-[#ff3e8d] animate-pulse" />
            <span>AI-ASSISTED DEVELOPMENT &amp; AGENTS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0f172a] uppercase leading-none">
            AI <span className="harsh-text">PROJECTS</span> &amp; AUTOMATIONS
          </h1>

          <p className="text-base sm:text-lg text-[#64748b] font-medium leading-relaxed">
            Autonomous browser QA agents, full-site auditing engines, and zero-API social ingestion tools built with AI-directed architecture.
          </p>
        </div>

        {/* 2. PROJECT SELECTION TABS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_PROJECTS.map((proj) => {
            const isSelected = activeTab === proj.id;

            return (
              <button
                key={proj.id}
                onClick={() => setActiveTab(proj.id)}
                className={`text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#0f172a] text-white border-transparent shadow-xl shadow-black/10 scale-[1.02]"
                    : "bg-white text-[#0f172a] border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={`font-bold ${isSelected ? "text-[#ffb347]" : "text-[#ff3e8d]"}`}>
                      PROJECT // {proj.number}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isSelected ? "bg-white/10 text-white" : "bg-slate-100 text-[#64748b]"
                    }`}>
                      {proj.badge}
                    </span>
                  </div>

                  <h3 className="font-sans text-lg sm:text-xl font-black leading-snug">
                    {proj.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 ${isSelected ? "text-slate-300" : "text-[#64748b]"}`}>
                    {proj.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/20 flex items-center justify-between font-mono text-[11px]">
                  <span className={isSelected ? "text-[#ffb347]" : "text-[#ff3e8d]"}>
                    {isSelected ? "● Active View" : "Click to inspect"}
                  </span>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${isSelected ? "text-[#ffb347]" : "text-slate-400"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. ACTIVE PROJECT DEEP-DIVE CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5 space-y-10"
          >
            {/* Top Bar Details */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-3 py-1 rounded-lg bg-[#ff3e8d]/10 text-[#ff3e8d] font-bold">
                    {selectedProject.category}
                  </span>
                  <span className="text-[#64748b]">|</span>
                  <span className="text-[#0f172a] font-bold uppercase">{selectedProject.badge}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] uppercase tracking-tight">
                  {selectedProject.title}
                </h2>
                <p className="text-base sm:text-lg text-[#ff3e8d] font-bold font-mono">
                  {selectedProject.subtitle}
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                {selectedProject.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center min-w-[100px]">
                    <span className="block font-mono text-[10px] text-[#64748b] uppercase font-bold">
                      {m.label}
                    </span>
                    <span className="font-sans text-base sm:text-lg font-black text-[#0f172a]">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative & Feature Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Description & Feature Bullets */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-wider block">
                    OVERVIEW &amp; OBJECTIVE
                  </span>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="font-mono text-xs text-[#0f172a] font-bold uppercase tracking-wider block">
                    KEY SYSTEM CAPABILITIES
                  </span>
                  <div className="space-y-2.5">
                    {selectedProject.highlights.map((point, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-[#ff3e8d] flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-800 font-medium leading-normal">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="space-y-2 pt-2">
                  <span className="font-mono text-xs text-[#64748b] font-bold uppercase tracking-wider block">
                    TECHNOLOGIES &amp; PROTOCOLS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-[#0f172a]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

                {/* Right Column: Live Terminal CLI Preview */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-[#0f172a] rounded-3xl border border-slate-800 p-5 sm:p-6 text-white shadow-2xl space-y-4">
                    
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        <span className="ml-2 text-slate-400 text-[11px]">terminal // cli-execution</span>
                      </div>
                    </div>

                    {/* Terminal Command */}
                    <div className="font-mono text-xs text-emerald-400 flex items-center gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[#ff3e8d]">$</span>
                      <span>{selectedProject.cliPreview.command}</span>
                    </div>

                    {/* Output Terminal Stream */}
                    <div className="font-mono text-[11px] sm:text-xs space-y-2 py-2 max-h-[300px] overflow-y-auto pr-2">
                      {selectedProject.cliPreview.outputLines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`leading-relaxed ${line.color || "text-slate-300"} opacity-95`}
                        >
                          {line.text}
                        </div>
                      ))}
                    </div>

                  {/* Status footer */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Ready for production deployment</span>
                    </span>
                    <span className="text-[#ffb347] font-bold">EXIT CODE: 0</span>
                  </div>
                </div>

                {/* Architecture Highlights 3-Pill Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedProject.architecture.map((arch, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                      <h4 className="font-mono text-xs font-bold text-[#0f172a]">
                        {arch.title}
                      </h4>
                      <p className="text-[11px] text-[#64748b] leading-relaxed">
                        {arch.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 4. BOTTOM CONTACT & COLLABORATION BANNER */}
        <div className="p-8 sm:p-10 rounded-3xl harsh-gradient text-white shadow-[6px_6px_0px_0px_#0f172a] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0f172a] bg-white/90 px-3 py-1 rounded-md inline-block">
              ENGINEERING &amp; AI COLLABORATIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Want to deploy autonomous agents or automated scrapers for your team?
            </h3>
            <p className="text-white/90 text-sm max-w-xl">
              Let&apos;s build custom automated testing pipelines, browser workflows, or scraping infrastructure tailored to your stack.
            </p>
          </div>

          <Link
            href="/#contact"
            className="flex-shrink-0 px-8 py-4 bg-[#0f172a] hover:bg-white hover:text-[#0f172a] text-white font-mono text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            <span>Initiate Project Discussion</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 md:px-12 border-t border-slate-200/80 bg-white font-mono text-xs text-[#64748b] flex flex-col sm:flex-row items-center justify-between gap-6 mt-20">
        <div>
          <span className="font-bold text-[#0f172a]">© 2026 Ritesh Patel</span> — AI-Assisted Development &amp; Digital Growth
        </div>
        <Link
          href="/"
          className="hover:text-[#ff3e8d] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to main portfolio</span>
        </Link>
      </footer>
    </main>
  );
}
