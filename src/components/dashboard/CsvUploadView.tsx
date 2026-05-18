"use client";
import { useState, useRef } from "react";
import { Upload, FileText, AlertTriangle, X, BarChart3, TrendingUp, Users } from "lucide-react";
import { parseCSVToSubmissions, type Submission } from "@/lib/tna-data";
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

export function CsvUploadView() {
  const [csvSubs, setCsvSubs] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [tab, setTab] = useState<"overview" | "skill" | "table">("overview");
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
        setCsvSubs(parsed);
        setFileName(file.name);
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
          <h3 className="text-lg font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#60a5fa]" /> CSV Upload — Isolated Analysis
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            Upload a CSV exported from this portal. The data is analyzed in isolation — it does <strong>not</strong> affect the main dashboard or database.
          </p>
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
  const approved = csvSubs.filter(s => s.status === "approved").length;
  const sent = csvSubs.filter(s => s.status === "sent").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          Viewing uploaded CSV: <span className="font-bold">{fileName}</span> — {csvSubs.length} records — not live data
        </div>
        <button onClick={() => { setCsvSubs(null); setFileName(""); }}
          className="text-amber-400 hover:text-amber-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", value: csvSubs.length, color: "#3b82f6", icon: Users },
          { label: "Pending", value: pending, color: "#f97316", icon: Users },
          { label: "Approved", value: approved, color: "#22c55e", icon: Users },
          { label: "Sent", value: sent, color: "#a855f7", icon: Users },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass-card p-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="text-3xl font-bold" style={{ color: "var(--text-base)" }}>{value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 border-b border-[var(--border)] pb-0">
        {([["overview", "Overview"], ["skill", "Skill Breakdown"], ["table", "Trainees"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px ${tab === id ? "border-[#1d6eb5] text-[#60a5fa]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-base)]"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#60a5fa]" /> Rating Distribution
            </h4>
            <RatingDistributionChart submissions={csvSubs} />
          </div>
          <div className="glass-card p-6">
            <h4 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#60a5fa]" /> Status Breakdown
            </h4>
            <MiniDonut data={[
              { label: "Pending", value: pending, color: "#f97316" },
              { label: "Approved", value: approved, color: "#22c55e" },
              { label: "Sent", value: sent, color: "#a855f7" },
            ]} />
          </div>
        </div>
      )}

      {tab === "skill" && (
        <div className="glass-card p-6">
          <h4 className="text-sm font-bold text-[var(--text-base)] mb-4">Skill Level Breakdown by Category</h4>
          <SkillLevelBreakdown submissions={csvSubs} />
        </div>
      )}

      {tab === "table" && (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h4 className="text-sm font-bold text-[var(--text-base)]">All Records ({csvSubs.length})</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Trainee</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Job Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Submitted</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {csvSubs.map((s) => (
                  <tr key={s.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="px-6 py-3 font-medium text-[var(--text-base)]">{s.participantInfo.traineeName}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{s.participantInfo.clientName}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{s.participantInfo.jobTitle}</td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs whitespace-nowrap">
                      {new Date(s.submittedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-xs capitalize text-[var(--text-muted)]">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
