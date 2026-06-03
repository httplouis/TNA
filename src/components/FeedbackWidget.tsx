"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { postFeedback } from "@/lib/feedbackApi";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end">
        {open && (
          <div className="mb-3 w-[340px] sm:w-80 glass-card p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Send feedback</h4>
              <button type="button" onClick={() => setOpen(false)} className="text-xs text-[var(--text-muted)]">Close</button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus("saving");
                const res = await postFeedback({ name: name || "Anonymous", email, message: msg });
                if (res) {
                  setStatus("success");
                  setMsg("");
                  setEmail("");
                } else {
                  setStatus("error");
                }
              }}
              className="space-y-2"
            >
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-[var(--bg-surface)]" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-[var(--bg-surface)]" />
              <textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Your suggestion or feedback" className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-[var(--bg-surface)] resize-none" />
              <div className="flex items-center justify-between">
                <div className="text-xs text-[var(--text-muted)]">{status === "success" ? "Thanks — sent" : status === "error" ? "Failed to send" : ""}</div>
                <button type="submit" disabled={status === "saving" || msg.trim().length === 0} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1d6eb5] text-white text-sm hover:bg-[#165eab] disabled:opacity-60">
                  {status === "saving" ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex flex-col items-end">
          <span className={`px-2.5 py-1 rounded-full text-xs text-white/95 mb-2 ${status === "success" ? "bg-green-500" : "bg-[#1d6eb5] animate-pulse"}`}>
            {status === "success" ? "Feedback sent" : "Send feedback"}
          </span>
          <button
            title="Send feedback"
            onClick={() => setOpen(o => !o)}
            className="w-12 h-12 rounded-full bg-[#1d6eb5] flex items-center justify-center text-white shadow-lg hover:bg-[#165eab] transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
