import type {
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
} from "../contracts";

export interface ContentProvider {
  getCourse(): Promise<CourseIndex>;
  getLesson(lessonId: string, language: Language): Promise<LessonPayload>;
  getDatasets(language: Language): Promise<DatasetEntry[]>;
  resolveAssetUrl(path: string): string;
  refresh(): Promise<void>;
}
