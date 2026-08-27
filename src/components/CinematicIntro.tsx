"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicIntroProps {
  onComplete: () => void;
}

const WORDS = [
  { main: "RITESH PATEL", sub: "Portfolio — 2026", duration: 1800 },
  { main: "DIGITAL MARKETING", sub: "Creative & Performance", duration: 1600 },
];

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentIndex < WORDS.length) {
      const timer = setTimeout(() => {
        if (currentIndex === WORDS.length - 1) {
          setIsFinished(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
      }, WORDS[currentIndex].duration);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, onComplete]);

  const handleSkip = () => {
    setIsFinished(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#FAF8F5] text-[#1a1a1a] px-6 py-8 md:px-16 md:py-12 select-none overflow-hidden"
        >
          {/* Warm ambient glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C75B3F]/8 to-[#9B8EC4]/5 blur-[120px] pointer-events-none"
          />

          {/* Header: Skip control */}
          <div className="relative z-10 flex items-center justify-end text-xs tracking-wider uppercase font-mono text-[#8a8a8a]">
            <button
              onClick={handleSkip}
              className="hover:text-[#C75B3F] transition-colors flex items-center gap-1.5 font-mono group cursor-pointer"
            >
              <span>Skip</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4l10 8-10 8V4z"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
            </button>
          </div>

          {/* Main Animated Text */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3"
              >
                {/* Subtitle */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="font-mono text-xs text-[#8a8a8a] tracking-[0.2em] uppercase"
                >
                  {WORDS[currentIndex].sub}
                </motion.div>

                {/* Primary Title */}
                <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none text-[#1a1a1a]">
                  {WORDS[currentIndex].main}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress indicator */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              {WORDS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    idx <= currentIndex 
                      ? "w-8 bg-[#C75B3F]" 
                      : "w-2 bg-[#1a1a1a]/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
