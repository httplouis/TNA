"use client";
import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ExternalLink } from "lucide-react";

interface Props { onAccept: () => void; }

export default function PrivacyStep({ onAccept }: Props) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="animate-fade-in-up max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#1d6eb5]/20 flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-7 h-7 text-[#60a5fa]" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--text-base)] text-center mb-2">Data Privacy Notice</h1>
      <p className="text-[var(--text-muted)] text-sm text-center mb-8">Before proceeding, please read and accept our data privacy notice.</p>

      <div className="glass-card p-6 mb-6 space-y-4 text-sm text-[var(--text-base)] max-h-72 overflow-y-auto">
        <p><strong className="text-[var(--text-base)]">Informatics Holdings Philippines</strong> collects your personal information solely for processing your Training Needs Assessment (TNA) results and providing personalized training recommendations.</p>
        <div>
          <p className="font-semibold text-[var(--text-base)] mb-2">Information we collect:</p>
          <ul className="space-y-1 list-none">
            {["Client / Company Name", "Address", "Trainee Name & Job Title", "Mobile & Telephone Number", "Email Address", "Assessment responses and self-ratings"].map(i => (
              <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 flex-shrink-0" />{i}</li>
            ))}
          </ul>
        </div>
        <p>Your data will <strong className="text-[var(--text-base)]">not</strong> be sold or shared with third parties for marketing purposes. It will be retained for up to <strong className="text-[var(--text-base)]">three (3) years</strong> in accordance with the Data Privacy Act of 2012 (RA 10173).</p>
        <p>You have the right to access, correct, or request deletion of your personal data at any time by contacting <strong className="text-[var(--text-base)]">privacy@informatics.com.ph</strong>.</p>
        <p className="text-[var(--text-muted)] text-xs">For the full privacy notice, click "View Full Notice" below.</p>
      </div>

      <Link href="/privacy" target="_blank"
        className="flex items-center justify-center gap-2 text-xs text-[#60a5fa] hover:text-[var(--text-base)] transition-colors mb-6">
        <ExternalLink className="w-3.5 h-3.5" />
        View Full Data Privacy Notice
      </Link>

      <label className="flex items-start gap-3 cursor-pointer mb-8 glass-card p-4 border border-[var(--border)] hover:border-[#1d6eb5]/40 transition-colors">
        <div className="relative mt-0.5 flex-shrink-0">
          <input type="checkbox" className="sr-only" checked={checked} onChange={e => setChecked(e.target.checked)} id="privacy-consent-checkbox" />
          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${checked ? "bg-[#1d6eb5] border-[#1d6eb5]" : "border-white/20 bg-[var(--bg-surface)]"}`}>
            {checked && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-base)]" />}
          </div>
        </div>
        <span className="text-sm text-[var(--text-base)] leading-relaxed">
          I have read and understood the Data Privacy Notice. I <strong className="text-[var(--text-base)]">voluntarily consent</strong> to the collection and processing of my personal data by Informatics Holdings Philippines for the purpose of this Training Needs Assessment.
        </span>
      </label>

      <button
        id="btn-accept-privacy"
        disabled={!checked}
        onClick={onAccept}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        Accept & Continue
      </button>
    </div>
  );
}
