"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import {
  type Submission, type Category, type TnaLevel,
  getCategoryLevelBreakdown,
  getTraineesAtCategoryLevel,
  ALL_CATEGORIES,
} from "@/lib/tna-data";

// Softer, eye-friendly palette
const COLORS: Record<TnaLevel, { text: string; bg: string; border: string; bar: string }> = {
  Advanced: {
    text:   "#6ee7b7", // emerald-300
    bg:     "rgba(110,231,183,0.10)",
    border: "rgba(110,231,183,0.25)",
    bar:    "#34d399", // emerald-400
  },
  Basic: {
    text:   "#fca5a5", // red-300
    bg:     "rgba(252,165,165,0.10)",
    border: "rgba(252,165,165,0.25)",
    bar:    "#f87171", // red-400
  },
};

const PAGE_SIZE = 6;
type Selection = { cat: Category; level: TnaLevel } | null;

export function SkillLevelBreakdown({ submissions }: { submissions: Submission[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [page,      setPage]      = useState(0);
  const [selected,  setSelected]  = useState<Selection>(null);

  const breakdown  = getCategoryLevelBreakdown(submissions);
  const totalPages = Math.ceil(ALL_CATEGORIES.length / PAGE_SIZE);
  const pageSlice  = ALL_CATEGORIES.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const drillTrainees = selected
    ? getTraineesAtCategoryLevel(submissions, selected.cat, selected.level)
    : [];

  const handleSelect = (cat: Category, level: TnaLevel) => {
    setSelected(prev =>
      prev?.cat === cat && prev?.level === level ? null : { cat, level }
    );
  };

  return (
    <div>
      {/* ── Collapsible Toggle ─────────────────────────────────── */}
      <button
        onClick={() => { setCollapsed(c => !c); setSelected(null); }}
        className="w-full flex items-center justify-between py-1 group"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            ● Advanced &nbsp;● Basic &nbsp;·&nbsp; {ALL_CATEGORIES.length} categories
          </span>
        </div>
        <span className="text-[var(--text-muted)] group-hover:text-[var(--text-base)] transition-colors">
          {collapsed
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronUp   className="w-4 h-4" />}
        </span>
      </button>

      {!collapsed && (
        <div className="mt-4 space-y-4">
          {/* ── Table ──────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]"
                    style={{ backgroundColor: "var(--bg-surface)" }}>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] w-[42%]">
                    Category
                  </th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: COLORS.Advanced.text }}>
                    Advanced
                  </th>
                  <th className="text-center px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: COLORS.Basic.text }}>
                    Basic
                  </th>
                  <th className="px-4 py-2.5 w-[28%]">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Distribution
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {pageSlice.map((cat) => {
                  const d     = breakdown[cat] ?? { Advanced: 0, Basic: 0 };
                  const total = (d.Advanced ?? 0) + (d.Basic ?? 0);
                  const advPct = total > 0 ? Math.round((d.Advanced / total) * 100) : 0;
                  const bscPct = total > 0 ? Math.round((d.Basic    / total) * 100) : 0;
                  const isSelAdv = selected?.cat === cat && selected?.level === "Advanced";
                  const isSelBsc = selected?.cat === cat && selected?.level === "Basic";

                  return (
                    <tr
                      key={cat}
                      className="hover:bg-[var(--bg-hover)] transition-colors"
                      style={
                        selected?.cat === cat
                          ? { backgroundColor: "var(--bg-hover)" }
                          : undefined
                      }
                    >
                      {/* Category name */}
                      <td className="px-4 py-3 text-xs font-medium text-[var(--text-base)]">
                        {cat}
                      </td>

                      {/* Advanced badge */}
                      <td className="px-3 py-3 text-center">
                        {d.Advanced > 0 ? (
                          <button
                            onClick={() => handleSelect(cat, "Advanced")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                            style={{
                              color:           COLORS.Advanced.text,
                              backgroundColor: isSelAdv ? COLORS.Advanced.bg : "transparent",
                              border:          `1px solid ${isSelAdv ? COLORS.Advanced.border : "transparent"}`,
                            }}
                            title="Click to see respondents"
                          >
                            {d.Advanced} <span className="opacity-60">({advPct}%)</span>
                          </button>
                        ) : (
                          <span className="text-[var(--text-muted)] text-xs">—</span>
                        )}
                      </td>

                      {/* Basic badge */}
                      <td className="px-3 py-3 text-center">
                        {d.Basic > 0 ? (
                          <button
                            onClick={() => handleSelect(cat, "Basic")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                            style={{
                              color:           COLORS.Basic.text,
                              backgroundColor: isSelBsc ? COLORS.Basic.bg : "transparent",
                              border:          `1px solid ${isSelBsc ? COLORS.Basic.border : "transparent"}`,
                            }}
                            title="Click to see respondents"
                          >
                            {d.Basic} <span className="opacity-60">({bscPct}%)</span>
                          </button>
                        ) : (
                          <span className="text-[var(--text-muted)] text-xs">—</span>
                        )}
                      </td>

                      {/* Mini distribution bar */}
                      <td className="px-4 py-3">
                        {total > 0 ? (
                          <div className="flex h-2 rounded-full overflow-hidden gap-px">
                            {d.Advanced > 0 && (
                              <div
                                className="rounded-l-full"
                                style={{
                                  width:           `${advPct}%`,
                                  backgroundColor: COLORS.Advanced.bar,
                                  opacity:         0.75,
                                }}
                              />
                            )}
                            {d.Basic > 0 && (
                              <div
                                className="rounded-r-full"
                                style={{
                                  width:           `${bscPct}%`,
                                  backgroundColor: COLORS.Basic.bar,
                                  opacity:         0.75,
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="h-2 rounded-full bg-[var(--border)]" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ─────────────────────────────────────── */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, ALL_CATEGORIES.length)} of {ALL_CATEGORIES.length} categories
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setPage(p => p - 1); setSelected(null); }}
                disabled={page === 0}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i); setSelected(null); }}
                  className="w-7 h-7 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: page === i ? "rgba(99,102,241,0.20)" : "transparent",
                    color:           page === i ? "#818cf8" : undefined,
                    border:          page === i ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => { setPage(p => p + 1); setSelected(null); }}
                disabled={page === totalPages - 1}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Drill-down panel ───────────────────────────────── */}
          {selected && (
            <div
              className="rounded-xl border p-4 space-y-3"
              style={{
                borderColor:     COLORS[selected.level].border,
                backgroundColor: COLORS[selected.level].bg,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider"
                     style={{ color: COLORS[selected.level].text }}>
                    {selected.level} · {selected.cat}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {drillTrainees.length} respondent{drillTrainees.length !== 1 ? "s" : ""} at this level for this category
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors p-1"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {drillTrainees.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No respondents found.</p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-[var(--border)]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border)]"
                          style={{ backgroundColor: "var(--bg-surface)" }}>
                        <th className="text-left px-3 py-2 font-semibold text-[var(--text-muted)]">Name</th>
                        <th className="text-left px-3 py-2 font-semibold text-[var(--text-muted)]">Company</th>
                        <th className="text-center px-3 py-2 font-semibold text-[var(--text-muted)]">Category Avg</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {drillTrainees.map(t => (
                        <tr key={t.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                          <td className="px-3 py-2 font-medium text-[var(--text-base)]">{t.trainee}</td>
                          <td className="px-3 py-2 text-[var(--text-muted)]">{t.client}</td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className="font-bold"
                              style={{ color: COLORS[selected.level].text }}
                            >
                              {t.avgScore}/5
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Link
                              href={`/admin/submissions/${t.id}`}
                              className="text-[#818cf8] hover:underline"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
