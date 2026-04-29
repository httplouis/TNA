"use client";
import { Send, User, MapPin, Briefcase, Phone, Mail, CheckCircle2 } from "lucide-react";
import type { ParticipantInfo, OpenAnswers, Response } from "@/lib/tna-data";
import { SURVEY_SECTIONS, QUESTIONS } from "@/lib/tna-data";

interface Props {
  info: ParticipantInfo;
  responses: Record<string, Response>;
  openAnswers: OpenAnswers;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export default function ReviewStep({ info, responses, openAnswers, onBack, onSubmit, submitting }: Props) {
  const totalQs = QUESTIONS.length;
  const answered = Object.keys(responses).length;

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-[var(--text-base)] mb-2">Review & Submit</h2>
      <p className="text-[var(--text-muted)] text-sm mb-8">Please verify your information before submitting.</p>

      {/* Participant info summary */}
      <div className="glass-card p-5 mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 flex items-center gap-2">
          <User className="w-3.5 h-3.5" /> Participant Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { icon: User,    label: "Client Name",  val: info.clientName },
            { icon: MapPin,  label: "Address",       val: info.address },
            { icon: User,    label: "Trainee Name",  val: info.traineeName },
            { icon: Briefcase, label: "Job Title",   val: info.jobTitle },
            { icon: Phone,   label: "Mobile",        val: info.mobileNumber || "—" },
            { icon: Phone,   label: "Telephone",     val: info.telephoneNumber || "—" },
            { icon: Mail,    label: "Email",         val: info.email },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon className="w-3.5 h-3.5 text-slate-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[var(--text-muted)] text-xs">{label}</span>
                <p className="text-slate-200 font-medium mt-0.5 break-words">{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section completion */}
      <div className="glass-card p-5 mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">Survey Completion</h3>
        <div className="space-y-3">
          {SURVEY_SECTIONS.map((sec) => {
            const secQs = QUESTIONS.filter(q => sec.groups.some(g => g.category === q.category));
            const secAnswered = secQs.filter(q => responses[q.id]).length;
            const pct = secQs.length > 0 ? Math.round((secAnswered / secQs.length) * 100) : 0;
            return (
              <div key={sec.sectionNumber}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[var(--text-base)]">Section {sec.sectionNumber}: {sec.title}</span>
                  <span className="text-[var(--text-muted)]">{secAnswered}/{secQs.length}</span>
                </div>
                <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bar-animate bg-[#1d6eb5]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">Total Answered</span>
          <span className="font-bold text-[var(--text-base)]">{answered} / {totalQs}</span>
        </div>
      </div>

      {/* Open answers preview */}
      {(openAnswers.tasksPerformed || openAnswers.trainingGoals) && (
        <div className="glass-card p-5 mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Section 7 Responses</h3>
          {openAnswers.tasksPerformed && (
            <div className="mb-3">
              <p className="text-xs text-[var(--text-muted)] mb-1">Tasks performed:</p>
              <p className="text-sm text-[var(--text-base)]">{openAnswers.tasksPerformed}</p>
            </div>
          )}
          {openAnswers.trainingGoals && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Training goals:</p>
              <p className="text-sm text-[var(--text-base)]">{openAnswers.trainingGoals}</p>
            </div>
          )}
        </div>
      )}

      <div className="glass-card p-4 mb-6 border border-green-500/20 bg-green-500/5">
        <p className="text-xs text-green-400 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          By submitting, you confirm your consent to data collection as outlined in the Data Privacy Notice you accepted at the start of this assessment.
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] transition-all">
          Edit Answers
        </button>
        <button
          id="btn-submit-survey"
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
          ) : (
            <><Send className="w-4 h-4" /> Submit Assessment</>
          )}
        </button>
      </div>
    </div>
  );
}
