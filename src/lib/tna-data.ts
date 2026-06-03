// ── TNA Data — Informatics Corporate Training (Microsoft Excel) ───────────────
// Rating scale: 1 = Very experienced  →  5 = No experience at all

export type SkillLevel = 1 | 2 | 3 | 4 | 5;
export type TnaLevel = "Basic" | "Advanced";

export type Category =
  | "Worksheet & Workbook Management"
  | "Working with Graphic Objects"
  | "Working with Charts"
  | "Working with Excel Databases"
  | "Working with Advanced Functions"
  | "Linking Data"
  | "Proofing and Security"
  | "Organizing Table Data"
  | "Analyzing Data"
  | "Working with Multiple Workbooks"
  | "Importing and Exporting Data"
  | "Basic Macros";

export interface Question {
  id:         string;
  text:       string;
  category:   Category;
  isSummary?: boolean; // "Overall competence" items
}

export interface Response {
  questionId:    string;
  rating:        SkillLevel;
  wantsToLearn?: string; // shown when rating 1 or 2
}

export interface ParticipantInfo {
  clientName:              string; // name or company name
  address:                 string; // free-form address
  traineeName:             string;
  jobTitle:                string;
  mobileNumber:            string;
  telephoneNumber:         string;
  email:                   string;
  rank:                    string; // e.g. Senior Analyst, Manager
  ageBracket:              string; // e.g. 25–34
  positionClassification:  string; // Technical, Non-Technical, or custom
}

export interface OpenAnswers {
  tasksPerformed: string;
  trainingGoals:  string;
}

export interface Submission {
  id:              string;
  participantInfo: ParticipantInfo;
  responses:       Response[];
  openAnswers:     OpenAnswers;
  consentGiven:    boolean;
  submittedAt:     string;
  status:          "pending" | "reviewed" | "approved" | "sent";
  adminNotes?:     string;
  results?:        CategoryResult[];
}

export interface SubmissionHistoryEntry {
  id:            string;
  submissionId:  string;
  eventType:     string;
  eventDetails?: Record<string, unknown>;
  createdAt:     string;
}

export interface FeedbackPayload {
  name:    string;
  email?:  string;
  message: string;
}

export interface FeedbackEntry {
  id:        string;
  name:      string;
  email?:    string;
  message:   string;
  createdAt: string;
}

export interface CategoryResult {
  category:       Category;
  avgScore:       number;   // 1–5, lower = more experienced
  answeredCount:  number;
  level:          TnaLevel; // "Advanced" | "Basic"
  color:          string;
  recommendation: string;
}

// ── Survey section structure ──────────────────────────────────────────────────

export interface SectionGroup {
  title:    string;
  category: Category;
}

export interface SurveySection {
  sectionNumber: number;
  title:         string;
  groups:        SectionGroup[];
}

export const SURVEY_SECTIONS: SurveySection[] = [
  {
    sectionNumber: 2,
    title: "Worksheet And Workbook Management",
    groups: [
      { title: "Worksheet And Workbook Management", category: "Worksheet & Workbook Management" },
    ],
  },
  {
    sectionNumber: 3,
    title: "Graphic Objects & Charts",
    groups: [
      { title: "Working with Graphic Objects", category: "Working with Graphic Objects" },
      { title: "Working with Charts",          category: "Working with Charts" },
    ],
  },
  {
    sectionNumber: 4,
    title: "Databases, Functions & Linking",
    groups: [
      { title: "Working with Excel Databases",      category: "Working with Excel Databases" },
      { title: "Working with Advanced Functions",   category: "Working with Advanced Functions" },
      { title: "Linking Data",                      category: "Linking Data" },
    ],
  },
  {
    sectionNumber: 5,
    title: "Proofing, Organizing & Analyzing",
    groups: [
      { title: "Proofing and Security",    category: "Proofing and Security" },
      { title: "Organizing Table Data",    category: "Organizing Table Data" },
      { title: "Analyzing Data",           category: "Analyzing Data" },
    ],
  },
  {
    sectionNumber: 6,
    title: "Workbooks, Import/Export & Macros",
    groups: [
      { title: "Working with Multiple Workbooks", category: "Working with Multiple Workbooks" },
      { title: "Importing and Exporting Data",    category: "Importing and Exporting Data" },
      { title: "Basic Macros",                    category: "Basic Macros" },
    ],
  },
];

