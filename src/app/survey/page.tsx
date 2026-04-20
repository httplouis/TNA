"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Briefcase,
  Building2,
  RotateCcw,
  Clock,
} from "lucide-react";
import {
  QUESTIONS,
  CATEGORIES,
  computeResults,
  saveSubmission,
  generateId,
  type SkillLevel,
  type Response as TnaResponse,
  type Category,
} from "@/lib/tna-data";

// ── Step definitions ──────────────────────────────────────────────────────────
type Step = "intro" | "info" | "survey" | "review" | "submitting";

interface DraftInfo {
  name:       string;
  email:      string;
  department: string;
  jobTitle:   string;
}

interface SurveyDraft {
  step:         Step;
  activeCatIdx: number;
  info:         DraftInfo;
  responses:    Record<string, TnaResponse>;
  savedAt:      string;
}

const DRAFT_KEY = "tna_survey_draft";

function saveDraft(draft: SurveyDraft) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft(): SurveyDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${Math.floor(hours / 24)} day(s) ago`;
}

const CATEGORY_COLORS: Record<Category, string> = {
  "Communication Skills":      "#3b82f6",
  "Technical Skills":          "#8b5cf6",
  "Leadership & Management":   "#f59e0b",
  "Problem Solving":           "#10b981",
  "Teamwork & Collaboration":  "#ec4899",
  "Customer Service":          "#f97316",
};

const RATING_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function SurveyPage() {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep]                 = useState<Step>("intro");
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [info, setInfo] = useState<DraftInfo>({
    name:       "",
    email:      "",
    department: "",
    jobTitle:   "",
  });
  const [errors, setErrors]       = useState<Partial<DraftInfo>>({});
  const [responses, setResponses] = useState<Record<string, TnaResponse>>({});

  // Draft restore state
  const [draft, setDraft]                   = useState<SurveyDraft | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [hydrated, setHydrated]             = useState(false);

  // ── Derived ────────────────────────────────────────────────────────────────
  const activeCategory     = CATEGORIES[activeCatIdx];
  const categoryQuestions  = QUESTIONS.filter((q) => q.category === activeCategory);
  const totalAnswered      = Object.keys(responses).length;
  const totalQuestions     = QUESTIONS.length;
  const progress           = Math.round((totalAnswered / totalQuestions) * 100);

  // ── Draft: Load on mount ───────────────────────────────────────────────────
  useEffect(() => {
    const saved = loadDraft();
    if (saved && (saved.info.name.trim() || Object.keys(saved.responses).length > 0)) {
      setDraft(saved);
      setShowDraftBanner(true);
    }
    setHydrated(true);
  }, []);

  // ── Draft: Auto-save on any change ────────────────────────────────────────
  useEffect(() => {
    if (!hydrated) return;
    if (step === "submitting") return;
    saveDraft({ step, activeCatIdx, info, responses, savedAt: new Date().toISOString() });
  }, [step, activeCatIdx, info, responses, hydrated]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function restoreDraft() {
    if (!draft) return;
    setStep(draft.step === "submitting" ? "review" : draft.step);
    setActiveCatIdx(draft.activeCatIdx);
    setInfo(draft.info);
    setResponses(draft.responses);
    setShowDraftBanner(false);
    scrollTop();
  }

  function discardDraft() {
    clearDraft();
    setDraft(null);
    setShowDraftBanner(false);
  }

  function setRating(questionId: string, rating: SkillLevel) {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { questionId, rating },
    }));
  }

  function validateInfo() {
    const errs: Partial<DraftInfo> = {};
    if (!info.name.trim())       errs.name       = "Full name is required.";
    if (!info.email.trim())      errs.email      = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) errs.email = "Enter a valid email.";
    if (!info.department.trim()) errs.department = "Department is required.";
    if (!info.jobTitle.trim())   errs.jobTitle   = "Job title is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function isCategoryComplete(cat: Category) {
    const qs = QUESTIONS.filter((q) => q.category === cat);
    return qs.every((q) => responses[q.id] !== undefined);
  }

  function currentCategoryComplete() {
    return isCategoryComplete(activeCategory);
  }

  function nextCategory() {
    if (activeCatIdx < CATEGORIES.length - 1) {
      setActiveCatIdx((i) => i + 1);
      scrollTop();
    } else {
      setStep("review");
      scrollTop();
    }
  }

  function prevCategory() {
    if (activeCatIdx > 0) {
      setActiveCatIdx((i) => i - 1);
      scrollTop();
    }
  }

  async function handleSubmit() {
    setStep("submitting");
    const responseList = Object.values(responses);
    const results      = computeResults(responseList);
    const submission   = {
      id:              generateId(),
      respondentName:  info.name,
      respondentEmail: info.email,
      department:      info.department,
      jobTitle:        info.jobTitle,
      responses:       responseList,
      submittedAt:     new Date().toISOString(),
      status:          "pending" as const,
      results,
    };
    saveSubmission(submission);
    clearDraft();
    await new Promise((r) => setTimeout(r, 1500));
    router.push(`/success?name=${encodeURIComponent(info.name.split(" ")[0])}`);
  }

  // ── Prevent hydration mismatch flash ──────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0c1220] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#60a5fa] border-t-transparent animate-spin" />
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0c1220] text-slate-100" ref={topRef}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0c1220]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Informatics Logo */}
          <Image
            src="/informatics-logo.png"
            alt="Informatics Holdings Philippines"
            width={100}
            height={26}
            className="h-6 w-auto object-contain"
          />

          {step === "survey" && (
            <span className="text-xs text-slate-400">{totalAnswered}/{totalQuestions} answered</span>
          )}
          {step !== "survey" && <div className="w-20" />}
        </div>

        {/* Progress bar */}
        {step === "survey" && (
          <div className="h-0.5 bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#1d6eb5] to-[#60a5fa] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* ── Draft Restore Banner ───────────────────────────────────────── */}
        {showDraftBanner && draft && step === "intro" && (
          <div className="mb-8 animate-fade-in-up rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-300 mb-1">
                  You have an unfinished survey
                </p>
                <p className="text-xs text-slate-400 mb-1">
                  Saved&nbsp;
                  <span className="text-slate-300">{formatRelativeTime(draft.savedAt)}</span>
                  {draft.info.name && (
                    <> &mdash; <span className="text-slate-300">{draft.info.name}</span></>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {Object.keys(draft.responses).length} of {totalQuestions} questions answered
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  id="btn-resume-draft"
                  onClick={restoreDraft}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-all"
                >
                  Resume
                </button>
                <button
                  id="btn-discard-draft"
                  onClick={discardDraft}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1 justify-center"
                >
                  <RotateCcw className="w-3 h-3" />
                  Start over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STEP 1 – INTRO
        ═══════════════════════════════════════════════════════ */}
        {step === "intro" && (
          <div className="animate-fade-in-up text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#1d6eb5]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-[#60a5fa]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Before you begin</h1>
            <p className="text-slate-400 leading-relaxed mb-6">
              This Training Needs Assessment contains <strong className="text-white">18 questions</strong> across{" "}
              <strong className="text-white">6 skill categories</strong>. Rate your current proficiency on each
              item using a <strong className="text-white">1–5 scale</strong>.
            </p>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Takes approximately 8–10 minutes to complete",
                "All answers are kept strictly confidential",
                "Results are reviewed by our team before being sent to you",
                "Be honest — this helps us give you the best recommendations",
                "Your progress is automatically saved — you can close this tab and return anytime",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#60a5fa] mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
            <button
              id="btn-proceed-info"
              onClick={() => { setStep("info"); scrollTop(); }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5"
            >
              Proceed to Step 1 — Your Information
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STEP 2 – RESPONDENT INFO
        ═══════════════════════════════════════════════════════ */}
        {step === "info" && (
          <div className="animate-fade-in-up max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Your Information</h2>
            <p className="text-slate-400 text-sm mb-8">
              This information helps us personalize your assessment results.
            </p>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="input-name">
                  <User className="w-3.5 h-3.5 inline mr-1.5 text-slate-500" />
                  Full Name *
                </label>
                <input
                  id="input-name"
                  type="text"
                  placeholder="e.g. Juan dela Cruz"
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all ${errors.name ? "border-red-500/60" : "border-white/10 focus:border-[#1d6eb5]/40"}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="input-email">
                  <Mail className="w-3.5 h-3.5 inline mr-1.5 text-slate-500" />
                  Email Address *
                </label>
                <input
                  id="input-email"
                  type="email"
                  placeholder="e.g. juan@company.com"
                  value={info.email}
                  onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all ${errors.email ? "border-red-500/60" : "border-white/10 focus:border-[#1d6eb5]/40"}`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="input-dept">
                  <Building2 className="w-3.5 h-3.5 inline mr-1.5 text-slate-500" />
                  Department *
                </label>
                <input
                  id="input-dept"
                  type="text"
                  placeholder="e.g. Operations, HR, Sales..."
                  value={info.department}
                  onChange={(e) => setInfo({ ...info, department: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all ${errors.department ? "border-red-500/60" : "border-white/10 focus:border-[#1d6eb5]/40"}`}
                />
                {errors.department && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.department}</p>}
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="input-job">
                  <Briefcase className="w-3.5 h-3.5 inline mr-1.5 text-slate-500" />
                  Job Title *
                </label>
                <input
                  id="input-job"
                  type="text"
                  placeholder="e.g. Team Lead, Coordinator, Analyst..."
                  value={info.jobTitle}
                  onChange={(e) => setInfo({ ...info, jobTitle: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all ${errors.jobTitle ? "border-red-500/60" : "border-white/10 focus:border-[#1d6eb5]/40"}`}
                />
                {errors.jobTitle && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.jobTitle}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep("intro")}
                className="px-5 py-3 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                Back
              </button>
              <button
                id="btn-start-survey"
                onClick={() => { if (validateInfo()) { setStep("survey"); scrollTop(); } }}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5"
              >
                Start Survey
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STEP 3 – SURVEY
        ═══════════════════════════════════════════════════════ */}
        {step === "survey" && (
          <div className="animate-fade-in">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-6 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Progress auto-saved
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
              {CATEGORIES.map((cat, i) => {
                const complete = isCategoryComplete(cat);
                const isActive = i === activeCatIdx;
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCatIdx(i); scrollTop(); }}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : complete
                        ? "bg-white/5 text-green-400 border border-green-500/20"
                        : "bg-white/5 text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300"
                    }`}
                    style={isActive ? { backgroundColor: CATEGORY_COLORS[cat] + "30", borderColor: CATEGORY_COLORS[cat] + "60", border: "1px solid" } : {}}
                  >
                    {complete && !isActive && <CheckCircle2 className="w-3 h-3" />}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />}
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Category header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[activeCategory] }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: CATEGORY_COLORS[activeCategory] }}>
                  {activeCatIdx + 1} of {CATEGORIES.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{activeCategory}</h2>
              <p className="text-sm text-slate-400 mt-1">
                Rate your current level for each item below (1 = Very Low, 5 = Very High)
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-5">
              {categoryQuestions.map((q, qi) => {
                const current = responses[q.id]?.rating;
                return (
                  <div
                    key={q.id}
                    className="glass-card p-6 animate-fade-in-up"
                    style={{ animationDelay: `${qi * 80}ms` }}
                  >
                    <p className="text-sm font-medium text-slate-200 mb-5 leading-relaxed">
                      <span className="text-slate-500 mr-2">{qi + 1}.</span>
                      {q.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Very Low</span>
                      <div className="flex gap-3">
                        {([1, 2, 3, 4, 5] as SkillLevel[]).map((val) => {
                          const filled = current !== undefined && val <= current;
                          return (
                            <button
                              key={val}
                              id={`rating-${q.id}-${val}`}
                              onClick={() => setRating(q.id, val)}
                              className="star-btn flex flex-col items-center gap-1 group"
                              aria-label={`Rate ${RATING_LABELS[val]}`}
                            >
                              <Star
                                className={`w-7 h-7 transition-all ${
                                  filled
                                    ? "fill-current text-amber-400"
                                    : "text-slate-700 group-hover:text-amber-400/50"
                                }`}
                              />
                              <span className={`text-xs ${filled ? "text-amber-400" : "text-slate-700"}`}>
                                {val}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs text-slate-600">Very High</span>
                    </div>
                    {current && (
                      <p className="text-center text-xs text-amber-400/70 mt-3 animate-fade-in">
                        Selected: <strong>{RATING_LABELS[current]}</strong>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={prevCategory}
                disabled={activeCatIdx === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                id="btn-next-category"
                onClick={nextCategory}
                disabled={!currentCategoryComplete()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {activeCatIdx < CATEGORIES.length - 1 ? (
                  <>Next Category <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Review Answers <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
            {!currentCategoryComplete() && (
              <p className="text-center text-xs text-slate-600 mt-3">
                Please answer all questions in this section to continue.
              </p>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            STEP 4 – REVIEW
        ═══════════════════════════════════════════════════════ */}
        {step === "review" && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-2">Review & Submit</h2>
            <p className="text-slate-400 text-sm mb-8">
              Please verify your information before submitting.
            </p>

            {/* Info summary */}
            <div className="glass-card p-5 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Respondent Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name:</span> <span className="text-white ml-2">{info.name}</span></div>
                <div><span className="text-slate-500">Email:</span> <span className="text-white ml-2">{info.email}</span></div>
                <div><span className="text-slate-500">Dept:</span> <span className="text-white ml-2">{info.department}</span></div>
                <div><span className="text-slate-500">Title:</span> <span className="text-white ml-2">{info.jobTitle}</span></div>
              </div>
            </div>

            {/* Category completion */}
            <div className="glass-card p-5 mb-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Survey Completion</h3>
              <div className="space-y-3">
                {CATEGORIES.map((cat) => {
                  const qs       = QUESTIONS.filter((q) => q.category === cat);
                  const answered = qs.filter((q) => responses[q.id]).length;
                  const pct      = Math.round((answered / qs.length) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300">{cat}</span>
                        <span className="text-slate-500">{answered}/{qs.length}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bar-animate"
                          style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-sm">
                <span className="text-slate-400">Total Answered</span>
                <span className="font-bold text-white">{totalAnswered} / {totalQuestions}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep("survey"); scrollTop(); }}
                className="px-5 py-3 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                Edit Answers
              </button>
              <button
                id="btn-submit-survey"
                onClick={handleSubmit}
                disabled={totalAnswered < totalQuestions}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                Submit Assessment
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SUBMITTING
        ═══════════════════════════════════════════════════════ */}
        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-[#1d6eb5]/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-[#60a5fa] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Send className="w-7 h-7 text-[#60a5fa]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Submitting your assessment...</h3>
            <p className="text-slate-400 text-sm">Please wait a moment.</p>
          </div>
        )}

      </main>
    </div>
  );
}
