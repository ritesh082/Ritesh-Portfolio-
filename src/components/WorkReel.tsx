"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

interface PosterItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  offsetStyle?: string;
}

const POSTERS: PosterItem[] = [
  { id: "1", src: "/posters/1.png", title: "COMFORT FEELS SAFE. GROWTH DOESN'T.", tag: "INTERVIEW PSYCHOLOGY", offsetStyle: "translate-y-1" },
  { id: "2", src: "/posters/2.png", title: "DON'T CHASE EVERY JOB. PERFECT MATCH.", tag: "CAREER DECODE", offsetStyle: "-translate-y-1" },
  { id: "3", src: "/posters/3.png", title: "THE CITY DOESN'T GROW. IT'S DESIGNED.", tag: "URBAN BLUEPRINT", offsetStyle: "translate-y-0.5" },
  { id: "4", src: "/posters/4.png", title: "BUILD YOUR POSITION IN THE MARKET.", tag: "MARKET WATCH", offsetStyle: "-translate-y-1.5" },
  { id: "5", src: "/posters/5.png", title: "STRATEGIC GROWTH & CAMPAIGNS", tag: "PERFORMANCE MKTG", offsetStyle: "translate-y-1.5" },
  { id: "6", src: "/posters/6.png", title: "DATA-DRIVEN CREATIVE DIRECTION", tag: "BRAND SCALE", offsetStyle: "-translate-y-0.5" },
  { id: "7", src: "/posters/7.png", title: "ORGANIC ACCELERATION & REACH", tag: "AUDIENCE STRATEGY", offsetStyle: "translate-y-1" },
  { id: "8", src: "/posters/8.png", title: "HIGH-IMPACT CAMPAIGN EXECUTION", tag: "CREATIVE REEL", offsetStyle: "-translate-y-1" },
  { id: "9", src: "/posters/9.png", title: "OPTIMIZED CONVERSION FUNNELS", tag: "CRO & FUNNELS", offsetStyle: "translate-y-0.5" },
  { id: "10", src: "/posters/10.png", title: "CREATIVE MARKETING & BRANDING", tag: "PORTFOLIO HIGHLIGHT", offsetStyle: "-translate-y-1" },
];

// Duplicated track array for 100% seamless, infinite loop
const TRACK_ITEMS = [...POSTERS, ...POSTERS];

