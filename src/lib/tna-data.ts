// ── TNA Data Types ─────────────────────────────────────────────────────────────

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type Category =
  | "Communication Skills"
  | "Technical Skills"
  | "Leadership & Management"
  | "Problem Solving"
  | "Teamwork & Collaboration"
  | "Customer Service";

export interface Question {
  id: string;
  text: string;
  category: Category;
}

export interface Response {
  questionId: string;
  rating: SkillLevel;
  openAnswer?: string;
}

export interface Submission {
  id: string;
  respondentName: string;
  respondentEmail: string;
  department: string;
  jobTitle: string;
  responses: Response[];
  submittedAt: string;
  status: "pending" | "reviewed" | "approved" | "sent";
  adminNotes?: string;
  results?: CategoryResult[];
}

export interface CategoryResult {
  category: Category;
  avgScore: number;
  level: "Needs Improvement" | "Developing" | "Satisfactory" | "Proficient" | "Strong";
  color: string;
  recommendation?: string;
}

// ── Survey Questions ──────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  // Communication Skills
  { id: "q1",  text: "I can clearly express my ideas verbally to colleagues and clients.",              category: "Communication Skills" },
  { id: "q2",  text: "I can write professional emails, reports, and documents effectively.",            category: "Communication Skills" },
  { id: "q3",  text: "I actively listen during meetings and discussions.",                              category: "Communication Skills" },

  // Technical Skills
  { id: "q4",  text: "I am proficient in the software and tools required for my role.",                category: "Technical Skills" },
  { id: "q5",  text: "I can quickly learn and adapt to new technologies introduced in the workplace.", category: "Technical Skills" },
  { id: "q6",  text: "I can troubleshoot basic technical issues independently.",                        category: "Technical Skills" },

  // Leadership & Management
  { id: "q7",  text: "I can plan, organize, and prioritize tasks effectively.",                        category: "Leadership & Management" },
  { id: "q8",  text: "I can lead or guide a team toward a common goal.",                               category: "Leadership & Management" },
  { id: "q9",  text: "I handle conflict and difficult situations in a professional manner.",            category: "Leadership & Management" },

  // Problem Solving
  { id: "q10", text: "I can identify problems quickly and propose practical solutions.",                category: "Problem Solving" },
  { id: "q11", text: "I gather data and evaluate options before making decisions.",                     category: "Problem Solving" },
  { id: "q12", text: "I remain calm and effective when facing unexpected challenges.",                  category: "Problem Solving" },

  // Teamwork & Collaboration
  { id: "q13", text: "I actively contribute to team projects and group efforts.",                       category: "Teamwork & Collaboration" },
  { id: "q14", text: "I respect diverse perspectives and work well with different personalities.",      category: "Teamwork & Collaboration" },
  { id: "q15", text: "I share knowledge and support my teammates when needed.",                         category: "Teamwork & Collaboration" },

  // Customer Service
  { id: "q16", text: "I maintain a professional and positive attitude when interacting with clients.",  category: "Customer Service" },
  { id: "q17", text: "I handle client complaints calmly and resolve issues efficiently.",              category: "Customer Service" },
  { id: "q18", text: "I follow up on client concerns and ensure their satisfaction.",                  category: "Customer Service" },
];

export const CATEGORIES: Category[] = [
  "Communication Skills",
  "Technical Skills",
  "Leadership & Management",
  "Problem Solving",
  "Teamwork & Collaboration",
  "Customer Service",
];

// ── Score computation ─────────────────────────────────────────────────────────

const SCORE_CONFIG: Record<string, { level: CategoryResult["level"]; color: string; recommendation: string }> = {
  "1.0-1.9": {
    level: "Needs Improvement",
    color: "#ef4444",
    recommendation: "Intensive foundational training is highly recommended.",
  },
  "2.0-2.9": {
    level: "Developing",
    color: "#f97316",
    recommendation: "Structured coaching and skill-building workshops are recommended.",
  },
  "3.0-3.4": {
    level: "Satisfactory",
    color: "#eab308",
    recommendation: "Refresher training and guided practice will help solidify skills.",
  },
  "3.5-4.4": {
    level: "Proficient",
    color: "#22c55e",
    recommendation: "Advanced workshops or mentorship programs are recommended.",
  },
  "4.5-5.0": {
    level: "Strong",
    color: "#3b82f6",
    recommendation: "Consider leadership or train-the-trainer programs.",
  },
};

function getScoreConfig(avg: number) {
  if (avg < 2.0) return SCORE_CONFIG["1.0-1.9"];
  if (avg < 3.0) return SCORE_CONFIG["2.0-2.9"];
  if (avg < 3.5) return SCORE_CONFIG["3.0-3.4"];
  if (avg < 4.5) return SCORE_CONFIG["3.5-4.4"];
  return SCORE_CONFIG["4.5-5.0"];
}

export function computeResults(responses: Response[]): CategoryResult[] {
  return CATEGORIES.map((cat) => {
    const catQuestions = QUESTIONS.filter((q) => q.category === cat);
    const catResponses = responses.filter((r) =>
      catQuestions.some((q) => q.id === r.questionId)
    );
    const avg =
      catResponses.length > 0
        ? catResponses.reduce((sum, r) => sum + r.rating, 0) / catResponses.length
        : 0;
    const config = getScoreConfig(avg);
    return {
      category: cat,
      avgScore: Math.round(avg * 10) / 10,
      ...config,
    };
  });
}

// ── Local storage helpers ─────────────────────────────────────────────────────

const STORE_KEY = "tna_submissions";

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(sub: Submission): void {
  if (typeof window === "undefined") return;
  const existing = getSubmissions();
  const idx = existing.findIndex((s) => s.id === sub.id);
  if (idx >= 0) {
    existing[idx] = sub;
  } else {
    existing.push(sub);
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(existing));
}

export function getSubmissionById(id: string): Submission | undefined {
  return getSubmissions().find((s) => s.id === id);
}

export function generateId(): string {
  return `tna_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Training Recommendations Map ──────────────────────────────────────────────

export const TRAINING_MAP: Record<Category, string[]> = {
  "Communication Skills":       ["Business Communication Workshop", "Effective Presentation Skills", "Technical Writing Seminar"],
  "Technical Skills":           ["MS Office Proficiency Training", "Digital Tools Bootcamp", "Software Upskilling Program"],
  "Leadership & Management":    ["Leadership Foundations Program", "People Management Workshop", "Strategic Thinking Seminar"],
  "Problem Solving":            ["Critical Thinking & Decision Making", "Design Thinking Workshop", "Root Cause Analysis Training"],
  "Teamwork & Collaboration":   ["Team Dynamics Workshop", "Cross-functional Collaboration Training", "Conflict Resolution Seminar"],
  "Customer Service":           ["Customer Experience Excellence", "Client Handling & De-escalation", "Service Quality Improvement"],
};
