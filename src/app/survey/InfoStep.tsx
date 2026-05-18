"use client";
import { useState } from "react";
import { AlertCircle, User, Building2, Briefcase, Phone, Mail, MapPin, Users, Tag, Calendar, LayoutList } from "lucide-react";
import type { ParticipantInfo } from "@/lib/tna-data";

interface Props {
  info: ParticipantInfo;
  onChange: (info: ParticipantInfo) => void;
  errors: Partial<Record<keyof ParticipantInfo, string>>;
  onBack: () => void;
  onNext: () => void;
}

function Field({ id, label, icon: Icon, type = "text", placeholder, value, onChange, error, required }: {
  id: string; label: string; icon: React.ElementType; type?: string;
  placeholder: string; value: string; onChange: (v: string) => void;
  error?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-base)] mb-1.5" htmlFor={id}>
        <Icon className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-muted)]" />
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all ${error ? "border-red-500/60" : "border-[var(--border)] focus:border-[#1d6eb5]/40"}`}
      />
      {error && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function SelectField({ id, label, icon: Icon, options, value, onChange, error, required }: {
  id: string; label: string; icon: React.ElementType;
  options: string[]; value: string; onChange: (v: string) => void;
  error?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-base)] mb-1.5" htmlFor={id}>
        <Icon className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-muted)]" />
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        id={id} value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border text-sm text-[var(--text-base)] focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all appearance-none cursor-pointer ${error ? "border-red-500/60" : "border-[var(--border)] focus:border-[#1d6eb5]/40"}`}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

const AGE_BRACKETS = ["Below 25", "25–34", "35–44", "45–54", "55 and above"];
const POSITION_PRESETS = ["Technical", "Non-Technical", "Other (specify)"];

export default function InfoStep({ info, onChange, errors, onBack, onNext }: Props) {
  const [customPosition, setCustomPosition] = useState(
    POSITION_PRESETS.includes(info.positionClassification) || info.positionClassification === ""
      ? ""
      : info.positionClassification
  );
  const [positionChoice, setPositionChoice] = useState(
    info.positionClassification && !POSITION_PRESETS.slice(0, 2).includes(info.positionClassification)
      ? "Other (specify)"
      : info.positionClassification
  );

  const set = (k: keyof ParticipantInfo) => (v: string) => onChange({ ...info, [k]: v });

  function handlePositionChange(val: string) {
    setPositionChoice(val);
    if (val !== "Other (specify)") {
      onChange({ ...info, positionClassification: val });
    } else {
      onChange({ ...info, positionClassification: customPosition });
    }
  }

  function handleCustomPosition(val: string) {
    setCustomPosition(val);
    onChange({ ...info, positionClassification: val });
  }

  return (
    <div className="animate-fade-in-up max-w-xl mx-auto">
      <div className="mb-2">
        <span className="text-xs font-bold text-[#60a5fa] uppercase tracking-widest">Section 1 of 7</span>
      </div>
      <h2 className="text-2xl font-bold text-[var(--text-base)] mb-1">Informatics Corporate Training</h2>
      <p className="text-[var(--text-muted)] text-sm mb-8">Please provide your information below. Fields marked <span className="text-red-400">*</span> are required.</p>

      <div className="space-y-5">
        <Field id="input-client"    label="Client Name"       icon={Users}     placeholder="Name or company name"     value={info.clientName}      onChange={set("clientName")}      error={errors.clientName}      required />
        <div>
          <label className="block text-sm font-medium text-[var(--text-base)] mb-1.5" htmlFor="input-address">
            <MapPin className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-muted)]" />
            Address<span className="text-red-400 ml-1">*</span>
          </label>
          <textarea
            id="input-address" rows={3} placeholder="Street, City, Province, ZIP Code"
            value={info.address} onChange={e => onChange({ ...info, address: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all resize-none ${errors.address ? "border-red-500/60" : "border-[var(--border)] focus:border-[#1d6eb5]/40"}`}
          />
          {errors.address && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
        </div>
        <Field id="input-trainee"   label="Trainee Name"      icon={User}      placeholder="Full name of the trainee" value={info.traineeName}      onChange={set("traineeName")}      error={errors.traineeName}     required />
        <Field id="input-jobtitle"  label="Job Title"         icon={Briefcase} placeholder="e.g. Analyst, Coordinator" value={info.jobTitle}         onChange={set("jobTitle")}         error={errors.jobTitle}        required />
        <Field id="input-rank"      label="Rank"              icon={Tag}       placeholder="e.g. Senior Analyst, Division Manager" value={info.rank ?? ""}  onChange={set("rank")}   error={errors.rank}            required />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            id="input-age-bracket"
            label="Age Bracket"
            icon={Calendar}
            options={AGE_BRACKETS}
            value={info.ageBracket ?? ""}
            onChange={set("ageBracket")}
            error={errors.ageBracket}
            required
          />
          <div>
            <label className="block text-sm font-medium text-[var(--text-base)] mb-1.5" htmlFor="input-position">
              <LayoutList className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-muted)]" />
              Position Classification<span className="text-red-400 ml-1">*</span>
            </label>
            <select
              id="input-position"
              value={positionChoice}
              onChange={e => handlePositionChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border text-sm text-[var(--text-base)] focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all appearance-none cursor-pointer ${errors.positionClassification ? "border-red-500/60" : "border-[var(--border)] focus:border-[#1d6eb5]/40"}`}
            >
              <option value="">Select…</option>
              {POSITION_PRESETS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {positionChoice === "Other (specify)" && (
              <input
                id="input-position-custom"
                type="text"
                placeholder="Specify position classification"
                value={customPosition}
                onChange={e => handleCustomPosition(e.target.value)}
                className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm text-[var(--text-base)] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1d6eb5]/50 transition-all"
              />
            )}
            {errors.positionClassification && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.positionClassification}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field id="input-mobile"  label="Mobile Number"     icon={Phone}     placeholder="e.g. 09XX-XXX-XXXX"       value={info.mobileNumber}    onChange={set("mobileNumber")}     error={errors.mobileNumber} />
          <Field id="input-tel"     label="Telephone Number"  icon={Phone}     placeholder="e.g. (02) 8XXX-XXXX"      value={info.telephoneNumber} onChange={set("telephoneNumber")}  error={errors.telephoneNumber} />
        </div>
        <Field id="input-email"     label="Email Address"     icon={Mail}      type="email" placeholder="e.g. name@company.com" value={info.email}      onChange={set("email")}            error={errors.email}           required />
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="px-5 py-3 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-base)] hover:border-white/20 transition-all">Back</button>
        <button id="btn-info-next" onClick={onNext} className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-xl shadow-blue-900/30 transition-all hover:-translate-y-0.5">
          Start Assessment →
        </button>
      </div>
    </div>
  );
}
