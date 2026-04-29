"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SurveySection, Response, SkillLevel } from "@/lib/tna-data";
import { QUESTIONS } from "@/lib/tna-data";

const LEVEL_ROWS = [
  { level: 1, desc: "Very experienced, often help others." },
  { level: 2, desc: "Experienced, rarely need to ask for help from others." },
  { level: 3, desc: "Moderately experienced, sometimes need to ask for help from others." },
  { level: 4, desc: "Inexperienced, often need to ask for help from others." },
  { level: 5, desc: "No experience at all." },
];

interface Props {
  section: SurveySection;
  sectionIndex: number;
  totalSections: number;
  responses: Record<string, Response>;
  onRate: (qId: string, rating: SkillLevel, wantsToLearn?: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function RatingSectionStep({
  section, sectionIndex, totalSections, responses, onRate, onBack, onNext,
}: Props) {
  const sectionNum = section.sectionNumber;

  return (
    <div className="animate-fade-in">
      {/* Section header */}
      <div className="mb-6">
        <span className="text-xs font-bold text-[#60a5fa] uppercase tracking-widest">
          Section {sectionNum} of 7
        </span>
        <h2 className="text-xl font-bold text-[var(--text-base)] mt-1">SELF-ASSESSMENT RATING SHEET</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Please complete this form by indicating your level of experience in each area.
        </p>
      </div>

      {/* Level legend */}
      <div className="glass-card p-4 mb-8 overflow-x-auto">
        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Experience Levels</p>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs text-[var(--text-muted)] pb-2 pr-4 whitespace-nowrap">Level</th>
              <th className="text-left text-xs text-[var(--text-muted)] pb-2">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {LEVEL_ROWS.map(({ level, desc }) => (
              <tr key={level}>
                <td className="py-2 pr-6 font-bold text-[var(--text-base)] text-center w-12">{level}</td>
                <td className="py-2 text-[var(--text-base)]">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category groups */}
      <div className="space-y-10">
        {section.groups.map((group) => {
          const qs = QUESTIONS.filter((q) => q.category === group.category);
          return (
            <div key={group.category}>
              <h3 className="text-base font-bold text-[var(--text-base)] mb-4 pb-2 border-b border-[var(--border)]">
                {group.title}
              </h3>
              <div className="space-y-4">
                {qs.map((q, qi) => {
                  const resp = responses[q.id];
                  const rating = resp?.rating;
                  const wantsToLearn = resp?.wantsToLearn ?? "";
                  const isHighlyRated = rating === 1 || rating === 2;

                  return (
                    <div key={q.id} className={`glass-card p-5 ${q.isSummary ? "border-[#1d6eb5]/30 bg-[#1d6eb5]/5" : ""}`}>
                      <p className="text-sm font-medium text-[var(--text-base)] mb-4 leading-relaxed">
                        {!q.isSummary && <span className="text-[var(--text-muted)] mr-2">{qi + 1}.</span>}
                        {q.isSummary && <span className="text-[#60a5fa] text-xs font-bold uppercase mr-2">Overall</span>}
                        {q.text}
                        <span className="text-[var(--text-muted)] text-xs ml-2">(optional)</span>
                      </p>

                      {/* Rating buttons 1-5 */}
                      <div className="flex flex-wrap gap-2">
                        {([1, 2, 3, 4, 5] as SkillLevel[]).map((val) => {
                          const selected = rating === val;
                          const colors: Record<number, string> = {
                            1: "#3b82f6", 2: "#22c55e", 3: "#eab308", 4: "#f97316", 5: "#ef4444",
                          };
                          const c = colors[val];
                          return (
                            <button
                              key={val}
                              id={`rate-${q.id}-${val}`}
                              onClick={() => onRate(q.id, val, wantsToLearn)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:-translate-y-0.5"
                              style={selected
                                ? { backgroundColor: c + "25", borderColor: c + "80", color: c }
                                : { backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", color: "#64748b" }}
                            >
                              <span className="font-bold">{val}</span>
                            </button>
                          );
                        })}
                        {rating && (
                          <span className="ml-2 self-center text-xs text-[var(--text-muted)]">
                            {LEVEL_ROWS[rating - 1].desc}
                          </span>
                        )}
                      </div>

                      {/* Fill-in-blank when proficient (rated 1 or 2) */}
                      {isHighlyRated && (
                        <div className="mt-4 animate-fade-in">
                          <label className="block text-xs font-medium text-[#60a5fa] mb-1.5">
                            What else would you like to learn about this topic? <span className="text-[var(--text-muted)]">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. advanced techniques, shortcuts, best practices..."
                            value={wantsToLearn}
                            onChange={(e) => onRate(q.id, rating, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--bg-surface)] border border-[#1d6eb5]/30 text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          id={`btn-section${sectionNum}-next`}
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5"
        >
          {sectionIndex < totalSections - 1 ? (
            <>Next Section <ChevronRight className="w-4 h-4" /></>
          ) : (
            <>Continue <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
      <p className="text-center text-xs text-slate-600 mt-3">All questions in this section are optional — you may skip any item.</p>
    </div>
  );
}
