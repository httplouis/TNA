import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Data Privacy Notice — TNA Portal",
  description: "How Informatics Holdings Philippines collects and uses your personal data for the Training Needs Assessment.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-base)]">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-page)]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Image src="/informatics-logo.png" alt="Informatics Holdings Philippines" width={100} height={26} className="h-6 w-auto object-contain" />
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#1d6eb5]/20 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6 text-[#60a5fa]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-base)] mb-2">Data Privacy Notice</h1>
          <p className="text-[var(--text-muted)] text-sm">Effective Date: January 1, 2025 · Informatics Holdings Philippines</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-[var(--text-base)]">

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">1. Overview</h2>
            <p>
              Informatics Holdings Philippines (<strong className="text-[var(--text-base)]">"Informatics," "we," "our," or "us"</strong>) is
              committed to protecting your personal data in accordance with the <strong className="text-[var(--text-base)]">Data Privacy Act of
              2012 (Republic Act No. 10173)</strong> and its Implementing Rules and Regulations. This notice explains how we
              collect, use, store, and protect the personal information you provide when completing the Training Needs
              Assessment (TNA) survey.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">2. Personal Information We Collect</h2>
            <p className="mb-3">When you complete this survey, we collect the following information:</p>
            <ul className="space-y-2 list-none">
              {[
                "Client / Company Name",
                "Address",
                "Trainee Name",
                "Job Title / Designation",
                "Mobile Number",
                "Telephone Number",
                "Email Address",
                "Assessment responses and self-ratings",
                "Open-ended descriptions of tasks and training goals",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">3. Purpose of Data Collection</h2>
            <p className="mb-3">Your personal information is collected solely for the following purposes:</p>
            <ul className="space-y-2 list-none">
              {[
                "To process and analyze your Training Needs Assessment responses",
                "To generate personalized training recommendations aligned with your skill levels",
                "To communicate assessment results and recommended training programs to you",
                "To improve our training programs and assessment processes",
                "To maintain records for administrative and reporting purposes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">4. Legal Basis for Processing</h2>
            <p>
              We process your personal data based on your <strong className="text-[var(--text-base)]">voluntary and informed consent</strong>,
              which you provide by accepting this notice before proceeding with the assessment. You have the right to withdraw
              your consent at any time by contacting us at the details provided below. Withdrawal of consent does not affect
              the lawfulness of processing carried out before the withdrawal.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">5. Data Sharing and Disclosure</h2>
            <p className="mb-3">
              Your personal data will <strong className="text-[var(--text-base)]">not</strong> be sold, rented, or shared with third parties
              for marketing purposes. We may share your information only in the following circumstances:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "With authorized Informatics staff involved in processing your TNA results",
                "With training coordinators who will facilitate your recommended programs",
                "When required by law, regulation, or court order",
                "With your explicit written consent for other purposes",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">6. Data Retention</h2>
            <p>
              We retain your personal data for a period of <strong className="text-[var(--text-base)]">three (3) years</strong> from the date
              of submission, or for as long as necessary for the fulfillment of the stated purposes and compliance with legal
              obligations. After this period, your data will be securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized
              access, alteration, disclosure, or destruction. Access to assessment data is restricted to authorized personnel
              only and is protected by authentication controls.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">8. Your Rights as a Data Subject</h2>
            <p className="mb-3">Under the Data Privacy Act of 2012, you have the right to:</p>
            <ul className="space-y-2 list-none">
              {[
                "Be informed of how your personal data is processed",
                "Access your personal data held by us",
                "Correct any inaccurate or outdated personal data",
                "Request erasure or blocking of your personal data under certain conditions",
                "Object to the processing of your personal data",
                "Data portability — receive your data in a structured, commonly used format",
                "Lodge a complaint with the National Privacy Commission (NPC)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">9. Contact Information</h2>
            <p className="mb-4">
              For questions, concerns, or to exercise your data privacy rights, please contact our Data Protection Officer:
            </p>
            <div className="glass-card p-5 space-y-3">
              <p className="font-semibold text-[var(--text-base)]">Informatics Holdings Philippines</p>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#60a5fa] mt-0.5 flex-shrink-0" />
                <span>Informatics Philippines Building, Quezon City, Metro Manila, Philippines</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#60a5fa] flex-shrink-0" />
                <span>(02) 8XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#60a5fa] flex-shrink-0" />
                <span>privacy@informatics.com.ph</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-[var(--text-base)] mb-3">10. Changes to This Notice</h2>
            <p>
              We reserve the right to update this Data Privacy Notice at any time. Any changes will be communicated through
              our official channels. We encourage you to review this notice periodically.
            </p>
          </section>

        </div>

        <div className="mt-10 pt-8 border-t border-[var(--border)] text-center">
          <Link
            href="/survey"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#1d6eb5] hover:bg-[#1a5fa0] text-[var(--text-base)] shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5"
          >
            Return to Assessment
          </Link>
          <p className="text-xs text-slate-600 mt-4">
            Informatics Holdings Philippines · TNA Portal · Data Privacy Notice v1.0
          </p>
        </div>
      </main>
    </div>
  );
}