export const ALL_CATEGORIES: Category[] = SURVEY_SECTIONS.flatMap((s) =>
  s.groups.map((g) => g.category)
);

// ── Questions ─────────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  // ── Section 2: Worksheet & Workbook Management ────────────────────────────
  { id: "q_s2_01", text: "Working with Worksheets",                            category: "Worksheet & Workbook Management" },
  { id: "q_s2_02", text: "Renaming Worksheets",                                category: "Worksheet & Workbook Management" },
  { id: "q_s2_03", text: "Deleting And Inserting Worksheets",                  category: "Worksheet & Workbook Management" },
  { id: "q_s2_04", text: "Finding Files",                                      category: "Worksheet & Workbook Management" },
  { id: "q_s2_05", text: "Displaying Other Toolbars",                          category: "Worksheet & Workbook Management" },
  { id: "q_s2_06", text: "Customizing The Look Of The Toolbars And Menus",     category: "Worksheet & Workbook Management" },
  { id: "q_s2_07", text: "Freeze Panes",                                       category: "Worksheet & Workbook Management" },
  { id: "q_s2_08", text: "Grouping And Ungrouping Worksheets",                 category: "Worksheet & Workbook Management" },
  { id: "q_s2_09", text: "The Series Command",                                 category: "Worksheet & Workbook Management" },
  { id: "q_s2_10", text: "Changing The Appearance Of A Spreadsheet",          category: "Worksheet & Workbook Management" },
  { id: "q_s2_11", text: "Creating Colored Worksheet Tabs",                    category: "Worksheet & Workbook Management" },
  { id: "q_s2_12", text: "Overall competence in worksheet and workbook management", category: "Worksheet & Workbook Management", isSummary: true },

  // ── Section 3: Working with Graphic Objects ───────────────────────────────
  { id: "q_s3g1_1", text: "Inserting Clip Art",                               category: "Working with Graphic Objects" },
  { id: "q_s3g1_2", text: "Inserting Pictures",                               category: "Working with Graphic Objects" },
  { id: "q_s3g1_3", text: "Resizing Graphic Images",                          category: "Working with Graphic Objects" },
  { id: "q_s3g1_4", text: "Overall competence in working with graphic objects", category: "Working with Graphic Objects", isSummary: true },

  // ── Section 3: Working with Charts ───────────────────────────────────────
  { id: "q_s3g2_1", text: "Creating a Chart",                                 category: "Working with Charts" },
  { id: "q_s3g2_2", text: "Changing the Chart Type",                          category: "Working with Charts" },
  { id: "q_s3g2_3", text: "Changing the Location of the Legend",              category: "Working with Charts" },
  { id: "q_s3g2_4", text: "Adding Data to a Chart",                           category: "Working with Charts" },
  { id: "q_s3g2_5", text: "Changing the Gridlines",                           category: "Working with Charts" },
  { id: "q_s3g2_6", text: "Overall competence in working with charts",        category: "Working with Charts", isSummary: true },

  // ── Section 4: Working with Excel Databases ───────────────────────────────
  { id: "q_s4g1_1", text: "Database Concepts",                                category: "Working with Excel Databases" },
  { id: "q_s4g1_2", text: "Parts of a Database",                              category: "Working with Excel Databases" },
  { id: "q_s4g1_3", text: "Entering Database Information",                    category: "Working with Excel Databases" },
  { id: "q_s4g1_4", text: "Managing the Database",                            category: "Working with Excel Databases" },
  { id: "q_s4g1_5", text: "Using Lists",                                      category: "Working with Excel Databases" },
  { id: "q_s4g1_6", text: "Inserting Automatic Subtotals",                    category: "Working with Excel Databases" },
  { id: "q_s4g1_7", text: "Overall competence in working with Excel databases", category: "Working with Excel Databases", isSummary: true },

  // ── Section 4: Working with Advanced Functions ────────────────────────────
  { id: "q_s4g2_1", text: "Conditional Functions",                            category: "Working with Advanced Functions" },
  { id: "q_s4g2_2", text: "Lookup Functions",                                 category: "Working with Advanced Functions" },
  { id: "q_s4g2_3", text: "Number Functions",                                 category: "Working with Advanced Functions" },
  { id: "q_s4g2_4", text: "Text Functions",                                   category: "Working with Advanced Functions" },
  { id: "q_s4g2_5", text: "Date and Time Functions",                          category: "Working with Advanced Functions" },
  { id: "q_s4g2_6", text: "Financial Functions",                              category: "Working with Advanced Functions" },
  { id: "q_s4g2_7", text: "Overall competence in working with advanced Excel functions", category: "Working with Advanced Functions", isSummary: true },

  // ── Section 4: Linking Data ───────────────────────────────────────────────
  { id: "q_s4g3_1", text: "Overall competence in linking Excel data",         category: "Linking Data", isSummary: true },

  // ── Section 5: Proofing and Security ─────────────────────────────────────
  { id: "q_s5g1_1", text: "Conditional Formatting",                           category: "Proofing and Security" },
  { id: "q_s5g1_2", text: "Data Validation",                                  category: "Proofing and Security" },
  { id: "q_s5g1_3", text: "Protecting Workbook and Worksheets",               category: "Proofing and Security" },
  { id: "q_s5g1_4", text: "Overall competence in proofing and securing excel data", category: "Proofing and Security", isSummary: true },

  // ── Section 5: Organizing Table Data ─────────────────────────────────────
  { id: "q_s5g2_1", text: "Advanced Sorting",                                 category: "Organizing Table Data" },
  { id: "q_s5g2_2", text: "Filtering",                                        category: "Organizing Table Data" },
  { id: "q_s5g2_3", text: "Overall competence in organizing table data",      category: "Organizing Table Data", isSummary: true },

  // ── Section 5: Analyzing Data ─────────────────────────────────────────────
  { id: "q_s5g3_1", text: "Create a Trendline",                               category: "Analyzing Data" },
  { id: "q_s5g3_2", text: "Create Scenarios",                                 category: "Analyzing Data" },
  { id: "q_s5g3_3", text: "Perform What-if Analysis",                         category: "Analyzing Data" },
  { id: "q_s5g3_4", text: "Using Analysis ToolPak",                           category: "Analyzing Data" },
  { id: "q_s5g3_5", text: "Create a PivotTable Report",                       category: "Analyzing Data" },
  { id: "q_s5g3_6", text: "Analyze Data Using PivotCharts",                   category: "Analyzing Data" },
  { id: "q_s5g3_7", text: "Overall competence in analyzing data",             category: "Analyzing Data", isSummary: true },

  // ── Section 6: Working with Multiple Workbooks ────────────────────────────
  { id: "q_s6g1_1", text: "Create a Workspace",                               category: "Working with Multiple Workbooks" },
  { id: "q_s6g1_2", text: "Consolidate Data",                                 category: "Working with Multiple Workbooks" },
  { id: "q_s6g1_3", text: "Link Cells in Different Workbooks",                category: "Working with Multiple Workbooks" },
  { id: "q_s6g1_4", text: "Edit Links",                                       category: "Working with Multiple Workbooks" },
  { id: "q_s6g1_5", text: "Overall competence in working with multiple workbooks", category: "Working with Multiple Workbooks", isSummary: true },

  // ── Section 6: Importing and Exporting Data ───────────────────────────────
  { id: "q_s6g2_1", text: "Export Excel Data",                                category: "Importing and Exporting Data" },
  { id: "q_s6g2_2", text: "Import a Delimited Text File",                     category: "Importing and Exporting Data" },
  { id: "q_s6g2_3", text: "Overall competence in importing and exporting data", category: "Importing and Exporting Data", isSummary: true },

  // ── Section 6: Basic Macros ───────────────────────────────────────────────
  { id: "q_s6g3_1", text: "Recording a Macro",                                category: "Basic Macros" },
  { id: "q_s6g3_2", text: "Customizing a Macro",                              category: "Basic Macros" },
  { id: "q_s6g3_3", text: "Using a Macro",                                    category: "Basic Macros" },
  { id: "q_s6g3_4", text: "Deleting a Macro",                                 category: "Basic Macros" },
  { id: "q_s6g3_5", text: "Overall competence in using basic macros",         category: "Basic Macros", isSummary: true },
];

