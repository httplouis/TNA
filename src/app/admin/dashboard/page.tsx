"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, ClipboardList, CheckCircle2, Clock, Send, LogOut,
  Eye, Users, Search, Filter, ChevronRight, FolderOpen, Settings,
  Download, TrendingUp, BarChart3,
} from "lucide-react";
import { getSubmissions, exportToCSV, ALL_CATEGORIES, type Submission } from "@/lib/tna-data";
import { ThemeToggle } from "@/components/ThemeToggle";

type FilterStatus = "all" | "pending" | "reviewed" | "approved" | "sent";
type AdminView    = "dashboard" | "submissions" | "history" | "settings";

const STATUS_CONFIG = {
  pending:  { label: "Pending Review", color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", icon: Clock },
  reviewed: { label: "Reviewed",       color: "#3b82f6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", icon: Eye },
  approved: { label: "Approved",       color: "#22c55e", bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  icon: CheckCircle2 },
  sent:     { label: "Result Sent",    color: "#a855f7", bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", icon: Send },
};

const LEVEL_COLORS: Record<string, string> = {
  "Expert": "#3b82f6", "Proficient": "#22c55e", "Moderate": "#eab308",
  "Developing": "#f97316", "Needs Training": "#ef4444",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="flex items-center justify-center h-32 text-slate-600 text-sm">No data yet</div>;
  let offset = 0;
  const r = 40, cx = 56, cy = 56, circ = 2 * Math.PI * r;
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
      <div className="space-y-2">
        {data.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[var(--text-muted)]">{label}</span>
            <span className="font-bold ml-auto pl-3" style={{ color: 'var(--text-base)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────
function CategoryBarChart({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return <p className="text-slate-600 text-sm text-center py-4">No data yet</p>;
  const avgByCategory = ALL_CATEGORIES.map(cat => {
    const scores: number[] = [];
    submissions.forEach(sub => {
      const r = sub.results?.find(r => r.category === cat);
      if (r && r.answeredCount > 0) scores.push(r.avgScore);
    });
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return { cat, avg: Math.round(avg * 10) / 10 };
  }).filter(d => d.avg > 0).sort((a, b) => b.avg - a.avg); // Sort highest score first (weakest)

  const top5 = avgByCategory.slice(0, 5);

  return (
    <div className="space-y-4">
      {top5.map(({ cat, avg }) => {
        const pct = (avg / 5) * 100;
        const color = avg <= 1.9 ? "#3b82f6" : avg <= 2.9 ? "#22c55e" : avg <= 3.4 ? "#eab308" : avg <= 4.4 ? "#f97316" : "#ef4444";
        return (
          <div key={cat}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[var(--text-base)] truncate max-w-[70%]">{cat}</span>
              <span className="font-semibold ml-2" style={{ color }}>{avg}/5</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
              <div className="h-full rounded-full bar-animate" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-slate-600 pt-2 border-t border-[var(--border)]">Showing Top 5 Weakest Areas (Higher score = less experienced)</p>
    </div>
  );
}

// ── Rating Distribution Pie Chart ───────────────────────────────────────────────
function RatingDistributionPieChart({ submissions }: { submissions: Submission[] }) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  submissions.forEach(s => {
    s.responses.forEach(r => {
      counts[r.rating]++;
      total++;
    });
  });

  if (total === 0) return <div className="flex items-center justify-center h-32 text-slate-600 text-sm">No data yet</div>;

  const data = [
    { label: "Level 1 (Expert)", value: counts[1], color: "#3b82f6" },
    { label: "Level 2 (Proficient)", value: counts[2], color: "#22c55e" },
    { label: "Level 3 (Moderate)", value: counts[3], color: "#eab308" },
    { label: "Level 4 (Developing)", value: counts[4], color: "#f97316" },
    { label: "Level 5 (Needs Training)", value: counts[5], color: "#ef4444" },
  ];

  return <DonutChart data={data} />;
}

// ── Needs Training Bar Chart ──────────────────────────────────────────────────
function NeedsTrainingBarChart({ submissions }: { submissions: Submission[] }) {
  if (submissions.length === 0) return <p className="text-slate-600 text-sm text-center py-4">No data yet</p>;
  
  const needsTrainingPct = ALL_CATEGORIES.map(cat => {
    let needsTrainingCount = 0;
    let answeredCount = 0;
    submissions.forEach(sub => {
      const r = sub.results?.find(res => res.category === cat);
      if (r && r.answeredCount > 0) {
        answeredCount++;
        if (r.avgScore > 2.9) needsTrainingCount++; // Moderate, Developing, Needs Training
      }
    });
    const pct = answeredCount > 0 ? (needsTrainingCount / answeredCount) * 100 : 0;
    return { cat, pct: Math.round(pct) };
  }).filter(d => d.pct > 0).sort((a, b) => b.pct - a.pct);

  if (needsTrainingPct.length === 0) return <p className="text-slate-600 text-sm text-center py-4">No trainees need training.</p>;

  const top5 = needsTrainingPct.slice(0, 5);

  return (
    <div className="space-y-4">
      {top5.map(({ cat, pct }) => {
        const color = pct > 70 ? "#ef4444" : pct > 40 ? "#f97316" : "#eab308";
        return (
          <div key={cat}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[var(--text-base)] truncate max-w-[80%]">{cat}</span>
              <span className="font-semibold ml-2" style={{ color }}>{pct}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
              <div className="h-full rounded-full bar-animate" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-slate-600 pt-2 border-t border-[var(--border)]">Showing Top 5 Highest Priority Training Needs</p>
    </div>
  );
}
// ── Submissions Table ─────────────────────────────────────────────────────────
function SubmissionsTable({ submissions, search, setSearch, filterStatus, setFilter, isSpreadsheet = false }: {
  submissions: Submission[]; search: string; setSearch: (s: string) => void;
  filterStatus: FilterStatus; setFilter: (s: FilterStatus) => void;
  isSpreadsheet?: boolean;
}) {
  const filtered = submissions
    .filter(s => filterStatus === "all" || s.status === filterStatus)
    .filter(s => {
      const q = search.toLowerCase();
      return !q || s.participantInfo.traineeName.toLowerCase().includes(q) ||
        s.participantInfo.clientName.toLowerCase().includes(q) ||
        s.participantInfo.email.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-sm font-bold text-[var(--text-base)] flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#60a5fa]" /> All Submissions
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input type="text" placeholder="Search name, client, email…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 w-full sm:w-52 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
            <select value={filterStatus} onChange={e => setFilter(e.target.value as FilterStatus)}
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

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <ClipboardList className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-[var(--text-muted)] text-sm">{submissions.length === 0 ? "No submissions yet." : "No results match your filters."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-sm min-w-max">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider sticky left-0 z-10" style={{ backgroundColor: "var(--bg-surface)" }}>Trainee / Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Submitted</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                {isSpreadsheet && ALL_CATEGORIES.map(cat => (
                  <th key={cat} className="text-center px-3 py-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider max-w-[80px] truncate" title={cat}>
                    {cat.split(' ').slice(0, 2).join(' ')}
                  </th>
                ))}
                <th className="px-4 py-3 sticky right-0 z-10" style={{ backgroundColor: "var(--bg-surface)" }} />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map(sub => {
                const cfg = STATUS_CONFIG[sub.status];
                const Icon = cfg.icon;
                return (
                  <tr key={sub.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                    <td className="px-6 py-4 sticky left-0 bg-[var(--bg-page)] group-hover:bg-[var(--bg-hover)] transition-colors z-10">
                      <p className="font-medium text-[var(--text-base)]">{sub.participantInfo.traineeName}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub.participantInfo.clientName} · {sub.participantInfo.jobTitle}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-[var(--text-muted)] whitespace-nowrap">{formatDate(sub.submittedAt)}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                        style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        <Icon className="w-3 h-3" />{cfg.label}
                      </span>
                    </td>
                    {isSpreadsheet && ALL_CATEGORIES.map(cat => {
                      const r = sub.results?.find(res => res.category === cat);
                      const score = r && r.answeredCount > 0 ? r.avgScore : null;
                      const color = score && r ? LEVEL_COLORS[r.level] : "transparent";
                      return (
                        <td key={cat} className="px-3 py-4 text-center">
                          {score ? (
                            <span className="px-2 py-1 rounded text-xs font-bold" style={{ color, backgroundColor: color + "15" }}>
                              {score}
                            </span>
                          ) : <span className="text-slate-600 text-xs">—</span>}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 sticky right-0 bg-[var(--bg-page)] group-hover:bg-[var(--bg-hover)] transition-colors z-10 text-right">
                      <Link href={`/admin/submissions/${sub.id}`} id={`btn-review-${sub.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d6eb5]/20 hover:bg-[#1d6eb5]/40 text-[#60a5fa] transition-all whitespace-nowrap">
                        Review <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── History View ──────────────────────────────────────────────────────────────
function HistoryView({ submissions }: { submissions: Submission[] }) {
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [filterYear, setFilterYear] = useState<string>("All Years");
  const [filterMonth, setFilterMonth] = useState<string>("All Months");

  const availableYears = Array.from(new Set(submissions.map(s => new Date(s.submittedAt).getFullYear().toString()))).sort((a, b) => b.localeCompare(a));
  const availableMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const filteredSubmissions = submissions.filter(sub => {
    const d = new Date(sub.submittedAt);
    const year = d.getFullYear().toString();
    const month = d.toLocaleDateString("en-PH", { month: "long" });
    if (filterYear !== "All Years" && year !== filterYear) return false;
    if (filterMonth !== "All Months" && month !== filterMonth) return false;
    return true;
  });

  const grouped = filteredSubmissions.reduce((acc, sub) => {
    const d = new Date(sub.submittedAt);
    const key = d.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(sub);
    return acc;
  }, {} as Record<string, Submission[]>);

  const keys = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-[var(--bg-card)]">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-base)] mb-1 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#60a5fa]" /> Submission History
          </h3>
          <p className="text-sm text-[var(--text-muted)]">View submissions grouped by month. Use the filters to find specific records.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-base)] focus:outline-none appearance-none cursor-pointer">
            <option value="All Months">All Months</option>
            {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-base)] focus:outline-none appearance-none cursor-pointer">
            <option value="All Years">All Years</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {keys.length === 0 ? (
        <div className="py-16 text-center">
          <FolderOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-[var(--text-muted)] text-sm">No submissions found for the selected date range.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map(month => {
            const subs = grouped[month];
            const isOpen = openFolder === month;
            return (
              <div key={month} className="glass-card overflow-hidden">
                <button onClick={() => setOpenFolder(isOpen ? null : month)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-card)] transition-colors">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-[#60a5fa]" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[var(--text-base)]">{month}</p>
                      <p className="text-xs text-[var(--text-muted)]">{subs.length} submission{subs.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-[var(--border)] divide-y divide-white/5">
                    {subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map(sub => {
                      const cfg = STATUS_CONFIG[sub.status];
                      const Icon = cfg.icon;
                      return (
                        <div key={sub.id} className="px-6 py-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-[var(--text-base)]">{sub.participantInfo.traineeName}</p>
                            <p className="text-xs text-[var(--text-muted)]">{sub.participantInfo.clientName} · {formatDate(sub.submittedAt)}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
                              <Icon className="w-3 h-3" />{cfg.label}
                            </span>
                            <Link href={`/admin/submissions/${sub.id}`}
                              className="text-xs text-[#60a5fa] hover:text-[var(--text-base)] transition-colors">
                              View →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Settings View ─────────────────────────────────────────────────────────────
function SettingsView({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="max-w-xl space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-[var(--text-base)] mb-1 flex items-center gap-2"><Download className="w-4 h-4 text-[#60a5fa]" /> Data Export</h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">Export all submissions as a CSV file compatible with Excel.</p>
        <ExportButton />
      </div>
      <div className="glass-card p-6">
        <h3 className="text-sm font-bold text-[var(--text-base)] mb-1">Session</h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">You are logged in as the system administrator.</p>
        <button onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

function ExportButton() {
  const [done, setDone] = useState(false);
  function handleExport() {
    const subs = getSubmissions();
    exportToCSV(subs);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  }
  return (
    <button onClick={handleExport} id="btn-export-csv"
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#1d6eb5]/20 hover:bg-[#1d6eb5]/40 text-[#60a5fa] border border-[#1d6eb5]/30 transition-all">
      <Download className="w-4 h-4" />
      {done ? "Downloaded!" : "Export CSV"}
    </button>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilter]     = useState<FilterStatus>("all");
  const [loading, setLoading]         = useState(true);
  const [view, setView]               = useState<AdminView>("dashboard");

  const refresh = useCallback(() => { setSubmissions(getSubmissions()); }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("tna_admin")) { router.replace("/admin"); return; }
    refresh(); setLoading(false);
  }, [router, refresh]);

  function handleLogout() { sessionStorage.removeItem("tna_admin"); router.push("/admin"); }

  const total    = submissions.length;
  const pending  = submissions.filter(s => s.status === "pending").length;
  const approved = submissions.filter(s => s.status === "approved").length;
  const sent     = submissions.filter(s => s.status === "sent").length;

  const navItems: { id: AdminView; label: string; icon: React.ElementType }[] = [
    { id: "dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { id: "submissions", label: "Submissions",  icon: ClipboardList },
    { id: "history",     label: "History",      icon: FolderOpen },
    { id: "settings",    label: "Settings",     icon: Settings },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#1d6eb5]/30 border-t-[#1d6eb5] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-base)' }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[200px] flex flex-col z-40 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}>
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <Image src="/informatics-logo.png" alt="Informatics" width={120} height={32} className="h-7 w-auto object-contain dark:brightness-100 brightness-0" />
          <span className="text-[9px] block mt-1 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Admin Panel</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${view === id ? "bg-[#1d6eb5]/20 text-[#60a5fa] border border-[#1d6eb5]/30" : "hover:bg-[var(--bg-hover)]"}`}
              style={view !== id ? { color: 'var(--text-muted)' } : {}}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5">
          <button onClick={handleLogout} id="btn-admin-logout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--bg-hover)] transition-all"
            style={{ color: 'var(--text-muted)' }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-[200px] min-h-screen">
        <header className="sticky top-0 z-30 backdrop-blur px-8 h-14 flex items-center justify-between transition-colors duration-300" style={{ backgroundColor: 'var(--bg-nav)', borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            {navItems.find(n => n.id === view) && (() => { const n = navItems.find(n => n.id === view)!; const Icon = n.icon; return <><Icon className="w-4 h-4 text-[var(--text-muted)]" /><h1 className="text-sm font-semibold text-[var(--text-base)]">{n.label}</h1></>; })()}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refresh} className="text-xs text-[var(--text-muted)] hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Refresh</button>
            <ExportButton />
            <ThemeToggle />
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] ml-2 border-l border-[var(--border)] pl-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Admin
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Dashboard view */}
          {view === "dashboard" && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {[
                  { label: "Total Submissions", value: total,   icon: Users,        color: "#3b82f6" },
                  { label: "Pending Review",    value: pending,  icon: Clock,        color: "#f97316" },
                  { label: "Approved",          value: approved, icon: CheckCircle2, color: "#22c55e" },
                  { label: "Results Sent",      value: sent,     icon: Send,         color: "#a855f7" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="glass-card p-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                      <p className="text-3xl font-bold" style={{ color: 'var(--text-base)' }}>{value}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + "20" }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Status Donut */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#60a5fa]" /> Status Breakdown
                  </h3>
                  <DonutChart data={[
                    { label: "Pending",  value: pending,  color: "#f97316" },
                    { label: "Reviewed", value: submissions.filter(s => s.status === "reviewed").length, color: "#3b82f6" },
                    { label: "Approved", value: approved, color: "#22c55e" },
                    { label: "Sent",     value: sent,     color: "#a855f7" },
                  ]} />
                </div>

                {/* Rating Distribution Donut */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#60a5fa]" /> Rating Distribution
                  </h3>
                  <RatingDistributionPieChart submissions={submissions} />
                </div>

                {/* Category Scores */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#60a5fa]" /> Avg Score by Category
                  </h3>
                  <CategoryBarChart submissions={submissions} />
                </div>

                {/* Needs Training Percentages */}
                <div className="glass-card p-6">
                  <h3 className="text-sm font-bold text-[var(--text-base)] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#ef4444]" /> Needs Training (% of Users)
                  </h3>
                  <NeedsTrainingBarChart submissions={submissions} />
                </div>
              </div>

              {/* Recent submissions */}
              <SubmissionsTable submissions={submissions.slice(0, 10)} search={search} setSearch={setSearch} filterStatus={filterStatus} setFilter={setFilter} />
            </>
          )}

          {view === "submissions" && (
            <div className="space-y-6">
              <div className="glass-card p-6 bg-[var(--bg-card)]">
                <h3 className="text-lg font-bold text-[var(--text-base)] mb-2 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#60a5fa]" /> Spreadsheet View
                </h3>
                <p className="text-sm text-[var(--text-muted)]">View all submissions and their individual category scores horizontally. Click <strong>Review</strong> to see detailed answers.</p>
              </div>
              <SubmissionsTable submissions={submissions} search={search} setSearch={setSearch} filterStatus={filterStatus} setFilter={setFilter} isSpreadsheet={true} />
            </div>
          )}

          {view === "history" && <HistoryView submissions={submissions} />}

          {view === "settings" && <SettingsView onLogout={handleLogout} />}
        </div>
      </main>
    </div>
  );
}
