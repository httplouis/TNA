"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, ShieldCheck, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  SURVEY_SECTIONS, QUESTIONS, computeResults, saveSubmission, generateId,
  type SkillLevel, type Response, type ParticipantInfo, type OpenAnswers,
} from "@/lib/tna-data";

import PrivacyStep       from "./PrivacyStep";
import InfoStep          from "./InfoStep";
import RatingSectionStep from "./RatingSectionStep";
import Section7Step      from "./Section7Step";
import ReviewStep        from "./ReviewStep";

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = "privacy" | "info" | "section2" | "section3" | "section4" | "section5" | "section6" | "section7" | "review" | "submitting";

const STEP_ORDER: Step[] = ["privacy", "info", "section2", "section3", "section4", "section5", "section6", "section7", "review", "submitting"];
const SECTION_STEPS: Step[] = ["section2", "section3", "section4", "section5", "section6"];

const EMPTY_INFO: ParticipantInfo = { clientName: "", address: "", traineeName: "", jobTitle: "", mobileNumber: "", telephoneNumber: "", email: "" };
const EMPTY_OPEN: OpenAnswers = { tasksPerformed: "", trainingGoals: "" };
const DRAFT_KEY = "tna_survey_draft_v2";

interface Draft {
  step: Step; info: ParticipantInfo; responses: Record<string, Response>;
  openAnswers: OpenAnswers; savedAt: string;
}

function saveDraft(d: Draft) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {} }
function loadDraft(): Draft | null { try { const r = localStorage.getItem(DRAFT_KEY); return r ? JSON.parse(r) : null; } catch { return null; } }
function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch {} }

