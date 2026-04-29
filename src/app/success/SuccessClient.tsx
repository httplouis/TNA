"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, Mail, ArrowLeft, BookOpen, TrendingUp } from "lucide-react";
import { getSubmissions, type Submission, type CategoryResult } from "@/lib/tna-data";

const LEVEL_COLOR: Record<string, string> = {
  "Expert": "#3b82f6", "Proficient": "#22c55e", "Moderate": "#eab308",
  "Developing": "#f97316", "Needs Training": "#ef4444",
};

const PRIORITY: Record<string, number> = {
  "Needs Training": 0, "Developing": 1, "Moderate": 2, "Proficient": 3, "Expert": 4,
};

type AIRecommendation = {
  introMessage: string;
  recommendations: { topic: string; description: string }[];
};

function TrainingRecommendations({ results }: { results: CategoryResult[] }) {
  const [aiData, setAiData] = useState<AIRecommendation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiData(data.aiData);
        } else {
          setErrorMsg("Failed to generate recommendations at this time.");
        }
      } catch (error) {
        setErrorMsg("Failed to generate recommendations at this time.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, [results]);

  return (
    <div className="glass-card p-6 text-left mb-6">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-[#60a5fa]" />
        <h2 className="text-sm font-bold text-[var(--text-base)]">AI Training Recommendations</h2>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-5">Personalised suggestions powered by AI based on your results.</p>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#60a5fa] border-t-transparent animate-spin" />
          <p className="text-sm text-[#60a5fa] animate-pulse">Analyzing your strengths and areas for growth...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
          {errorMsg}
        </div>
      ) : aiData ? (
        <div className="space-y-4">
          <div className="bg-[#1d6eb5]/10 border border-[#1d6eb5]/20 rounded-xl p-4">
            <p className="text-sm text-[var(--text-base)] leading-relaxed italic">
              "{aiData.introMessage}"
            </p>
          </div>
          <div className="space-y-3">
            {aiData.recommendations?.map((rec, i) => (
              <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 flex gap-3 hover:bg-[var(--bg-hover)] transition-colors">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-[#60a5fa]/20 flex items-center justify-center flex-shrink-0 text-[#60a5fa] text-xs font-bold">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-base)] mb-1">{rec.topic}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Score summary */}
      <div className="mt-5 pt-5 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)] mb-3">Your scores at a glance (1=Expert, 5=Needs Training):</p>
        <div className="space-y-2">
          {results.filter(r => r.answeredCount > 0).map(r => {
            const color = LEVEL_COLOR[r.level];
            const pct   = (r.avgScore / 5) * 100;
            return (
              <div key={r.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-muted)]">{r.category}</span>
                  <span className="font-semibold" style={{ color }}>{r.avgScore}/5 — {r.level}</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bar-animate" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-4 italic">Note: These are preliminary suggestions. Our team will review and finalise your results before sending them.</p>
    </div>
  );
}

export default function SuccessClient() {
  const searchParams  = useSearchParams();
  const rawName       = searchParams.get("name") ?? "";
  const displayName   = rawName ? decodeURIComponent(rawName) : "there";

  const [latestResults, setLatestResults] = useState<CategoryResult[] | null>(null);

  useEffect(() => {
    const all = getSubmissions();
    if (all.length === 0) return;
    const latest = all[all.length - 1] as Submission;
    if (latest.results && latest.results.length > 0) setLatestResults(latest.results);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-start px-6 py-12 text-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1d6eb5]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-xl w-full animate-scale-in">
        <div className="mb-8">
          <Image src="/informatics-logo.png" alt="Informatics Holdings Philippines" width={130} height={36} className="h-9 w-auto object-contain mx-auto" />
        </div>

        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#1d6eb5]/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#60a5fa]" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-[#1d6eb5]/10" />
        </div>

        <h1 className="text-3xl font-bold text-[var(--text-base)] mb-3">Thank you, {displayName}!</h1>
        <p className="text-[var(--text-muted)] leading-relaxed mb-8">
          Your Microsoft Excel Training Needs Assessment has been successfully submitted. Our team will review your results and send you personalised training recommendations.
        </p>

        {latestResults && <TrainingRecommendations results={latestResults} />}

        <div className="glass-card p-6 text-left mb-6">
          <h2 className="text-sm font-bold text-[var(--text-base)] mb-4 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#60a5fa]" /> What happens next
          </h2>
          <div className="space-y-4">
            {[
              { icon: Clock,        title: "Admin Review",    desc: "Our team reviews your submitted responses and computed scores." },
              { icon: CheckCircle2, title: "Result Approval", desc: "Scores are verified and training recommendations are finalised." },
              { icon: Mail,         title: "You are Notified", desc: "Results are sent to your email once approved — usually within 2–3 business days." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#1d6eb5]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#60a5fa]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-base)]">{title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/survey" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5">
            Take Another Assessment
          </Link>
        </div>

        <p className="text-xs text-slate-600 mt-6">Informatics Holdings Philippines · TNA Portal</p>
      </div>
    </div>
  );
}
