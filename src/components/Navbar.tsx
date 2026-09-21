"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

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
        <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-4 sm:px-5 py-2.5 flex items-center justify-between shadow-xl shadow-black/5 pointer-events-auto transition-all duration-300">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="group flex items-center gap-2 text-sm tracking-tight font-black text-[#0f172a]"
          >
            <span className="w-2.5 h-2.5 rounded-full harsh-gradient group-hover:scale-125 transition-transform duration-300 shadow-sm" />
            <span className="tracking-tight">RITESH PATEL</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-[11px] uppercase tracking-widest text-[#64748b]">
            <a
              href="/#work"
              onClick={(e) => handleNavClick(e, "work")}
              className="nav-link-underline font-bold text-[#0f172a] hover:text-[#ff3e8d] transition-colors duration-200 py-1"
            >
              Work
            </a>
            <Link
              href="/ai-projects"
              className="nav-link-underline font-bold text-[#0f172a] hover:text-[#ff3e8d] transition-colors duration-200 py-1 flex items-center gap-1.5"
            >
              <span>AI Projects</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
            </Link>
            <a
              href="/#results"
              onClick={(e) => handleNavClick(e, "results")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              Results
            </a>
            <a
              href="/#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              About
            </a>
            <a
              href="/#experience"
              onClick={(e) => handleNavClick(e, "experience")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              Experience
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="nav-link-underline font-bold hover:text-[#0f172a] transition-colors duration-200 py-1"
            >
              Contact
            </a>
          </nav>

          {/* Primary Action Button & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            {/* Dedicated Top AI & Automations Button */}
            <Link
              href="/ai-projects"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f172a] text-white hover:bg-black text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all group cursor-pointer border border-slate-700/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffb347] group-hover:rotate-12 transition-transform" />
              <span>AI Projects</span>
            </Link>

            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[#0f172a] text-[10px] font-mono font-bold uppercase tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff3e8d] animate-pulse" />
              <span>Open to work</span>
            </div>

            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 harsh-gradient text-white text-xs font-black uppercase tracking-wider rounded-full shadow-[2px_2px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#0f172a] hover:text-[#ff3e8d] transition-colors cursor-pointer"
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
            className="fixed inset-0 z-30 bg-[#FAF8F5]/98 backdrop-blur-xl lg:hidden pt-28 px-8 flex flex-col justify-between pb-12"
          >
            <div className="flex flex-col gap-6 text-2xl font-semibold tracking-tight text-[#1a1a1a]">
              <Link
                href="/ai-projects"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-white border border-[#ff3e8d]/40 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#ff3e8d]" />
                  <span className="text-lg font-black text-[#0f172a]">AI Projects</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#ff3e8d] text-white font-bold uppercase">
                  Explore 3 Projects
                </span>
              </Link>
              <a
                href="/#work"
                onClick={(e) => handleNavClick(e, "work")}
                className="hover:text-[#ff3e8d] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4 text-xl font-bold"
              >
                <span>Work</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="/#results"
                onClick={(e) => handleNavClick(e, "results")}
                className="hover:text-[#ff3e8d] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4 text-xl font-bold"
              >
                <span>Results</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="/#about"
                onClick={(e) => handleNavClick(e, "about")}
                className="hover:text-[#ff3e8d] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4 text-xl font-bold"
              >
                <span>About</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="/#experience"
                onClick={(e) => handleNavClick(e, "experience")}
                className="hover:text-[#ff3e8d] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4 text-xl font-bold"
              >
                <span>Experience</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
              <a
                href="/#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="hover:text-[#ff3e8d] transition-colors flex items-center justify-between border-b border-[#1a1a1a]/8 pb-4 text-xl font-bold"
              >
                <span>Contact</span>
                <ArrowUpRight className="w-5 h-5 text-[#8a8a8a]" />
              </a>
            </div>

            <div className="font-mono text-xs text-[#8a8a8a] space-y-2">
              <p className="text-[#5c5c5c]">Ritesh Patel — Digital Growth &amp; AI</p>
              <p>Performance · Automations · Creative</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