function formatRelTime(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SurveyPage() {
  const router  = useRouter();
  const topRef  = useRef<HTMLDivElement>(null);

  const [step, setStep]         = useState<Step>("privacy");
  const [info, setInfo]         = useState<ParticipantInfo>(EMPTY_INFO);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [openAnswers, setOA]    = useState<OpenAnswers>(EMPTY_OPEN);
  const [infoErrors, setInfoErrors] = useState<Partial<Record<keyof ParticipantInfo, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft]       = useState<Draft | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate
  useEffect(() => {
    const d = loadDraft();
    if (d && (d.info.clientName || Object.keys(d.responses).length > 0)) {
      setDraft(d); setShowDraftBanner(true);
    }
    setHydrated(true);
  }, []);

  // Auto-save
  useEffect(() => {
    if (!hydrated || step === "submitting") return;
    saveDraft({ step, info, responses, openAnswers, savedAt: new Date().toISOString() });
  }, [step, info, responses, openAnswers, hydrated]);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  function go(s: Step) { setStep(s); scrollTop(); }

  function restoreDraft() {
    if (!draft) return;
    setStep(draft.step === "submitting" ? "review" : draft.step);
    setInfo(draft.info); setResponses(draft.responses); setOA(draft.openAnswers);
    setShowDraftBanner(false); scrollTop();
  }

  function discardDraft() { clearDraft(); setDraft(null); setShowDraftBanner(false); }

  function setRate(qId: string, rating: SkillLevel, wantsToLearn?: string) {
    setResponses(prev => ({ ...prev, [qId]: { questionId: qId, rating, wantsToLearn } }));
  }

  function validateInfo(): boolean {
    const e: Partial<Record<keyof ParticipantInfo, string>> = {};
    if (!info.clientName.trim())   e.clientName  = "Client name is required.";
    if (!info.address.trim())      e.address     = "Address is required.";
    if (!info.traineeName.trim())  e.traineeName = "Trainee name is required.";
    if (!info.jobTitle.trim())     e.jobTitle    = "Job title is required.";
    if (!info.email.trim())        e.email       = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) e.email = "Enter a valid email.";
    setInfoErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    setStep("submitting");
    setSubmitting(true);
    const responseList = Object.values(responses);
    const results      = computeResults(responseList);
    const submission = {
      id:              generateId(),
      participantInfo: info,
      responses:       responseList,
      openAnswers,
      consentGiven:    true,
      submittedAt:     new Date().toISOString(),
      status:          "pending" as const,
      results,
    };
    saveSubmission(submission);
    clearDraft();
    await new Promise(r => setTimeout(r, 1500));
    router.push(`/success?name=${encodeURIComponent(info.traineeName.split(" ")[0] || info.clientName.split(" ")[0])}`);
  }

  // Progress
  const stepIdx    = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length - 1; // exclude "submitting"
  const progress   = Math.round((Math.max(0, stepIdx) / (totalSteps - 1)) * 100);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#60a5fa] border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentSectionIdx = SECTION_STEPS.indexOf(step as Step);
  const currentSection    = currentSectionIdx >= 0 ? SURVEY_SECTIONS[currentSectionIdx] : null;

  function quickFill() {
    setInfo({
      clientName: "Test Company Inc.",
      address: "123 Innovation Drive",
      traineeName: "John Doe",
      jobTitle: "Data Analyst",
      mobileNumber: "09123456789",
      telephoneNumber: "",
      email: "johndoe@example.com"
    });
    const testResponses: Record<string, Response> = {};
    QUESTIONS.forEach(q => {
      // Randomly assign a rating between 1 and 5
      const rating = (Math.floor(Math.random() * 5) + 1) as SkillLevel;
      testResponses[q.id] = { questionId: q.id, rating };
    });
    setResponses(testResponses);
    setOA({
      tasksPerformed: "Creating weekly reports, analyzing sales data.",
      trainingGoals: "Learn how to automate reports with macros."
    });
    setStep("review");
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-base)' }} ref={topRef}>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md transition-colors duration-300" style={{ backgroundColor: 'var(--bg-nav)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-4">
            <Image src="/informatics-logo.png" alt="Informatics Holdings Philippines" width={100} height={26} className="h-6 w-auto object-contain dark:brightness-100 brightness-0" />
            {process.env.NODE_ENV === "development" && (
              <button onClick={quickFill} className="hidden sm:block px-2 py-1 rounded text-[10px] font-bold bg-[#60a5fa]/20 text-[#60a5fa] hover:bg-[#60a5fa]/30 transition-colors uppercase tracking-wider">
                Quick Fill
              </button>
            )}
            <ThemeToggle />
          </div>
          {step !== "privacy" && step !== "submitting" ? (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{Object.keys(responses).length}/{QUESTIONS.length} rated</span>
          ) : <div className="w-20" />}
        </div>
        {step !== "privacy" && step !== "submitting" && (
          <div className="h-0.5" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-full bg-gradient-to-r from-[#1d6eb5] to-[#60a5fa] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* Draft Banner */}
        {showDraftBanner && draft && step === "privacy" && (
          <div className="mb-8 animate-fade-in-up rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-300 mb-1">You have an unfinished survey</p>
                <p className="text-xs text-[var(--text-muted)]">Saved {formatRelTime(draft.savedAt)}
                  {draft.info.traineeName && <> — <span className="text-[var(--text-base)]">{draft.info.traineeName}</span></>}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{Object.keys(draft.responses).length} of {QUESTIONS.length} items rated</p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button id="btn-resume-draft" onClick={restoreDraft} className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black transition-all">Resume</button>
                <button id="btn-discard-draft" onClick={discardDraft} className="px-4 py-2 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] transition-all flex items-center gap-1 justify-center">
                  <RotateCcw className="w-3 h-3" /> Start over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        {step === "privacy"    && <PrivacyStep onAccept={() => go("info")} />}
        {step === "info"       && <InfoStep info={info} onChange={setInfo} errors={infoErrors} onBack={() => go("privacy")} onNext={() => { if (validateInfo()) go("section2"); }} />}
        {step === "section2"   && <RatingSectionStep section={SURVEY_SECTIONS[0]} sectionIndex={0} totalSections={5} responses={responses} onRate={setRate} onBack={() => go("info")} onNext={() => go("section3")} />}
        {step === "section3"   && <RatingSectionStep section={SURVEY_SECTIONS[1]} sectionIndex={1} totalSections={5} responses={responses} onRate={setRate} onBack={() => go("section2")} onNext={() => go("section4")} />}
        {step === "section4"   && <RatingSectionStep section={SURVEY_SECTIONS[2]} sectionIndex={2} totalSections={5} responses={responses} onRate={setRate} onBack={() => go("section3")} onNext={() => go("section5")} />}
        {step === "section5"   && <RatingSectionStep section={SURVEY_SECTIONS[3]} sectionIndex={3} totalSections={5} responses={responses} onRate={setRate} onBack={() => go("section4")} onNext={() => go("section6")} />}
        {step === "section6"   && <RatingSectionStep section={SURVEY_SECTIONS[4]} sectionIndex={4} totalSections={5} responses={responses} onRate={setRate} onBack={() => go("section5")} onNext={() => go("section7")} />}
        {step === "section7"   && <Section7Step answers={openAnswers} onChange={setOA} onBack={() => go("section6")} onNext={() => go("review")} />}
        {step === "review"     && <ReviewStep info={info} responses={responses} openAnswers={openAnswers} onBack={() => go("section7")} onSubmit={handleSubmit} submitting={submitting} />}
        {step === "submitting" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-[#1d6eb5]/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-[#60a5fa] animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-base)] mb-2">Submitting your assessment...</h3>
            <p className="text-[var(--text-muted)] text-sm">Please wait a moment.</p>
          </div>
        )}
      </main>

      {/* Floating Privacy Policy button — visible after privacy step */}
      {step !== "privacy" && step !== "submitting" && (
        <Link
          href="/privacy"
          target="_blank"
          id="btn-view-privacy"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-[var(--bg-surface)]/90 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] hover:border-[#1d6eb5]/40 backdrop-blur-md shadow-xl transition-all hover:-translate-y-0.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#60a5fa]" />
          Privacy Policy
        </Link>
      )}
    </div>
  );
}
