"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  sourceLabel: string;
  title: string;
}

export default function ProofModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  sourceLabel,
  title,
}: ProofModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#08080a]/95 backdrop-blur-2xl cursor-zoom-out select-none"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col bg-[#111116] border border-white/20 shadow-2xl overflow-hidden rounded-xl sm:rounded-2xl cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0c10] font-mono text-xs text-[#71717a]">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#ff381e] animate-pulse" />
                <span className="text-[#f5f5f3] uppercase font-semibold tracking-wider">
                  {sourceLabel}
                </span>
              </div>

              <button
                onClick={onClose}
                className="hover:text-white transition-colors p-1.5 flex items-center gap-1.5 cursor-pointer group rounded-lg hover:bg-white/5"
              >
                <span className="text-[10px] tracking-widest uppercase">ESC / CLOSE</span>
                <X className="w-4 h-4 text-[#ff381e] group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="relative flex-1 min-h-0 p-4 sm:p-6 flex items-center justify-center bg-[#08080a] overflow-auto">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="max-h-[72vh] w-auto max-w-full object-contain border border-white/10 shadow-2xl rounded-xl sm:rounded-2xl"
              />
            </div>

            {/* Modal Footnote Bar */}
            <div className="px-6 py-4 border-t border-white/10 bg-[#0c0c10] flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#a1a1aa] uppercase font-semibold">{title}</span>
              </div>
              <span className="text-[10px] text-[#71717a] tracking-widest uppercase">
                VERIFIED CAMPAIGN OUTCOME — RITESH PATEL
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
