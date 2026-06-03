"use client";
import { useState, useRef } from "react";
import { Upload, FileText, AlertTriangle, X, BarChart3, TrendingUp, Users, Clock, CheckCircle2, Send, Search, Filter } from "lucide-react";
import { parseCSVToSubmissions, type Submission, ALL_CATEGORIES, computeResults, getCategoryLevelBreakdown } from "@/lib/tna-data";
import { RatingDistributionChart } from "./RatingDistributionChart";
import { SkillLevelBreakdown } from "./SkillLevelBreakdown";

function MiniDonut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-slate-500 text-xs text-center py-4">No data</div>;
  const r = 40, cx = 56, cy = 56, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width="112" height="112" className="flex-shrink-0">
        {data.map(({ value, color, label }) => {
          if (value === 0) return null;
          const pct = value / total;
          const dash = pct * circ;
          const el = (
            <circle key={label} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="14"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ} transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--text-base)" fontSize="18" fontWeight="bold">{total}</text>
      </svg>
      <div className="space-y-1.5">
        {data.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[var(--text-muted)]">{label}</span>
            <span className="font-bold ml-auto pl-3" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface CsvUploadViewProps {
  csvSubs: Submission[] | null;
  fileName: string;
  onUpload: (subs: Submission[], name: string) => void;
  onClear: () => void;
}

export function CsvUploadView({ csvSubs, fileName, onUpload, onClear }: CsvUploadViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    setError(null);
    if (!file.name.endsWith(".csv")) { setError("Please upload a .csv file."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSVToSubmissions(text);
        if (parsed.length === 0) { setError("No valid rows found. Make sure this CSV was exported from the TNA portal."); return; }
        onUpload(parsed, file.name);
      } catch {
        setError("Failed to parse CSV. Ensure it was exported from this system.");
      }
    };
    reader.readAsText(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  if (!csvSubs) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-6">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#1d6eb5]/60 hover:bg-[#1d6eb5]/5 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#1d6eb5]/15 flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#60a5fa]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--text-base)]">Drop your CSV file here</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse — must be exported from this TNA portal</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  const pending = csvSubs.filter(s => s.status === "pending").length;
  const reviewed = csvSubs.filter(s => s.status === "reviewed").length;
  const approved = csvSubs.filter(s => s.status === "approved").length;
  const sent = csvSubs.filter(s => s.status === "sent").length;

  // Demographics mapping
  const posMap: Record<string, number> = {};
  const ageMap: Record<string, number> = {};
  csvSubs.forEach(s => {
    const pos = s.participantInfo.positionClassification?.trim() || "Unspecified";
    const age = s.participantInfo.ageBracket?.trim() || "Unspecified";
    posMap[pos] = (posMap[pos] ?? 0) + 1;
    ageMap[age] = (ageMap[age] ?? 0) + 1;
  });
  const posEntries = Object.entries(posMap).sort((a, b) => b[1] - a[1]);
  const ageEntries = Object.entries(ageMap).sort((a, b) => b[1] - a[1]);

  // Priority Training Areas
  const breakdown = getCategoryLevelBreakdown(csvSubs);
  const priorityAreas = ALL_CATEGORIES
    .map(cat => {
      const d = breakdown[cat] ?? { Advanced: 0, Basic: 0 };
      const total = (d.Advanced ?? 0) + (d.Basic ?? 0);
      const basicPct = total > 0 ? Math.round((d.Basic / total) * 100) : 0;
      return { cat, basic: d.Basic, total, basicPct };
    })
    .filter(d => d.total > 0)
    .sort((a, b) => b.basicPct - a.basicPct)
    .slice(0, 5);

  // Overall Health Score
  const allScores: number[] = [];
  csvSubs.forEach(s => {
    const results = s.results ?? computeResults(s.responses);
    results.forEach(r => { if (r.answeredCount > 0) allScores.push(r.avgScore); });
  });
  const overallAvg = allScores.length > 0
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length)
    : 0;
  const healthPct = overallAvg > 0 ? Math.round(((5 - overallAvg) / 4) * 100) : 0;
  const healthColor = healthPct >= 70 ? "#34d399" : healthPct >= 40 ? "#fbbf24" : "#f87171";
  const healthLabel = healthPct >= 70 ? "Strong" : healthPct >= 40 ? "Moderate" : "Needs Work";

  // Filtered CSV trainees table
  const filtered = csvSubs
    .filter(s => filterStatus === "all" || s.status === filterStatus)
    .filter(s => {
      const q = search.toLowerCase();
      return !q || s.participantInfo.traineeName.toLowerCase().includes(q) ||
        s.participantInfo.clientName.toLowerCase().includes(q) ||
        s.participantInfo.email.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          Viewing uploaded CSV: <span className="font-bold">{fileName}</span> — {csvSubs.length} records — not live data
        </div>
        <button onClick={onClear}
          className="flex items-center justify-center p-1 rounded-lg hover:bg-amber-500/25 text-amber-400 hover:text-amber-200 transition-colors"
          title="Clear CSV & upload new">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {[
          { label: "Total Records", value: csvSubs.length, icon: Users, color: "#3b82f6" },
          { label: "Pending Review", value: pending, icon: Clock, color: "#f97316" },
          { label: "Approved", value: approved, icon: CheckCircle2, color: "#22c55e" },
          { label: "Results Sent", value: sent, icon: Send, color: "#a855f7" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="text-3xl font-bold" style={{ color: "var(--text-base)" }}>{value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 — Status + Overall Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Status Donut */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#60a5fa]" /> Status Breakdown
          </h3>
          <MiniDonut data={[
            { label: "Pending", value: pending, color: "#f97316" },
            { label: "Reviewed", value: reviewed, color: "#3b82f6" },
            { label: "Approved", value: approved, color: "#22c55e" },
            { label: "Sent", value: sent, color: "#a855f7" },
          ]} />
        </div>

        {/* Overall Basic/Advanced Classification */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#60a5fa]" /> Overall Classification
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Average score classification of uploaded respondents</p>
          <RatingDistributionChart submissions={csvSubs} isCsv={true} />
        </div>
      </div>

      {/* Row 2: Priority Areas + Demographics + Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Priority Training Areas */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#fbbf24]" /> Priority Training Areas
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Categories with the most respondents needing training</p>
          <div className="space-y-3">
            {priorityAreas.map(({ cat, basic, total, basicPct }, i) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--text-base)] truncate max-w-[65%] font-medium">
                    <span className="text-[var(--text-muted)] mr-1.5">#{i + 1}</span>{cat}
                  </span>
                  <span className="text-xs font-bold text-[#f87171] flex-shrink-0">{basic}/{total} ({basicPct}%)</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${basicPct}%`, backgroundColor: "#f87171", opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Respondent Demographics */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#818cf8]" /> Respondent Demographics
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">Position classification and age distribution</p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">By Position</p>
              <div className="space-y-1.5">
                {posEntries.slice(0, 4).map(([pos, count]) => (
                  <div key={pos} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-base)] truncate max-w-[70%]">{pos}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#818cf8]/70" style={{ width: `${(count / csvSubs.length) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#818cf8] w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">By Age Bracket</p>
              <div className="space-y-1.5">
                {ageEntries.slice(0, 4).map(([age, count]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-base)]">{age}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#7dd3fc]/70" style={{ width: `${(count / csvSubs.length) * 100}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-[#7dd3fc] w-4 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Health Score */}
        <div className="glass-card p-5 flex flex-col">
          <h3 className="text-sm font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" style={{ color: healthColor }} /> Overall Skill Health
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-5">Mean proficiency across all categories (higher = more experienced)</p>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {/* Circular gauge */}
            <svg width="120" height="120" className="flex-shrink-0">
              <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
              <circle cx="60" cy="60" r="48" fill="none" stroke={healthColor} strokeWidth="10"
                strokeDasharray={`${(healthPct / 100) * 2 * Math.PI * 48} ${2 * Math.PI * 48}`}
                strokeDashoffset={2 * Math.PI * 48 * 0.25}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.8s ease", opacity: 0.85 }}
              />
              <text x="60" y="55" textAnchor="middle" fill={healthColor} fontSize="22" fontWeight="bold">{healthPct}%</text>
              <text x="60" y="72" textAnchor="middle" fill="var(--text-muted)" fontSize="10">{healthLabel}</text>
            </svg>
            <div className="w-full space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Mean score</span>
                <span className="font-bold" style={{ color: healthColor }}>{overallAvg.toFixed(2)} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Scale</span>
                <span className="text-[var(--text-muted)]">1 = Expert · 5 = No experience</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Total respondents</span>
                <span className="font-semibold text-[var(--text-base)]">{csvSubs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Level breakdown */}
      <div className="glass-card p-4 sm:p-6 overflow-x-auto">
        <h3 className="text-sm font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#60a5fa]" /> Skill Level by Category
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">Click any row to drill down into respondents for that category</p>
        <SkillLevelBreakdown submissions={csvSubs} isCsv={true} />
      </div>

      {/* All Records Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <h4 className="text-sm font-bold text-[var(--text-base)] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#60a5fa]" /> All Records ({csvSubs.length})
          </h4>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search name, client, email…" value={search} onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 w-full sm:w-52 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-base)] focus:outline-none appearance-none cursor-pointer">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="sent">Sent</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Trainee / Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Job Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[var(--text-muted)] text-sm">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--text-base)]">{s.participantInfo.traineeName}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.participantInfo.clientName}</p>
                    </td>
                    <td className="px-4 py-4 text-[var(--text-muted)] text-xs">{s.participantInfo.jobTitle}</td>
                    <td className="px-4 py-4 text-[var(--text-muted)] text-xs whitespace-nowrap">
                      {new Date(s.submittedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4 text-xs capitalize text-[var(--text-muted)]">{s.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
