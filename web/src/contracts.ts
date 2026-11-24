export const LANGUAGES = ["zh", "en", "nl", "fr", "es", "de"] as const;
export type Language = (typeof LANGUAGES)[number];
export type LocalizedText = Record<"zh" | "en", string> & Partial<Record<Language, string>>;

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((language) => language === value);
}

export interface LessonSummary {
  id: string;
  order: number;
  number?: string;
  title: LocalizedText;
}

export interface CourseIndex {
  schemaVersion: 1;
  courseId: string;
  contentVersion: string;
  revision: number;
  defaultLanguage: Language;
  languages?: readonly Language[];
  title: LocalizedText;
  lessons: LessonSummary[];
}

export interface LessonPayload {
  courseId: string;
  contentVersion: string;
  revision: number;
  lessonId: string;
  language: Language;
  translationAvailable: boolean;
  title: string;
  markdown: string;
  sections: Array<{ id: string; heading: string; line?: number; level?: number }>;
}

export interface DatasetEntry {
  id: string;
  title: LocalizedText;
  sourceUrl: string;
  sizeBytes?: number;
  license?: string;
  sha256?: string;
}

export interface SiteConfig {
  uiVersion: string;
  contentManifestUrl: string | null;
}

export interface ContentReleaseAsset {
  path: string;
  url: string;
  sizeBytes: number;
  sha256: string;
}

export interface ContentReleaseManifest {
  schemaVersion: 1;
  courseId: string;
  contentVersion: string;
  releaseTag: string;
  commitSha: string;
  minimumUiVersion: string;
  summary: LocalizedText;
  assets: ContentReleaseAsset[];
}

export interface UpdateCheckResult {
  configured: boolean;
  updateAvailable: boolean;
  currentVersion: string;
  targetVersion?: string;
  compatible?: boolean;
  minimumUiVersion?: string;
  downloadBytes?: number;
  summary?: LocalizedText;
}
