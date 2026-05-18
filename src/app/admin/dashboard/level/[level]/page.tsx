"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, Users, BookOpen, Star, TrendingUp, BarChart3,
  ExternalLink, Search,
} from "lucide-react";
import {
  getSubmissions, getTraineesAtRatingLevel, TNA_LEVEL_META,
  type TnaLevel, type Submission,
} from "@/lib/tna-data";

export default function LevelDetailPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = use(params);
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const tnaLevel = (level === "advanced" ? "Advanced" : "Basic") as TnaLevel;
  const meta = TNA_LEVEL_META[tnaLevel];

  useEffect(() => {
    if (!sessionStorage.getItem("tna_admin")) { router.replace("/admin"); return; }
    setSubmissions(getSubmissions());
    setLoading(false);
  }, [router]);

  const trainees = getTraineesAtRatingLevel(submissions, tnaLevel);
  const filtered = trainees.filter(t =>
    !search || t.trainee.toLowerCase().includes(search.toLowerCase()) ||
    t.client.toLowerCase().includes(search.toLowerCase())
  );

  const totalBasicCats  = filtered.reduce((s, t) => s + t.categoryBreakdown.filter(c => c.level === "Basic").length, 0);
  const totalAdvCats    = filtered.reduce((s, t) => s + t.categoryBreakdown.filter(c => c.level === "Advanced").length, 0);

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1d6eb5]/30 border-t-[#1d6eb5] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-base)" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-[var(--border)]"
        style={{ backgroundColor: "var(--bg-nav)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard"
            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
            <span className="text-sm font-semibold" style={{ color: meta.color }}>{tnaLevel} Level</span>
            <span className="text-[var(--text-muted)] text-sm">— {filtered.length} respondent{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="w-28" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Hero Card */}
        <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          style={{ borderColor: meta.color + "40" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: meta.color + "20" }}>
            <TrendingUp className="w-7 h-7" style={{ color: meta.color }} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1" style={{ color: meta.color }}>{tnaLevel} Level Respondents</h1>
            <p className="text-sm text-[var(--text-muted)]">{meta.description}</p>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: meta.color }}>{filtered.length}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Respondents</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#f97316]">{totalBasicCats}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Basic Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#3b82f6]">{totalAdvCats}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Advanced Categories</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by name or client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all"
          />
        </div>

        {/* Respondent Cards */}
        {filtered.length === 0 ? (
          <div className="glass-card py-20 text-center">
            <Users className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-[var(--text-muted)] text-sm">No respondents found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((t, idx) => {
              const basicCats = t.categoryBreakdown.filter(c => c.level === "Basic");
              const advCats   = t.categoryBreakdown.filter(c => c.level === "Advanced");
              const trainingNeeds = [...new Set(basicCats.flatMap(c => c.recommendations))];

              return (
                <div key={t.id} className="glass-card p-6 space-y-5">
                  {/* Trainee Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: meta.color + "20", color: meta.color }}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-base font-bold text-[var(--text-base)]">{t.trainee}</p>
                        <p className="text-xs text-[var(--text-muted)]">{t.client} · Overall avg: <span className="font-semibold" style={{ color: meta.color }}>{t.overallAvg}/5</span></p>
                      </div>
                    </div>
                    <Link href={`/admin/submissions/${t.id}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#1d6eb5]/20 hover:bg-[#1d6eb5]/40 text-[#60a5fa] transition-all flex-shrink-0">
                      View Full Submission <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Summary badges */}
                  <div className="flex gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3b82f6]/10 border border-[#3b82f6]/25 text-[#3b82f6]">
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                      {advCats.length} Advanced
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f97316]/10 border border-[#f97316]/25 text-[#f97316]">
                      <span className="w-2 h-2 rounded-full bg-[#f97316]" />
                      {basicCats.length} Need Training
                    </span>
                  </div>

                  {/* Category Breakdown */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-2.5">
                      <BarChart3 className="w-3 h-3" /> Category Breakdown
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t.categoryBreakdown.map(c => (
                        <span key={c.category}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
                          style={{
                            color: c.level === "Advanced" ? "#3b82f6" : "#f97316",
                            backgroundColor: c.level === "Advanced" ? "rgba(59,130,246,0.1)" : "rgba(249,115,22,0.1)",
                            border: `1px solid ${c.level === "Advanced" ? "rgba(59,130,246,0.3)" : "rgba(249,115,22,0.3)"}`,
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: c.level === "Advanced" ? "#3b82f6" : "#f97316" }} />
                          {c.category}
                          <span className="opacity-70">({c.avgScore})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Training Needs */}
                  {trainingNeeds.length > 0 && (
                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5 mb-2.5">
                        <BookOpen className="w-3 h-3" /> Recommended Training Programs
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {trainingNeeds.map(rec => (
                          <span key={rec}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#1d6eb5]/10 border border-[#1d6eb5]/25 text-[#60a5fa]">
                            <Star className="w-2.5 h-2.5 flex-shrink-0" />{rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {trainingNeeds.length === 0 && tnaLevel === "Advanced" && (
                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="text-xs text-[#3b82f6] flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" />
                        Strong proficiency across all areas. Advanced or specialization programs recommended.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
