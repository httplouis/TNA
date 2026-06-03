const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean);
  env.forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (!(key in process.env)) process.env[key] = val;
    }
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Please set them in environment or .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const csvPath = path.join(__dirname, '..', 'public', 'tna_submissions_2026-05-20.csv');
if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found at', csvPath);
  process.exit(1);
}

function parseCSVRow(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) { result.push(cur); cur = ''; }
    else cur += ch;
  }
  result.push(cur);
  return result;
}

const csv = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
const headers = parseCSVRow(csv[0]);

const rows = csv.slice(1);

function idxOf(name) { return headers.findIndex(h => h.trim() === name); }

const submissions = [];
for (const line of rows) {
  try {
    const cols = parseCSVRow(line);
    const get = name => (cols[idxOf(name)] || '').trim();

    const results = headers.filter(h => h.endsWith(' (avg)')).map(h => {
      const cat = h.slice(0, -6);
      const avg = parseFloat(get(h)) || 0;
      const rawLevel = get(cat + ' (level)');
      const level = rawLevel === 'Advanced' ? 'Advanced' : rawLevel === 'Basic' ? 'Basic' : (avg <= 2.5 ? 'Advanced' : 'Basic');
      const color = level === 'Advanced' ? '#3b82f6' : '#f97316';
      const recommendation = level === 'Advanced' ? 'Advanced recommended' : 'Foundational recommended';
      return { category: cat, avgScore: avg, answeredCount: avg > 0 ? 1 : 0, level, color, recommendation };
    });

    const sub = {
      id: get('Submission ID') || `csv_${Math.random().toString(36).slice(2,8)}`,
      participantInfo: {
        clientName: get('Client Name'), address: get('Address'), traineeName: get('Trainee Name'), jobTitle: get('Job Title'),
        mobileNumber: get('Mobile Number'), telephoneNumber: get('Telephone Number'), email: get('Email'),
        rank: get('Rank'), ageBracket: get('Age Bracket'), positionClassification: get('Position Classification'),
      },
      responses: [],
      results,
      openAnswers: { tasksPerformed: get('Tasks Performed'), trainingGoals: get('Training Goals') },
      consentGiven: true,
      submittedAt: new Date(get('Submitted At') || new Date().toISOString()).toISOString(),
      status: (get('Status') || 'pending'),
      adminNotes: get('Admin Notes') || null,
    };
    submissions.push(sub);
  } catch (e) {
    // skip
  }
}

(async () => {
  console.log('Found', submissions.length, 'rows. Starting insert...');
  for (const s of submissions) {
    try {
      const { data, error } = await supabase.from('submissions').insert([s]).select().single();
      if (error) console.error('Insert error for', s.id, error.message || error);
      else console.log('Inserted', data.id || s.id);
    } catch (e) { console.error('Upsert error', e); }
  }
  console.log('Done.');
})();
