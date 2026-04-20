"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  Clock,
  Send,
  LogOut,
  Eye,
  Users,
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  Circle,
} from "lucide-react";
import { getSubmissions, type Submission } from "@/lib/tna-data";

type FilterStatus = "all" | "pending" | "reviewed" | "approved" | "sent";

const STATUS_CONFIG = {
  pending:  { label: "Pending Review", color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", icon: Clock },
  reviewed: { label: "Reviewed",       color: "#3b82f6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", icon: Eye },
  approved: { label: "Approved",       color: "#22c55e", bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  icon: CheckCircle2 },
  sent:     { label: "Result Sent",    color: "#a855f7", bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", icon: Send },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilter]     = useState<FilterStatus>("all");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("tna_admin");
    if (!isAdmin) { router.replace("/admin"); return; }
    setSubmissions(getSubmissions());
    setLoading(false);
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("tna_admin");
    router.push("/admin");
  }

  // Derived stats
  const total    = submissions.length;
  const pending  = submissions.filter((s) => s.status === "pending").length;
  const approved = submissions.filter((s) => s.status === "approved").length;
  const sent     = submissions.filter((s) => s.status === "sent").length;

  // Filtered list
  const filtered = submissions
    .filter((s) => filterStatus === "all" || s.status === filterStatus)
    .filter((s) =>
      search === "" ||
      s.respondentName.toLowerCase().includes(search.toLowerCase()) ||
      s.respondentEmail.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c1220] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1d6eb5]/30 border-t-[#1d6eb5] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c1220] text-slate-100">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-screen w-[200px] bg-[#0a1628] border-r border-[#1e2f4a] flex flex-col z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#1e2f4a]">
          <Image
            src="/informatics-logo.png"
            alt="Informatics Holdings Philippines"
            width={120}
            height={32}
            className="h-7 w-auto object-contain brightness-0 invert opacity-80"
          />
          <span className="text-[9px] text-slate-500 block mt-1 tracking-widest uppercase">Admin Panel</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: "/admin/dashboard", label: "Dashboard",    icon: LayoutDashboard, active: true },
            { href: "/admin/dashboard", label: "Submissions",  icon: ClipboardList,    active: false },
          ].map(({ href, label, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#1d6eb5]/20 text-[#60a5fa] border border-[#1d6eb5]/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            id="btn-admin-logout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <main className="ml-[200px] min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0c1220]/95 backdrop-blur border-b border-white/5 px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <h1 className="text-sm font-semibold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Logged in as Admin
          </div>
        </header>

        <div className="p-8">

          {/* ── KPI Cards ────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: "Total Submissions", value: total,   icon: Users,        color: "#3b82f6" },
              { label: "Pending Review",    value: pending,  icon: Clock,        color: "#f97316" },
              { label: "Approved",          value: approved, icon: CheckCircle2, color: "#22c55e" },
              { label: "Results Sent",      value: sent,     icon: Send,         color: "#a855f7" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card p-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: color + "20" }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Completion rate ───────────────────────────────── */}
          {total > 0 && (
            <div className="glass-card p-5 mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <TrendingUp className="w-4 h-4 text-[#60a5fa]" />
                  Workflow Progress
                </div>
                <span className="text-xs text-slate-500">{total} total submissions</span>
              </div>
              <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-white/5">
                {(["pending","reviewed","approved","sent"] as const).map((s) => {
                  const count = submissions.filter((sub) => sub.status === s).length;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={s}
                      className="h-full transition-all duration-700 bar-animate"
                      style={{ width: `${pct}%`, backgroundColor: STATUS_CONFIG[s].color }}
                      title={`${STATUS_CONFIG[s].label}: ${count}`}
                    />
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                {(["pending","reviewed","approved","sent"] as const).map((s) => {
                  const count = submissions.filter((sub) => sub.status === s).length;
                  return (
                    <div key={s} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Circle className="w-2 h-2 fill-current" style={{ color: STATUS_CONFIG[s].color }} />
                      {STATUS_CONFIG[s].label}: <strong className="text-white ml-0.5">{count}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Submissions Table ─────────────────────────────── */}
          <div className="glass-card overflow-hidden">
            {/* Table header */}
            <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#60a5fa]" />
                All Submissions
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, email, dept…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 pr-3 py-2 w-full sm:w-52 text-xs rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all"
                  />
                </div>
                {/* Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilter(e.target.value as FilterStatus)}
                    className="pl-8 pr-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <ClipboardList className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  {total === 0 ? "No submissions yet. Share the survey link to get started." : "No results match your filters."}
                </p>
              </div>
            )}

            {/* Table */}
            {filtered.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Respondent</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Submitted</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((sub) => {
                      const cfg = STATUS_CONFIG[sub.status];
                      const StatusIcon = cfg.icon;
                      return (
                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{sub.respondentName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{sub.respondentEmail}</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <p className="text-slate-300">{sub.department}</p>
                            <p className="text-xs text-slate-500">{sub.jobTitle}</p>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-400 hidden lg:table-cell whitespace-nowrap">
                            {formatDate(sub.submittedAt)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/admin/submissions/${sub.id}`}
                              id={`btn-review-${sub.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1d6eb5]/20 hover:bg-[#1d6eb5]/40 text-[#60a5fa] transition-all group-hover:translate-x-0.5 whitespace-nowrap"
                            >
                              Review
                              <ChevronRight className="w-3 h-3" />
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

        </div>
      </main>
    </div>
  );
}
