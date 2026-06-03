import type { FeedbackEntry, FeedbackPayload } from "./tna-data";

export async function postFeedback(payload: FeedbackPayload): Promise<FeedbackEntry | null> {
  try {
    const res = await fetch(`/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchFeedback(): Promise<FeedbackEntry[]> {
  try {
    const res = await fetch(`/api/feedback`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default { postFeedback, fetchFeedback };
