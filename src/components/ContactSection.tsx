"use client";

import React, { useState } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { Mail, ArrowUpRight, ArrowRight, Check } from "lucide-react";

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.78v8.37H6.46v-8.37M7.86 6.55a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const EMAIL = "riteshpatelofficial18@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/ritesh-patel1/";
const INSTAGRAM_URL = "https://instagram.com/as_ritesh";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
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
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email.";
    }
    if (!formData.message.trim()) errs.message = "Message is required.";
    return errs;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // No backend exists — use mailto: fallback
    const subject = encodeURIComponent(
      formData.subject.trim() || "Portfolio Contact"
    );
    const body = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\n${formData.message.trim()}`
    );
    const mailtoUrl = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    window.open(mailtoUrl, "_self");
    setSubmitted(true);
  };

  const inputBaseClass =
    "w-full bg-slate-50 border border-slate-200/90 rounded-xl py-3 px-4 font-mono text-xs sm:text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none transition-colors duration-300 focus:border-[#ff3e8d] focus:bg-white shadow-sm";

  return (
    <section
      id="contact"
      className="relative py-28 sm:py-36 border-t border-slate-200/80 overflow-hidden bg-gradient-to-b from-white via-[#fffafb] to-white text-[#0f172a] select-none w-full max-w-full"
    >
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-t from-[#ff3e8d]/5 via-[#ffb347]/5 to-transparent blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">
        {/* ================================================== */}
        {/* PART 1 — CINEMATIC CTA */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="flex flex-col items-center justify-center text-center space-y-6"
        >
          <motion.span
            variants={fadeInUp}
            className="font-mono text-xs text-[#ff3e8d] uppercase tracking-[0.25em] font-bold"
          >
            INITIATE
          </motion.span>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-[#0f172a] tracking-tight leading-none"
          >
            Let&apos;s build something <br />
            <span className="harsh-text">unignorable.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-base text-[#64748b] max-w-lg leading-relaxed font-medium"
          >
            Ready to scale your performance marketing, social content, or creative campaigns? Let&apos;s build measurable results together.
          </motion.p>

          <motion.a
            variants={fadeInUp}
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-3 px-8 py-4 harsh-gradient text-white font-mono text-xs font-bold tracking-widest uppercase rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
          >
            <Mail className="w-4 h-4" />
            <span>INITIATE CONTACT</span>
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* ================================================== */}
        {/* PART 2 & 3 — CONTACT DETAILS + FORM (Two-Column) */}
        {/* ================================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="pt-16 border-t border-slate-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* ---- LEFT COLUMN: Contact Channels & Logos ---- */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-5 space-y-4"
            >
              {/* Email Card */}
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center justify-between p-5 bg-slate-50 border border-slate-200/90 rounded-2xl shadow-sm hover:border-[#ff3e8d]/50 hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl harsh-gradient flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block">
                      EMAIL
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#0f172a] font-bold group-hover:text-[#ff3e8d] transition-colors">
                      {EMAIL}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#94a3b8] group-hover:text-[#ff3e8d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* LinkedIn Card */}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 bg-slate-50 border border-slate-200/90 rounded-2xl shadow-sm hover:border-[#0a66c2]/50 hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0077b5] to-[#0a66c2] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block">
                      LINKEDIN
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#0f172a] font-bold group-hover:text-[#0a66c2] transition-colors">
                      ritesh-patel1
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#94a3b8] group-hover:text-[#0a66c2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* Instagram Card */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 bg-slate-50 border border-slate-200/90 rounded-2xl shadow-sm hover:border-[#e1306c]/50 hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block">
                      INSTAGRAM
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-[#0f172a] font-bold group-hover:text-[#e1306c] transition-colors">
                      @as_ritesh
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[#94a3b8] group-hover:text-[#e1306c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>

              {/* Availability Note */}
              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-[#ff3e8d] uppercase tracking-widest font-bold">
                    AVAILABILITY
                  </span>
                </div>
                <p className="font-sans text-xs text-[#64748b] leading-relaxed font-medium">
                  Open to opportunities in digital marketing strategy, performance campaigns, and high-impact creative execution.
                </p>
              </div>
            </motion.div>

            {/* ---- RIGHT COLUMN: Contact Form ---- */}
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-7"
            >
              <div 
                data-char-action="contact"
                className="border border-slate-200 bg-white p-8 sm:p-10 space-y-6 rounded-3xl shadow-lg"
              >
                {/* Form Header */}
                <div className="space-y-1 pb-2 border-b border-slate-100">
                  <span className="font-mono text-xs text-[#ff3e8d] uppercase tracking-widest font-bold block">
                    SEND A MESSAGE
                  </span>
                  <p className="font-sans text-xs text-[#64748b] font-medium">
                    Your message will open in your default email client.
                  </p>
                </div>

                {!mounted ? (
                  <div className="space-y-4 py-2 animate-pulse">
                    <div className="h-12 bg-slate-100 rounded-xl w-full" />
                    <div className="h-12 bg-slate-100 rounded-xl w-full" />
                    <div className="h-24 bg-slate-100 rounded-xl w-full" />
                    <div className="h-12 harsh-gradient opacity-60 rounded-2xl w-full" />
                  </div>
                ) : submitted ? (
                  /* ---- Success State ---- */
                  <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[#ff3e8d]/40 bg-[#ff3e8d]/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#ff3e8d]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold uppercase text-[#0f172a]">
                        MESSAGE READY
                      </h4>
                      <p className="font-sans text-xs text-[#64748b] max-w-xs">
                        Your email client has been opened. Hit send to deliver your message.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="font-mono text-xs text-[#ff3e8d] hover:underline uppercase tracking-widest pt-2 font-bold cursor-pointer"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </div>
                ) : (
                  /* ---- Active Form ---- */
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate suppressHydrationWarning>
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="name"
                        className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block"
                      >
                        NAME *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        autoComplete="name"
                        suppressHydrationWarning
                        className={inputBaseClass}
                      />
                      {errors.name && (
                        <span className="font-mono text-[10px] text-[#ff3e8d] block font-bold">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block"
                      >
                        EMAIL *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        autoComplete="email"
                        suppressHydrationWarning
                        className={inputBaseClass}
                      />
                      {errors.email && (
                        <span className="font-mono text-[10px] text-[#ff3e8d] block font-bold">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="subject"
                        className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block"
                      >
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Campaign / Opportunity / Collaboration"
                        autoComplete="off"
                        suppressHydrationWarning
                        className={inputBaseClass}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="message"
                        className="font-mono text-[10px] uppercase tracking-widest text-[#64748b] font-bold block"
                      >
                        MESSAGE *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project, goals, or role..."
                        suppressHydrationWarning
                        className={`${inputBaseClass} resize-none`}
                      />
                      {errors.message && (
                        <span className="font-mono text-[10px] text-[#ff3e8d] block font-bold">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 harsh-gradient text-white font-mono text-xs font-bold tracking-widest uppercase rounded-2xl shadow-[4px_4px_0px_0px_#0f172a] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform cursor-pointer"
                      >
                        <span>SEND MESSAGE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
