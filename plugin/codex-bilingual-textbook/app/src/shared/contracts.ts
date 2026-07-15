export type Language = "zh" | "en";

export interface LessonSummary {
  id: string;
  order: number;
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
  environments: Array<{
    id: "local-r" | "ssh-hpc";
    status: "reserved";
  }>;
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

export interface ContentStore {
  getCourse(): Promise<CourseIndex>;
  getLesson(
    lessonId: string,
    language: Language,
  ): Promise<LessonPayload>;
  getDatasets(language: Language): Promise<DatasetEntry[]>;
}