// ── Score computation (inverted: lower avg = more experienced) ────────────────

// avg ≤ 2.5 = Advanced (more experienced), avg > 2.5 = Basic (needs training)
function getScoreLevel(avg: number): { level: TnaLevel; color: string; recommendation: string } {
  if (avg === 0) return { level: "Basic", color: "#f97316", recommendation: "No responses recorded. Foundational training is recommended." };
  if (avg <= 2.5) return {
    level: "Advanced",
    color: "#3b82f6",
    recommendation: "Good to strong proficiency. Advanced workshops or specialization programs are recommended.",
  };
  return {
    level: "Basic",
    color: "#f97316",
    recommendation: "Limited to moderate experience. Foundational training is strongly recommended.",
  };
}

/** Compute the respondent's overall Basic/Advanced level from all responses */
export function computeOverallLevel(responses: Response[], results?: CategoryResult[]): TnaLevel {
  if (responses && responses.length > 0) {
    const avg = responses.reduce((sum, r) => sum + r.rating, 0) / responses.length;
    return avg <= 2.5 ? "Advanced" : "Basic";
  }
  if (results && results.length > 0) {
    const answered = results.filter(r => r.answeredCount > 0);
    if (answered.length > 0) {
      const avg = answered.reduce((sum, r) => sum + r.avgScore, 0) / answered.length;
      return avg <= 2.5 ? "Advanced" : "Basic";
    }
  }
  return "Basic";
}

