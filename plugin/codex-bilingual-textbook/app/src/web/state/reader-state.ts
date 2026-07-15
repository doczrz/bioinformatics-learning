import type { Language } from "../../shared/contracts";

export interface ReaderState {
  language: Language;
  lessonId: string | null;
  sidebarOpen: boolean;
  activeSectionId: string | null;
  progressByLesson: Record<string, number>;
}

export const defaultReaderState: ReaderState = {
  language: "zh",
  lessonId: null,
  sidebarOpen: false,
  activeSectionId: null,
  progressByLesson: {},
};
