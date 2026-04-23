// ── TNA Data — Informatics Corporate Training (Microsoft Excel) ───────────────
// Rating scale: 1 = Very experienced  →  5 = No experience at all

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

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
  clientName:      string; // name or company name
  address:         string; // free-form address
  traineeName:     string;
  jobTitle:        string;
  mobileNumber:    string;
  telephoneNumber: string;
  email:           string;
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

export interface CategoryResult {
  category:      Category;
  avgScore:      number;        // 1–5, lower = more experienced
  answeredCount: number;
  level:         "Expert" | "Proficient" | "Moderate" | "Developing" | "Needs Training";
  color:         string;
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

function getScoreLevel(avg: number): { level: CategoryResult["level"]; color: string; recommendation: string } {
  if (avg <= 1.9) return { level: "Expert",         color: "#3b82f6", recommendation: "Excellent proficiency. Consider advanced or leadership/train-the-trainer programs." };
  if (avg <= 2.9) return { level: "Proficient",     color: "#22c55e", recommendation: "Good competency. Advanced workshops or peer mentoring programs are recommended." };
  if (avg <= 3.4) return { level: "Moderate",       color: "#eab308", recommendation: "Moderate skill level. Refresher training and guided practice will help solidify skills." };
  if (avg <= 4.4) return { level: "Developing",     color: "#f97316", recommendation: "Developing skill. Structured coaching and skill-building workshops are recommended." };
  return            { level: "Needs Training",   color: "#ef4444", recommendation: "No or limited experience. Intensive foundational training is strongly recommended." };
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
    return { questionId: q.id, rating: Math.min(5, Math.max(1, baseSkill + variance)) };
  });
  
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 60) - 1);
  
  return {
    id: `dummy_${index}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    participantInfo: {
      clientName: DUMMY_CLIENTS[index % 5], address: "123 Business Rd",
      traineeName: DUMMY_NAMES[index % 5], jobTitle: DUMMY_TITLES[index % 5],
      mobileNumber: "09123456789", telephoneNumber: "123-4567",
      email: `${DUMMY_NAMES[index % 5].split(" ")[0].toLowerCase()}@example.com`, pdpaConsent: true,
    },
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
    if (parsed.length < 5) {
      const needed = 5 - parsed.length;
      const dummies = Array.from({ length: needed }).map((_, i) => generateDummySubmission(parsed.length + i));
      parsed = [...parsed, ...dummies];
      localStorage.setItem(STORE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch { return []; }
}

export function saveSubmission(sub: Submission): void {
  if (typeof window === "undefined") return;
  const existing = getSubmissions();
  const idx = existing.findIndex((s) => s.id === sub.id);
  if (idx >= 0) existing[idx] = sub; else existing.push(sub);
  localStorage.setItem(STORE_KEY, JSON.stringify(existing));
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

  const categoryHeaders = ALL_CATEGORIES.map((c) => escape(c + " (avg)")).join(",");
  const header = [
    "Submission ID", "Submitted At", "Status",
    "Client Name", "Address", "Trainee Name", "Job Title",
    "Mobile Number", "Telephone Number", "Email",
    ...ALL_CATEGORIES.map((c) => c + " (avg)"),
    ...ALL_CATEGORIES.map((c) => c + " (level)"),
    "Tasks Performed", "Training Goals", "Admin Notes",
  ].map(escape).join(",");

  const rows = submissions.map((sub) => {
    const results = sub.results ?? computeResults(sub.responses);
    const avgs    = ALL_CATEGORIES.map((cat) => results.find((r) => r.category === cat)?.avgScore ?? "");
    const levels  = ALL_CATEGORIES.map((cat) => results.find((r) => r.category === cat)?.level ?? "");
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

export const TRAINING_MAP: Record<Category, string[]> = {
  "Worksheet & Workbook Management":  ["Excel Essentials: Worksheet Management", "Spreadsheet Productivity Workshop"],
  "Working with Graphic Objects":     ["Excel Graphics & Visual Tools Training"],
  "Working with Charts":              ["Data Visualization with Excel Charts"],
  "Working with Excel Databases":     ["Excel Database Management Workshop", "List & Subtotal Techniques"],
  "Working with Advanced Functions":  ["Advanced Excel Formulas & Functions", "Excel Power User Bootcamp"],
  "Linking Data":                     ["Excel Data Linking & Integration"],
  "Proofing and Security":            ["Excel Data Validation & Security Workshop"],
  "Organizing Table Data":            ["Excel Sorting, Filtering & Table Management"],
  "Analyzing Data":                   ["Excel Data Analysis Tools", "PivotTable & PivotChart Mastery"],
  "Working with Multiple Workbooks":  ["Multi-Workbook Management in Excel"],
  "Importing and Exporting Data":     ["Excel Data Import & Export Techniques"],
  "Basic Macros":                     ["Introduction to Excel Macros & Automation"],
};

// ── Level rating descriptions (inverted scale) ────────────────────────────────

export const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "Very experienced, often help others.",
  2: "Experienced, rarely need to ask for help from others.",
  3: "Moderately experienced, sometimes need to ask for help from others.",
  4: "Inexperienced, often need to ask for help from others.",
  5: "No experience at all.",
};