export default function WorkReel() {
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);

  // Background scroll lock & Escape key handler for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPoster(null);
      }
    };

    if (selectedPoster) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPoster]);

  return (
    <section id="work" className="relative py-28 border-t border-slate-200/80 bg-[#fffafb] select-none w-full max-w-full overflow-hidden">
      {/* Background Sunset Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#ff3e8d]/5 via-[#ffb347]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Section Introduction */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="inline-flex items-center gap-2.5 font-mono text-xs text-[#ff3e8d] font-bold uppercase tracking-[0.25em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d]" />
          <span>SELECTED WORK // CREATIVE</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0f172a] uppercase leading-none">
          Campaigns that moved the <span className="harsh-text">needle.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#64748b] max-w-xl font-medium">
          I don&apos;t just strategize. <span className="text-[#0f172a] font-bold">I create high-fidelity assets.</span>
        </p>

        {/* Process Pill Badge */}
        <div className="pt-2">
          <div className="font-mono text-xs text-[#64748b] tracking-widest uppercase flex items-center gap-3 border border-slate-200 px-5 py-2 bg-white rounded-full shadow-sm">
            <span className="text-[#0f172a] font-bold">CREATIVE</span>
            <span className="text-[#ff3e8d] font-black">→</span>
            <span className="text-[#0f172a] font-bold">EXPERIMENT</span>
            <span className="text-[#ff3e8d] font-black">→</span>
            <span className="text-[#0f172a] font-bold">MEASURE</span>
          </div>
        </div>
      </div>

      {/* Full-Width Moving Poster Marquee Reel */}
      <div className="relative w-full max-w-full overflow-hidden py-6 marquee-container group/marquee">
        
        {/* Viewport Edge Soft Vignette Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#fffafb] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#fffafb] to-transparent z-20 pointer-events-none" />

        {/* Continuous RIGHT -> LEFT Moving Track */}
        <div className="animate-marquee-left flex items-center gap-6 sm:gap-8 px-4 group-hover/marquee:[animation-play-state:paused] hover:[animation-play-state:paused]">
          {TRACK_ITEMS.map((poster, idx) => (
            <div
              key={`${poster.id}-${idx}`}
              data-char-action="work-poster"
              onClick={() => setSelectedPoster(poster)}
              className={`relative w-36 sm:w-48 md:w-56 lg:w-60 flex-shrink-0 aspect-[4/5] group/poster cursor-pointer transition-transform duration-300 ${poster.offsetStyle || ""}`}
            >
              {/* Poster Asset Container with Subtle Curved Edges */}
              <div className="relative w-full h-full overflow-hidden bg-white border border-slate-200/90 group-hover/poster:border-[#ff3e8d] shadow-lg group-hover/poster:shadow-2xl transition-all duration-300 group-hover/poster:scale-[1.03] rounded-xl sm:rounded-2xl">
                <img
                  src={poster.src}
                  alt={`${poster.title} - Ritesh Patel`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/poster:scale-105 rounded-xl sm:rounded-2xl"
                  loading="lazy"
                />

                {/* Subtle Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent opacity-30 group-hover/poster:opacity-70 transition-opacity duration-300 pointer-events-none" />

                {/* Bottom Hover Editorial Info Card */}
                <div className="absolute bottom-3 left-3 right-3 z-10 p-3 bg-[#0f172a]/95 backdrop-blur-md border border-white/20 opacity-0 group-hover/poster:opacity-100 transition-all duration-300 flex items-center justify-between rounded-lg sm:rounded-xl shadow-xl">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="font-mono text-[9px] text-[#ffb347] tracking-widest uppercase block font-bold">
                      {poster.tag}
                    </span>
                    <h4 className="font-sans text-xs font-bold text-white uppercase truncate">
                      {poster.title}
                    </h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#ff3e8d]/30 border border-[#ff3e8d]/60 flex items-center justify-center text-[#ff3e8d]">
                    <Maximize2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reel Footer Footnote */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 flex items-center justify-between font-mono text-[10px] text-[#64748b] border-t border-slate-200 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#ff3e8d] rounded-full animate-pulse" />
          <span className="font-bold text-[#0f172a]">HOVER TO PAUSE</span>
          <span>//</span>
          <span>CLICK TO ENLARGE</span>
        </div>
        <span className="font-bold uppercase tracking-widest text-[#0f172a]">SELECTED CAMPAIGN WORK</span>
      </div>

      {/* High-Resolution Poster Preview Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedPoster(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            {/* Modal Dialog Container */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-2xl cursor-default"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 font-mono text-xs text-[#64748b]">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full harsh-gradient" />
                  <span className="text-[#0f172a] uppercase font-bold">SELECTED CAMPAIGN</span>
                  <span>|</span>
                  <span className="text-[#ff3e8d] font-bold tracking-widest">{selectedPoster.tag}</span>
                </div>

                <button
                  onClick={() => setSelectedPoster(null)}
                  className="hover:text-[#0f172a] transition-colors p-1 flex items-center gap-1 cursor-pointer group"
                >
                  <span className="text-[10px] tracking-widest uppercase font-bold">ESC / CLOSE</span>
                  <X className="w-4 h-4 text-[#ff3e8d] group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="relative flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex items-center justify-center">
                <img
                  src={selectedPoster.src}
                  alt={selectedPoster.title}
                  className="max-h-[68vh] w-auto object-contain rounded-xl shadow-xl"
                />
              </div>

              {/* Modal Footer Info */}
              <div className="px-6 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="font-sans text-sm font-bold text-[#0f172a] uppercase">
                  {selectedPoster.title}
                </h3>
                <span className="font-mono text-[11px] text-[#64748b]">
                  Creative Asset · Ritesh Patel Portfolio
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
