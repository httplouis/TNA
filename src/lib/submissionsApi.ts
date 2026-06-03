import type { Submission, SubmissionHistoryEntry } from "./tna-data";

export async function fetchSubmissions(): Promise<Submission[]> {
  try {
    const res = await fetch(`/api/submissions`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchSubmissionById(id: string): Promise<Submission | null> {
  try {
    const res = await fetch(`/api/submissions/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function postSubmissionToServer(sub: Submission): Promise<Submission | null> {
  try {
    const res = await fetch(`/api/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function patchSubmission(id: string, patch: Partial<Submission>): Promise<Submission | null> {
  try {
    const res = await fetch(`/api/submissions/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchSubmissionHistory(id: string): Promise<SubmissionHistoryEntry[]> {
  try {
    const res = await fetch(`/api/submissions/${encodeURIComponent(id)}/history`);
    if (!res.ok) return [];
    const raw = await res.json();
    return Array.isArray(raw)
      ? raw.map((entry: any) => ({
          id: entry.id,
          submissionId: entry.submission_id ?? entry.submissionId,
          eventType: entry.event_type ?? entry.eventType,
          eventDetails: entry.event_details ?? entry.eventDetails,
          createdAt: entry.created_at ?? entry.createdAt,
        }))
      : [];
  } catch {
    return [];
  }
}

export default { fetchSubmissions, fetchSubmissionById, postSubmissionToServer, patchSubmission, fetchSubmissionHistory };
