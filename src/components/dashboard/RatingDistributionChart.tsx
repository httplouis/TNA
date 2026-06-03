"use client";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  type Submission,
  getRatingDistribution,
  TNA_LEVEL_META,
  type TnaLevel,
} from "@/lib/tna-data";

export function RatingDistributionChart({ submissions, isCsv = false }: { submissions: Submission[]; isCsv?: boolean }) {
  const router = useRouter();
  const counts = getRatingDistribution(submissions);
  const total  = submissions.length;

  if (total === 0) return (
    <div className="flex items-center justify-center h-32 text-slate-500 text-sm">No data yet</div>
  );

  const levels: TnaLevel[] = ["Advanced", "Basic"];

  return (
    <div className="space-y-3">
      {levels.map((lvl) => {
        const meta  = TNA_LEVEL_META[lvl];
        const count = counts[lvl];
        const pct   = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div key={lvl} className="rounded-xl border border-[var(--border)] overflow-hidden">
            {/* Clickable row → navigates to detail page if not CSV */}
            {isCsv ? (
              <div className="w-full px-4 py-3.5 flex items-center gap-3 text-left">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[var(--text-base)]">{meta.label}</span>
                  <span className="ml-2 text-xs text-[var(--text-muted)] hidden sm:inline">{meta.description}</span>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: meta.color }}>
                  {count} ({pct}%)
                </span>
              </div>
            ) : (
              <button
                onClick={() => router.push(`/admin/dashboard/level/${lvl.toLowerCase()}`)}
                className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors text-left group"
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-[var(--text-base)]">{meta.label}</span>
                  <span className="ml-2 text-xs text-[var(--text-muted)] hidden sm:inline">{meta.description}</span>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: meta.color }}>
                  {count} ({pct}%)
                </span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Progress bar */}
            <div className="h-1.5 bg-[var(--bg-surface)] mx-4 mb-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bar-animate"
                style={{ width: `${pct}%`, backgroundColor: meta.color }}
              />
            </div>
          </div>
        );
      })}

      <p className="text-xs text-[var(--text-muted)] pt-1">
        Total respondents: {total} {isCsv ? "" : "· Click a level to view details"} · Classification: avg ≤ 2.5 = Advanced
      </p>
    </div>
  );
}
