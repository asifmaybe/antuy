/**
 * Bengali translations for routine-specific content:
 * days, subject names, and teacher names.
 */
import type { Language } from "./i18n";

// ── Day translations ──────────────────────────────────
const dayTranslations: Record<string, string> = {
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
  Saturday: "শনিবার",
};

export function translateDay(day: string, lang: Language): string {
  if (lang === "bn") return dayTranslations[day] ?? day;
  return day;
}

// ── Subject translations ──────────────────────────────
// Maps English subject names (without code) to Bengali
const subjectTranslations: Record<string, string> = {
  "Generation of Electrical Power": "তড়িৎ শক্তি উৎপাদন",
  "Principle of Marketing": "বিপণন নীতিমালা",
  "Industrial Management": "শিল্প ব্যবস্থাপনা",
  "Elec. & Electronic Measurement-I": "তড়িৎ ও ইলেকট্রনিক পরিমাপ-১",
  "Testing & Maintenance of Elec. Equip.": "তড়িৎ যন্ত্রপাতি পরীক্ষণ ও রক্ষণাবেক্ষণ",
  "Electrical Engineering Project-II": "তড়িৎ প্রকৌশল প্রকল্প-২",
  "Microprocessor & Microcontroller": "মাইক্রোপ্রসেসর ও মাইক্রোকন্ট্রোলার",
};

/**
 * Translates a subject string like "Generation of Electrical Power (26751)"
 * into Bengali while preserving the code number.
 */
export function translateSubject(subject: string, lang: Language): string {
  if (lang !== "bn") return subject;

  // Extract name and code: "Subject Name (12345)" → name="Subject Name", code="12345"
  const match = subject.match(/^(.*?)\s*\((\d+)\)\s*$/);
  if (match) {
    const [, name, code] = match;
    const bnName = subjectTranslations[name.trim()] ?? name.trim();
    return `${bnName} (${code})`;
  }

  // No code in the subject string
  return subjectTranslations[subject.trim()] ?? subject;
}

// ── Teacher name translations ─────────────────────────
const teacherTranslations: Record<string, string> = {
  "Md. Mosharrof Hosen": "মো. মোশাররফ হোসেন",
  "Emdadul Hoque": "এমদাদুল হক",
  "Md. EmaratHossain": "মো. ইমারত হোসেন",
  "Razaul Karim": "রাজাউল করিম",
  "Rakibul Islam": "রাকিবুল ইসলাম",
};

export function translateTeacher(teacher: string, lang: Language): string {
  if (lang === "bn") return teacherTranslations[teacher] ?? teacher;
  return teacher;
}
