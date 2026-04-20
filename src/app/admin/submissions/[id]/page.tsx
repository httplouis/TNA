"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  CheckCircle2,
  Send,
  Clock,
  Eye,
  Star,
  User,
  Mail,
  Building2,
  Briefcase,
  Calendar,
  MessageSquare,
  AlertCircle,
  Loader2,
  ExternalLink,
  FileText,
} from "lucide-react";
import {
  getSubmissionById,
  saveSubmission,
  CATEGORIES,
  QUESTIONS,
  TRAINING_MAP,
  type Submission,
  type CategoryResult,
  type Category,
} from "@/lib/tna-data";

// ── Config ──────────────────────────────────────────────────────────────────

const STATUS_FLOW = ["pending", "reviewed", "approved", "sent"] as const;
type TStatus = (typeof STATUS_FLOW)[number];

const STATUS_CONFIG: Record<TStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending:  { label: "Pending Review", color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", icon: Clock },
  reviewed: { label: "Reviewed",       color: "#3b82f6", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", icon: Eye },
  approved: { label: "Approved",       color: "#22c55e", bg: "rgba(34,197,94,0.15)",  border: "rgba(34,197,94,0.3)",  icon: CheckCircle2 },
  sent:     { label: "Result Sent",    color: "#a855f7", bg: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", icon: Send },
};

const LEVEL_COLOR: Record<string, string> = {
  "Needs Improvement": "#ef4444",
  "Developing":        "#f97316",
  "Satisfactory":      "#eab308",
  "Proficient":        "#22c55e",
  "Strong":            "#3b82f6",
};

const RATING_LABELS: Record<number, string> = { 1: "Very Low", 2: "Low", 3: "Moderate", 4: "High", 5: "Very High" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ── Email template generator ────────────────────────────────────────────────

function generateEmailBody(sub: Submission): string {
  if (!sub.results) return "";

  const firstName = sub.respondentName.split(" ")[0];

  const resultLines = sub.results
    .map((r) => `  • ${r.category}: ${r.avgScore}/5 — ${r.level}`)
    .join("\n");

  const recommendations = sub.results
    .filter((r) => !["Proficient", "Strong"].includes(r.level))
    .map((r) => {
      const programs = TRAINING_MAP[r.category as Category].map((p) => `      - ${p}`).join("\n");
      return `  ${r.category} (${r.level}):\n${programs}`;
    })
    .join("\n\n");

  const allStrong = recommendations === "";

  return `Dear ${firstName},

Thank you for completing the Training Needs Assessment. Below are your results based on your submissions, which have been reviewed and approved by our team.

ASSESSMENT RESULTS
==================
${resultLines}

${allStrong
    ? "RECOMMENDATIONS\n================\nYour scores reflect strong performance across all skill areas. We recommend looking into leadership development or train-the-trainer programs to further sharpen your expertise."
    : `RECOMMENDED TRAINING PROGRAMS\n==============================\n${recommendations}`}

Our team will be in touch to assist you in enrolling in the appropriate training programs.

Should you have any questions, please do not hesitate to reach out.

Best regards,
Informatics Holdings Philippines
Training & Development Team
`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SubmissionReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }   = use(params);
  const router   = useRouter();

  const [sub, setSub]             = useState<Submission | null>(null);
  const [notes, setNotes]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [notFound, setNF]         = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("tna_admin");
    if (!isAdmin) { router.replace("/admin"); return; }
    const found = getSubmissionById(id);
    if (!found) { setNF(true); return; }
    setSub(found);
    setNotes(found.adminNotes ?? "");
    setEmailBody(generateEmailBody(found));
    setEmailSubject(`Your Training Needs Assessment Results — ${found.respondentName}`);
  }, [id, router]);

  // ── Actions ─────────────────────────────────────────────────────────────

  async function advance(newStatus: TStatus) {
    if (!sub) return;
    setSaving(true);
    const updated: Submission = { ...sub, status: newStatus, adminNotes: notes };
    saveSubmission(updated);
    await new Promise((r) => setTimeout(r, 600));
    setSub(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function saveNotes() {
    if (!sub) return;
    setSaving(true);
    const updated = { ...sub, adminNotes: notes };
    saveSubmission(updated);
    await new Promise((r) => setTimeout(r, 500));
    setSub(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function openMailto() {
    if (!sub) return;
    const mailto = `mailto:${sub.respondentEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailto, "_blank");
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0c1220] flex items-center justify-center flex-col gap-4">
        <AlertCircle className="w-10 h-10 text-[#60a5fa]" />
        <p className="text-white font-semibold">Submission not found.</p>
        <Link href="/admin/dashboard" className="text-sm text-slate-400 hover:text-white underline">Back to dashboard</Link>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="min-h-screen bg-[#0c1220] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-[#60a5fa] animate-spin" />
      </div>
    );
  }

  const currentStatusIdx = STATUS_FLOW.indexOf(sub.status as TStatus);
  const nextStatus = STATUS_FLOW[currentStatusIdx + 1] as TStatus | undefined;
  const cfg = STATUS_CONFIG[sub.status as TStatus];

  return (
    <div className="min-h-screen bg-[#0c1220] text-slate-100">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0c1220]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <Image
            src="/informatics-logo.png"
            alt="Informatics"
            width={90}
            height={24}
            className="h-6 w-auto object-contain brightness-0 invert opacity-60 hidden sm:block"
          />
          {/* Status badge */}
          {(() => { const HeaderIcon = cfg.icon; return (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            <HeaderIcon className="w-3 h-3" />
            {cfg.label}
          </span>
          ); })()}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── Status Stepper ─────────────────────────────────── */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            {STATUS_FLOW.map((s, i) => {
              const done     = i <= currentStatusIdx;
              const active   = i === currentStatusIdx;
              const scfg     = STATUS_CONFIG[s];
              const StepIcon = scfg.icon;
              return (
                <div key={s} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center text-center gap-1.5 flex-shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all"
                      style={{
                        borderColor: done ? scfg.color : "rgba(255,255,255,0.1)",
                        backgroundColor: done ? scfg.bg : "transparent",
                      }}
                    >
                      {done ? (
                        <StepIcon className="w-4 h-4" style={{ color: scfg.color }} />
                      ) : (
                        <span className="text-xs text-slate-600">{i + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${active ? "text-white" : done ? "text-slate-400" : "text-slate-600"}`}>
                      {scfg.label}
                    </span>
                  </div>
                  {i < STATUS_FLOW.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-2 rounded-full transition-all"
                      style={{ backgroundColor: i < currentStatusIdx ? STATUS_CONFIG[STATUS_FLOW[i]].color : "rgba(255,255,255,0.07)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column ──────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Respondent Info */}
            <div className="glass-card p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Respondent
              </h2>
              <div className="space-y-3.5">
                {[
                  { icon: User,      label: "Name",  value: sub.respondentName },
                  { icon: Mail,      label: "Email", value: sub.respondentEmail },
                  { icon: Building2, label: "Dept",  value: sub.department },
                  { icon: Briefcase, label: "Title", value: sub.jobTitle },
                  { icon: Calendar,  label: "Date",  value: formatDate(sub.submittedAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-500">{label}</span>
                      <p className="text-sm text-slate-200 font-medium mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="glass-card p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" /> Admin Notes
              </h2>
              <textarea
                id="admin-notes-textarea"
                rows={5}
                placeholder="Add internal notes, edit interpretations, or flag items for follow-up..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 resize-none transition-all"
              />
              <button
                id="btn-save-notes"
                onClick={saveNotes}
                disabled={saving}
                className="mt-2 w-full py-2 rounded-lg text-sm font-semibold border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                {saved ? "Saved!" : "Save Notes"}
              </button>
            </div>

            {/* Action Panel */}
            <div className="glass-card p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Actions</h2>
              <div className="space-y-2">
                {nextStatus && (() => {
                  const NextIcon = STATUS_CONFIG[nextStatus].icon;
                  return (
                    <button
                      id={`btn-advance-to-${nextStatus}`}
                      onClick={() => advance(nextStatus)}
                      disabled={saving}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      style={{ backgroundColor: STATUS_CONFIG[nextStatus].color }}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <NextIcon className="w-4 h-4" />
                          {nextStatus === "reviewed" && "Mark as Reviewed"}
                          {nextStatus === "approved" && "Approve Results"}
                          {nextStatus === "sent"     && "Mark as Sent"}
                        </>
                      )}
                    </button>
                  );
                })()}
                {sub.status === "sent" && (
                  <div className="flex items-center justify-center gap-2 py-3 text-sm text-green-400 bg-green-500/10 rounded-xl border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    Results have been sent to client
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Right Column ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Category Results */}
            {sub.results && sub.results.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#60a5fa]" />
                  Computed Results
                </h2>
                <p className="text-sm text-slate-500 mb-5">Auto-generated scores based on respondent&apos;s ratings.</p>

                <div className="space-y-5">
                  {sub.results.map((result: CategoryResult) => {
                    const barPct = (result.avgScore / 5) * 100;
                    const lColor = LEVEL_COLOR[result.level] ?? "#1d6eb5";
                    return (
                      <div key={result.category}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-200">{result.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-white">{result.avgScore}</span>
                            <span className="text-sm text-slate-500">/5</span>
                            <span
                              className="text-xs font-semibold px-2.5 py-0.5 rounded-full ml-1"
                              style={{ color: lColor, backgroundColor: lColor + "20", border: `1px solid ${lColor}40` }}
                            >
                              {result.level}
                            </span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bar-animate"
                            style={{ width: `${barPct}%`, backgroundColor: lColor }}
                          />
                        </div>
                        {result.recommendation && (
                          <p className="text-sm text-slate-500 mt-1.5">{result.recommendation}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Training Recommendations */}
            {sub.results && (
              <div className="glass-card p-6">
                <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#60a5fa]" />
                  Suggested Training Programs
                </h2>
                <p className="text-sm text-slate-500 mb-5">Based on areas scoring below Proficient.</p>
                <div className="space-y-4">
                  {sub.results
                    .filter((r) => !["Proficient","Strong"].includes(r.level))
                    .map((r) => (
                      <div key={r.category} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                        <p className="text-sm font-semibold mb-2" style={{ color: LEVEL_COLOR[r.level] }}>
                          {r.category} — {r.level}
                        </p>
                        <ul className="space-y-1.5">
                          {TRAINING_MAP[r.category as Category].map((prog) => (
                            <li key={prog} className="flex items-center gap-2 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] flex-shrink-0" />
                              {prog}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  {sub.results.every((r) => ["Proficient","Strong"].includes(r.level)) && (
                    <p className="text-sm text-green-400 text-center py-4">
                      Excellent performance across all categories. Advanced programs recommended.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Email Composer ────────────────────────────── */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#60a5fa]" />
                Send Results to Respondent
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                Compose the email to send to{" "}
                <span className="text-slate-300 font-medium">{sub.respondentEmail}</span>.
                Edit the message below, then click Send.
              </p>

              {/* Subject */}
              <div className="mb-3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Subject
                </label>
                <input
                  id="email-subject-input"
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 transition-all"
                />
              </div>

              {/* Body */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Message Body
                  </label>
                  <button
                    className="text-xs text-[#60a5fa] hover:text-white transition-colors flex items-center gap-1"
                    onClick={() => sub && setEmailBody(generateEmailBody(sub))}
                  >
                    <FileText className="w-3 h-3" />
                    Reset to template
                  </button>
                </div>
                <textarea
                  id="email-body-textarea"
                  rows={14}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm font-mono rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/40 resize-y transition-all leading-relaxed"
                />
              </div>

              {/* Send button */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${sub.respondentEmail}`}
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open blank email
                </a>
                <button
                  id="btn-send-email"
                  onClick={openMailto}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-[#1d6eb5] hover:bg-[#1a5fa0] text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  Send via Email Client
                </button>
              </div>

              <p className="text-xs text-slate-600 mt-3">
                This will open your default email client (e.g. Outlook) with the message pre-filled.
                After sending, click &quot;Mark as Sent&quot; in the Actions panel.
              </p>
            </div>

            {/* Raw Responses */}
            <div className="glass-card p-6">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#60a5fa]" />
                Raw Responses
              </h2>
              <p className="text-sm text-slate-500 mb-5">Individual question ratings as submitted.</p>
              <div className="space-y-6">
                {CATEGORIES.map((cat) => {
                  const qs = QUESTIONS.filter((q) => q.category === cat);
                  return (
                    <div key={cat}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{cat}</p>
                      <div className="space-y-2.5">
                        {qs.map((q, qi) => {
                          const resp   = sub.responses.find((r) => r.questionId === q.id);
                          const rating = resp?.rating ?? 0;
                          return (
                            <div key={q.id} className="flex items-center gap-3">
                              <span className="text-slate-600 w-5 flex-shrink-0 text-sm">{qi + 1}.</span>
                              <span className="flex-1 text-sm text-slate-300 leading-relaxed">{q.text}</span>
                              <div className="flex gap-0.5 flex-shrink-0">
                                {[1,2,3,4,5].map((v) => (
                                  <Star
                                    key={v}
                                    className={`w-4 h-4 ${v <= rating ? "text-amber-400 fill-current" : "text-slate-700"}`}
                                  />
                                ))}
                              </div>
                              <span className="w-20 text-right text-sm text-slate-500">{rating > 0 ? RATING_LABELS[rating] : "—"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
