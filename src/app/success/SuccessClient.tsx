"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, Mail, ArrowLeft, BookOpen, ChevronRight, TrendingUp, AlertTriangle, BadgeCheck } from "lucide-react";
import { getSubmissions, TRAINING_MAP, type Submission, type CategoryResult, type Category } from "@/lib/tna-data";

const LEVEL_COLOR: Record<string, string> = {
  "Expert": "#3b82f6", "Proficient": "#22c55e", "Moderate": "#eab308",
  "Developing": "#f97316", "Needs Training": "#ef4444",
};

const PRIORITY: Record<string, number> = {
  "Needs Training": 0, "Developing": 1, "Moderate": 2, "Proficient": 3, "Expert": 4,
};

function TrainingRecommendations({ results }: { results: CategoryResult[] }) {
  const needsTraining = results
    .filter(r => !["Expert", "Proficient"].includes(r.level) && r.answeredCount > 0)
    .sort((a, b) => PRIORITY[a.level] - PRIORITY[b.level]);
  const allGood = needsTraining.length === 0;

  return (
    <div className="glass-card p-6 text-left mb-6">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-[#60a5fa]" />
        <h2 className="text-sm font-bold text-white">Preliminary Training Suggestions</h2>
      </div>
      <p className="text-xs text-slate-500 mb-5">Based on your ratings. Final recommendations will be confirmed by our team after review.</p>

      {allGood ? (
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <BadgeCheck className="w-5 h-5 text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-300">Your ratings show strong experience across all categories. Advanced or leadership programs are recommended.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {needsTraining.map(r => {
            const color    = LEVEL_COLOR[r.level];
            const programs = TRAINING_MAP[r.category as Category];
            return (
              <div key={r.category} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{r.category}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full"
                      style={{ color, backgroundColor: color + "20", border: `1px solid ${color}40` }}>
                      {r.level === "Needs Training" && <AlertTriangle className="w-3 h-3" />}
                      {r.level}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white">{r.avgScore}</span>
                    <span className="text-xs text-slate-500">/5</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-2">Suggested programs:</p>
                <ul className="space-y-1.5">
                  {programs.map(prog => (
                    <li key={prog} className="flex items-center gap-2 text-xs text-slate-300">
                      <ChevronRight className="w-3 h-3 text-[#60a5fa] flex-shrink-0" />{prog}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Score summary */}
      <div className="mt-5 pt-5 border-t border-white/5">
        <p className="text-xs text-slate-500 mb-3">Your scores at a glance (1=Expert, 5=Needs Training):</p>
        <div className="space-y-2">
          {results.filter(r => r.answeredCount > 0).map(r => {
            const color = LEVEL_COLOR[r.level];
            const pct   = (r.avgScore / 5) * 100;
            return (
              <div key={r.category}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{r.category}</span>
                  <span className="font-semibold" style={{ color }}>{r.avgScore}/5 — {r.level}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
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
    <div className="min-h-screen bg-[#0c1220] flex flex-col items-center justify-start px-6 py-12 text-center">
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

        <h1 className="text-3xl font-bold text-white mb-3">Thank you, {displayName}!</h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          Your Microsoft Excel Training Needs Assessment has been successfully submitted. Our team will review your results and send you personalised training recommendations.
        </p>

        {latestResults && <TrainingRecommendations results={latestResults} />}

        <div className="glass-card p-6 text-left mb-6">
          <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
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
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/survey" className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5">
            Take Another Assessment
          </Link>
        </div>

        <p className="text-xs text-slate-600 mt-6">Informatics Holdings Philippines · TNA Portal</p>
      </div>
    </div>
  );
}
