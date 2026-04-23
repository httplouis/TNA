import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ClipboardList,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Users,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Training Needs Assessment Portal",
};

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Comprehensive Excel Assessment",
    desc: "64 questions across 12 Microsoft Excel skill areas — covering everything from worksheets to macros.",
  },
  {
    icon: BarChart3,
    title: "Auto-Scored Analysis",
    desc: "The system instantly computes your experience level per category and generates a preliminary analysis.",
  },
  {
    icon: ShieldCheck,
    title: "Expert Review",
    desc: "Our team reviews and refines the results before they reach you — ensuring quality and accuracy.",
  },
  {
    icon: Users,
    title: "Tailored Training Programs",
    desc: "You receive specific Informatics training program recommendations based on your Excel skill profile.",
  },
];

const CATEGORIES = [
  { name: "Worksheet & Workbook Management" },
  { name: "Working with Graphic Objects" },
  { name: "Working with Charts" },
  { name: "Working with Excel Databases" },
  { name: "Working with Advanced Functions" },
  { name: "Linking Data" },
  { name: "Proofing and Security" },
  { name: "Organizing Table Data" },
  { name: "Analyzing Data" },
  { name: "Working with Multiple Workbooks" },
  { name: "Importing and Exporting Data" },
  { name: "Basic Macros" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0c1220] text-slate-100 overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0c1220]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/informatics-logo.png"
              alt="Informatics Holdings Philippines"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
            <div className="h-5 w-px bg-white/15 mx-1" />
            <Image
              src="/xplore-logo-white.png"
              alt="Xplore Philippines"
              width={80}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
            <div className="h-5 w-px bg-white/15 mx-1" />
            <span className="text-xs text-slate-400 font-medium">TNA Portal</span>
          </div>
          <Link
            href="/admin"
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Access
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#1d6eb5]/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1d6eb5]/40 bg-[#1d6eb5]/10 text-xs font-semibold text-[#60a5fa] uppercase tracking-widest mb-6 animate-fade-in">
            Training Needs Assessment
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-[#60a5fa] via-[#93c5fd] to-[#1d6eb5] bg-clip-text text-transparent text-glow">
              Training Needs
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100">
            A web-based assessment system where you answer training-related questions,
            then our team generates a personalised analysis before sending you actionable training recommendations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              href="/survey"
              id="cta-start-survey"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-xl shadow-blue-900/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Take the Assessment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              How it works
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in-up delay-300">
            {[
              { val: "64",  label: "Questions" },
              { val: "12",  label: "Skill Areas" },
              { val: "7",   label: "Sections" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-white">{val}</div>
                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skill Categories ─────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">
            Microsoft Excel Skill Areas Covered
          </p>
          <p className="text-center text-slate-500 text-sm mb-8">Across 5 self-assessment sections</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(({ name }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-slate-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A simple four-step process that ensures accurate, quality-controlled results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Accept & Fill",    desc: "Accept the privacy notice, fill in your details, then rate your Excel skills across 7 sections.", icon: ClipboardList },
              { step: "02", title: "System Scores It", desc: "Auto-computed experience levels per category — instantly after you submit.", icon: BarChart3 },
              { step: "03", title: "Admin Reviews",    desc: "Our team reviews, adds insights, and approves the results.", icon: ShieldCheck },
              { step: "04", title: "You Get Results",  desc: "Receive tailored Microsoft Excel training program recommendations by email.", icon: CheckCircle2 },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <div key={step} className="relative glass-card p-6 text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                <div className="text-xs font-bold text-[#1d6eb5] mb-3 tracking-widest">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-[#1d6eb5]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-[#60a5fa]" />
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Why This Assessment?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built with the same quality-first philosophy as all Informatics training programs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 flex gap-4 hover:border-[#1d6eb5]/40 transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-[#1d6eb5]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1d6eb5]/30 transition-colors">
                  <Icon className="w-5 h-5 text-[#60a5fa]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 border-[#1d6eb5]/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1d6eb5]/10 to-transparent pointer-events-none" />
            <div className="relative">
              <Users className="w-10 h-10 text-[#60a5fa] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                &quot;The goal is to help identify training needs accurately while maintaining control over the results before releasing them.&quot;
              </p>
              <Link
                href="/survey"
                id="cta-bottom-start"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-xl shadow-blue-900/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Start Assessment Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/informatics-logo.png"
              alt="Informatics Holdings Philippines"
              width={90}
              height={24}
              className="h-6 w-auto object-contain opacity-50"
            />
            <div className="h-4 w-px bg-white/10" />
            <Image
              src="/xplore-logo-white.png"
              alt="Xplore Philippines"
              width={60}
              height={20}
              className="h-5 w-auto object-contain opacity-50"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-600">TNA Portal — Microsoft Excel Corporate Training</p>
            <Link href="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2">Privacy Notice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