export function computeResults(responses: Response[]): CategoryResult[] {
  return ALL_CATEGORIES.map((cat) => {
    const catQs  = QUESTIONS.filter((q) => q.category === cat);
    const catRs  = responses.filter((r) => catQs.some((q) => q.id === r.questionId));
    const avg    = catRs.length > 0
      ? catRs.reduce((sum, r) => sum + r.rating, 0) / catRs.length
      : 0;
    const cfg = getScoreLevel(avg);
    return {
      category:      cat,
      avgScore:      Math.round(avg * 10) / 10,
      answeredCount: catRs.length,
      ...cfg,
    };
  });
}

// ── Local storage helpers ─────────────────────────────────────────────────────

const STORE_KEY = "tna_submissions_v2";

const DUMMY_NAMES = [ "John Doe", "Jane Smith", "Michael Johnson", "Emily Davis", "David Wilson" ];
const DUMMY_CLIENTS = [ "Acme Corp", "TechNova", "Global Industries", "Innovatech", "Stark Industries" ];
const DUMMY_TITLES = [ "Data Analyst", "Marketing Manager", "Financial Analyst", "HR Specialist", "Operations Lead" ];

function generateDummySubmission(index: number): Submission {
  const responses: Response[] = QUESTIONS.map(q => {
    const baseSkill = (index % 3) + 2; 
    const variance = Math.floor(Math.random() * 3) - 1; 
    return { questionId: q.id, rating: Math.min(5, Math.max(1, baseSkill + variance)) as SkillLevel };
  });
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 60) - 1);
  
  return {
    id: `dummy_${index}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    participantInfo: {
      clientName: DUMMY_CLIENTS[index % 5], address: "123 Business Rd",
      traineeName: DUMMY_NAMES[index % 5], jobTitle: DUMMY_TITLES[index % 5],
      mobileNumber: "09123456789", telephoneNumber: "123-4567",
      email: `${DUMMY_NAMES[index % 5].split(" ")[0].toLowerCase()}@example.com`,
      rank: ["Staff", "Senior Staff", "Supervisor", "Manager", "Director"][index % 5],
      ageBracket: ["25–34", "35–44", "45–54", "Below 25", "55 and above"][index % 5],
      positionClassification: index % 2 === 0 ? "Technical" : "Non-Technical",
    },
    consentGiven: true,
    responses, results: computeResults(responses),
    openAnswers: { tasksPerformed: "Various data entry and reporting.", trainingGoals: "Learn advanced formulas." },
    status: index === 0 ? "pending" : index % 2 === 0 ? "reviewed" : "approved",
    submittedAt: date.toISOString(),
    adminNotes: index === 1 ? "Needs training on Macros." : undefined,
  };
}

export function getSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    let parsed: Submission[] = raw ? JSON.parse(raw) : [];

    // Migrate stale records: recompute results if any category level is not Basic/Advanced
    let needsSave = false;
    parsed = parsed.map(sub => {
      const hasStaleResults = sub.results?.some(
        r => r.level !== "Basic" && r.level !== "Advanced"
      );
      if (hasStaleResults && sub.responses?.length > 0) {
        needsSave = true;
        return { ...sub, results: computeResults(sub.responses) };
      }
      return sub;
    });

    if (parsed.length < 5) {
      const needed = 5 - parsed.length;
      const dummies = Array.from({ length: needed }).map((_, i) => generateDummySubmission(parsed.length + i));
      parsed = [...parsed, ...dummies];
      needsSave = true;
    }

    if (needsSave) localStorage.setItem(STORE_KEY, JSON.stringify(parsed));
    return parsed;
  } catch { return []; }
}

export function saveSubmission(sub: Submission, sync = true): void {
  if (typeof window === "undefined") return;
  const existing = getSubmissions();
  const idx = existing.findIndex((s) => s.id === sub.id);
  if (idx >= 0) existing[idx] = sub; else existing.push(sub);
  localStorage.setItem(STORE_KEY, JSON.stringify(existing));
  if (sync) void syncToServer(sub);
}

// Attempt to sync a submission to the server API (fire-and-forget).
async function syncToServer(sub: Submission) {
  try {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
  } catch {
    // ignore network errors — localStorage remains the source of truth offline
  }
}

export function saveSubmissionToServer(sub: Submission): void {
  // wrapper to keep compatibility with existing synchronous callers
  void syncToServer(sub);
}

export function getSubmissionById(id: string): Submission | undefined {
  return getSubmissions().find((s) => s.id === id);
}

export function generateId(): string {
  return `tna_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── CSV Export ────────────────────────────────────────────────────────────────

export function exportToCSV(submissions: Submission[]): void {
  const escape = (v: string | number | undefined) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const header = [
    "Submission ID", "Submitted At", "Status",
    "Client Name", "Address", "Trainee Name", "Job Title",
    "Mobile Number", "Telephone Number", "Email",
    "Rank", "Age Bracket", "Position Classification",
    "Overall Level",
    ...ALL_CATEGORIES.map((c) => c + " (avg)"),
    ...ALL_CATEGORIES.map((c) => c + " (level)"),
    "Tasks Performed", "Training Goals", "Admin Notes",
  ].map(escape).join(",");

  const rows = submissions.map((sub) => {
    const results = sub.results ?? computeResults(sub.responses);
    const avgs    = ALL_CATEGORIES.map((cat) => results.find((r) => r.category === cat)?.avgScore ?? "");
    const levels  = ALL_CATEGORIES.map((cat) => results.find((r) => r.category === cat)?.level ?? "");
    const overall = computeOverallLevel(sub.responses, sub.results);
    return [
      sub.id,
      new Date(sub.submittedAt).toLocaleString("en-PH"),
      sub.status,
      sub.participantInfo.clientName,
      sub.participantInfo.address,
      sub.participantInfo.traineeName,
      sub.participantInfo.jobTitle,
      sub.participantInfo.mobileNumber,
      sub.participantInfo.telephoneNumber,
      sub.participantInfo.email,
      sub.participantInfo.rank ?? "",
      sub.participantInfo.ageBracket ?? "",
      sub.participantInfo.positionClassification ?? "",
      overall,
      ...avgs,
      ...levels,
      sub.openAnswers.tasksPerformed,
      sub.openAnswers.trainingGoals,
      sub.adminNotes ?? "",
    ].map(escape).join(",");
  });

  const csv  = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `tna_submissions_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Training recommendation map ───────────────────────────────────────────────

export const TRAINING_MAP: Record<Category, { basic: string[]; advanced: string[] }> = {
  "Worksheet & Workbook Management":  {
    basic:    ["Excel Essentials: Worksheet Management", "Spreadsheet Productivity Workshop"],
    advanced: ["Advanced Spreadsheet Techniques", "Excel Power User Bootcamp"],
  },
  "Working with Graphic Objects":     {
    basic:    ["Excel Graphics & Visual Tools — Foundation"],
    advanced: ["Excel Graphics & Visual Tools — Advanced"],
  },
  "Working with Charts":              {
    basic:    ["Data Visualization with Excel Charts — Foundation"],
    advanced: ["Advanced Charting & Dashboard Design in Excel"],
  },
  "Working with Excel Databases":     {
    basic:    ["Excel Database Management Workshop", "List & Subtotal Techniques"],
    advanced: ["Advanced Excel Database Techniques"],
  },
  "Working with Advanced Functions":  {
    basic:    ["Excel Functions Essentials"],
    advanced: ["Advanced Excel Formulas & Functions", "Excel Power User Bootcamp"],
  },
  "Linking Data":                     {
    basic:    ["Excel Data Linking — Foundation"],
    advanced: ["Excel Data Linking & Integration — Advanced"],
  },
  "Proofing and Security":            {
    basic:    ["Excel Data Validation & Security — Foundation"],
    advanced: ["Excel Data Validation & Security — Advanced"],
  },
  "Organizing Table Data":            {
    basic:    ["Excel Sorting, Filtering & Table Management — Foundation"],
    advanced: ["Advanced Table Organization & Power Query"],
  },
  "Analyzing Data":                   {
    basic:    ["Excel Data Analysis Tools — Foundation"],
    advanced: ["PivotTable & PivotChart Mastery", "Advanced Data Analysis with Excel"],
  },
  "Working with Multiple Workbooks":  {
    basic:    ["Multi-Workbook Management in Excel — Foundation"],
    advanced: ["Advanced Multi-Workbook Techniques"],
  },
  "Importing and Exporting Data":     {
    basic:    ["Excel Data Import & Export — Foundation"],
    advanced: ["Excel Data Import & Export — Advanced Techniques"],
  },
  "Basic Macros":                     {
    basic:    ["Introduction to Excel Macros & Automation"],
    advanced: ["Advanced Excel Macros & VBA"],
  },
};

// ── Level rating descriptions (inverted scale) ────────────────────────────────

export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "Very experienced, often help others.",
  2: "Experienced, rarely need to ask for help from others.",
  3: "Moderately experienced, sometimes need to ask for help from others.",
  4: "Inexperienced, often need to ask for help from others.",
  5: "No experience at all.",
};

// ── Analytics helpers ─────────────────────────────────────────────────────────

export type RatingLevel = 1 | 2 | 3 | 4 | 5;

/** Meta for the 2-level Basic/Advanced classification */
export const TNA_LEVEL_META: Record<TnaLevel, { label: string; color: string; description: string }> = {
  Advanced: {
    label: "Advanced",
    color: "#3b82f6",
    description: "Average score ≤ 2.5 — strong proficiency across assessed skills.",
  },
  Basic: {
    label: "Basic",
    color: "#f97316",
    description: "Average score > 2.5 — needs foundational or refresher training.",
  },
};

/** Count of submissions at each overall level (Basic / Advanced) */
export function getRatingDistribution(submissions: Submission[]): Record<TnaLevel, number> {
  const counts: Record<TnaLevel, number> = { Advanced: 0, Basic: 0 };
  submissions.forEach(s => {
    const level = computeOverallLevel(s.responses, s.results);
    counts[level]++;
  });
  return counts;
}

/** For a given overall level, returns trainees with their per-category breakdown */
export function getTraineesAtRatingLevel(
  submissions: Submission[],
  level: TnaLevel
): {
  trainee: string; client: string; id: string;
  overallAvg: number;
  categoryBreakdown: { category: string; level: TnaLevel; avgScore: number; recommendations: string[] }[];
}[] {
  return submissions
    .filter(s => computeOverallLevel(s.responses, s.results) === level)
    .map(sub => {
      const results = sub.results ?? computeResults(sub.responses);
      const overallAvg = sub.responses.length > 0
        ? Math.round((sub.responses.reduce((sum, r) => sum + r.rating, 0) / sub.responses.length) * 10) / 10
        : (results && results.length > 0
            ? Math.round((results.reduce((sum, r) => sum + r.avgScore, 0) / results.length) * 10) / 10
            : 0);
      const categoryBreakdown = results
        .filter(r => r.answeredCount > 0)
        .map(r => ({
          category: r.category,
          level: r.level,
          avgScore: r.avgScore,
          recommendations: TRAINING_MAP[r.category]?.[r.level === "Basic" ? "basic" : "advanced"] ?? [],
        }));
      return {
        trainee: sub.participantInfo.traineeName,
        client: sub.participantInfo.clientName,
        id: sub.id,
        overallAvg,
        categoryBreakdown,
      };
    });
}

/** Per category: how many submissions landed at Basic vs Advanced (based on avgScore) */
export function getCategoryLevelBreakdown(
  submissions: Submission[]
): Record<Category, Record<TnaLevel, number>> {
  const result = {} as Record<Category, Record<TnaLevel, number>>;
  ALL_CATEGORIES.forEach(cat => {
    result[cat] = { Advanced: 0, Basic: 0 };
  });
  submissions.forEach(sub => {
    const results = sub.results ?? computeResults(sub.responses);
    results.forEach(r => {
      if (r.answeredCount > 0 && result[r.category]) {
        result[r.category][r.level]++;
      }
    });
  });
  return result;
}

/** For a given category + TnaLevel, returns the trainee names */
export function getTraineesAtCategoryLevel(
  submissions: Submission[],
  category: Category,
  level: TnaLevel
): { trainee: string; client: string; id: string; avgScore: number }[] {
  return submissions.flatMap(sub => {
    const results = sub.results ?? computeResults(sub.responses);
    const catResult = results.find(r => r.category === category);
    if (!catResult || catResult.level !== level || catResult.answeredCount === 0) return [];
    return [{ trainee: sub.participantInfo.traineeName, client: sub.participantInfo.clientName, id: sub.id, avgScore: catResult.avgScore }];
  });
}

/** Get list of unique client/company segments */
export function getSegments(submissions: Submission[]): string[] {
  const segments = new Set<string>();
  submissions.forEach(s => segments.add(s.participantInfo.clientName));
  return ["All Segments", ...Array.from(segments).sort()];
}

/** Get unique position classifications */
export function getPositionClassifications(submissions: Submission[]): string[] {
  const set = new Set<string>();
  submissions.forEach(s => {
    if (s.participantInfo.positionClassification) set.add(s.participantInfo.positionClassification);
  });
  return ["All", ...Array.from(set).sort()];
}

/** Parse internally-exported CSV back into Submission[] (best-effort) */
export function parseCSVToSubmissions(csvText: string): Submission[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const parseCSVRow = (line: string): string[] => {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(cur); cur = "";
      } else {
        cur += ch;
      }
    }
    result.push(cur);
    return result;
  };

  const headers = parseCSVRow(lines[0]);
  const idxOf = (name: string) => headers.findIndex(h => h.trim() === name);

  const subs: Submission[] = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const cols = parseCSVRow(lines[i]);
      const get = (name: string) => cols[idxOf(name)]?.trim() ?? "";

      const responses: Response[] = [];
      const results: CategoryResult[] = ALL_CATEGORIES.map(cat => {
        const avg = parseFloat(get(cat + " (avg)")) || 0;
        const rawLevel = get(cat + " (level)");
        // Normalise: accept old 5-level labels or new Basic/Advanced
        const level: TnaLevel =
          rawLevel === "Advanced" ? "Advanced" :
          rawLevel === "Basic"    ? "Basic" :
          avg <= 2.5              ? "Advanced" : "Basic";
        const color = level === "Advanced" ? "#3b82f6" : "#f97316";
        const recommendation = level === "Advanced"
          ? "Good to strong proficiency. Advanced workshops recommended."
          : "Limited experience. Foundational training is recommended.";
        return { category: cat, avgScore: avg, answeredCount: avg > 0 ? 1 : 0, level, color, recommendation };
      });

      const sub: Submission = {
        id: get("Submission ID") || `csv_${i}`,
        participantInfo: {
          clientName: get("Client Name"),
          address: get("Address"),
          traineeName: get("Trainee Name"),
          jobTitle: get("Job Title"),
          mobileNumber: get("Mobile Number"),
          telephoneNumber: get("Telephone Number"),
          email: get("Email"),
          rank: get("Rank"),
          ageBracket: get("Age Bracket"),
          positionClassification: get("Position Classification"),
        },
        responses,
        results,
        openAnswers: { tasksPerformed: get("Tasks Performed"), trainingGoals: get("Training Goals") },
        consentGiven: true,
        submittedAt: new Date(get("Submitted At")).toISOString() || new Date().toISOString(),
        status: (get("Status") as Submission["status"]) || "pending",
        adminNotes: get("Admin Notes") || undefined,
      };
      subs.push(sub);
    } catch {
      // skip malformed rows
    }
  }
  return subs;
}
