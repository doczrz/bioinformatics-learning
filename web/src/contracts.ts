export type Language = "zh" | "en";

export interface LessonSummary {
  id: string;
  order: number;
  number?: string;
  title: Record<Language, string>;
}

export interface CourseIndex {
  schemaVersion: 1;
  courseId: string;
  contentVersion: string;
  revision: number;
  defaultLanguage: Language;
  title: Record<Language, string>;
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
  sections: Array<{ id: string; heading: string }>;
}

export interface DatasetEntry {
  id: string;
  title: Record<Language, string>;
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
  summary: Record<Language, string>;
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
  summary?: Record<Language, string>;
}
