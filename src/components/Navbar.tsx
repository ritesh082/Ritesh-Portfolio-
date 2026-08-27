"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  visible: boolean;
}

export default function Navbar({ visible }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > prevScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ 
          y: hidden ? -100 : 0, 
          opacity: 1 
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-4 md:top-6 left-0 right-0 z-40 px-4 md:px-6 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-5 py-2.5 flex items-center justify-between shadow-xl shadow-black/5 pointer-events-auto transition-all duration-300">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2.5 text-sm tracking-tight font-black text-[#0f172a]"
          >
            <span className="w-2.5 h-2.5 rounded-full harsh-gradient group-hover:scale-125 transition-transform duration-300 shadow-sm" />
            <span className="tracking-tight">RITESH PATEL</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 font-mono text-[11px] uppercase tracking-widest text-[#64748b]">
            <a
              href="#work"
              onClick={(e) => handleNavClick(e, "work")}
              className="nav-link-underline font-bold text-[#0f172a] hover:text-[#ff3e8d] transition-colors duration-200 py-1"
            >
              Work
            </a>
            <a
              href="#results"
              onClick={(e) => handleNavClick(e, "results")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              Results
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              About
            </a>
            <a
              href="#experience"
              onClick={(e) => handleNavClick(e, "experience")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              Experience
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              Contact
            </a>
          </nav>

          {/* Primary Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[#0f172a] text-[10px] font-mono font-bold uppercase tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
              <span>Open to work</span>
            </div>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 harsh-gradient text-white text-xs font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#0f172a] hover:text-[#ff3e8d] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-30 bg-[#FAF8F5]/98 backdrop-blur-xl md:hidden pt-28 px-8 flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col gap-8 text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              <a
                href="#work"
                onClick={(e) => handleNavClick(e, "work")}
                className="hover:text-[#C75B3F] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4"
              >
                <span>Work</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="#results"
                onClick={(e) => handleNavClick(e, "results")}
                className="hover:text-[#C75B3F] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4"
              >
                <span>Results</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, "about")}
                className="hover:text-[#C75B3F] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4"
              >
                <span>About</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="hover:text-[#C75B3F] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4"
              >
                <span>Contact</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
            </div>

            <div className="font-mono text-xs text-[#8a8a8a] space-y-2">
              <p className="text-[#5c5c5c]">Ritesh Patel — Digital Growth</p>
              <p>Performance · Social · Creative</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
