"use client";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import type { OpenAnswers } from "@/lib/tna-data";

interface Props {
  answers: OpenAnswers;
  onChange: (a: OpenAnswers) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Section7Step({ answers, onChange, onBack, onNext }: Props) {
  return (
    <div className="animate-fade-in-up max-w-xl mx-auto">
      <div className="mb-2">
        <span className="text-xs font-bold text-[#60a5fa] uppercase tracking-widest">Section 7 of 7</span>
      </div>
      <h2 className="text-xl font-bold text-[var(--text-base)] mb-1">Description</h2>
      <p className="text-[var(--text-muted)] text-sm mb-8">These fields are optional. Your answers help us tailor the training recommendations.</p>

      <div className="space-y-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#60a5fa]" />
            <label className="text-sm font-semibold text-[var(--text-base)]" htmlFor="tasks-performed">
              What specific tasks do you perform using Microsoft Excel?
              <span className="text-[var(--text-muted)] text-xs font-normal ml-2">(optional)</span>
            </label>
          </div>
          <textarea
            id="tasks-performed"
            rows={5}
            placeholder="Describe the Excel tasks you regularly perform in your role..."
            value={answers.tasksPerformed}
            onChange={e => onChange({ ...answers, tasksPerformed: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all resize-none focus:border-[#1d6eb5]/40"
          />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#60a5fa]" />
            <label className="text-sm font-semibold text-[var(--text-base)]" htmlFor="training-goals">
              Of these tasks, which would you like to carry out effectively after the training?
              <span className="text-[var(--text-muted)] text-xs font-normal ml-2">(optional)</span>
            </label>
          </div>
          <textarea
            id="training-goals"
            rows={5}
            placeholder="Describe what you hope to accomplish after completing the training..."
            value={answers.trainingGoals}
            onChange={e => onChange({ ...answers, trainingGoals: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all resize-none focus:border-[#1d6eb5]/40"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] transition-all">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          id="btn-section7-next"
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5"
        >
          Review & Submit <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
