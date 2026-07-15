import type { Language } from "../contracts";

export interface ReaderState {
  language: Language;
  lessonId: string | null;
  sidebarOpen: boolean;
  activeSectionId: string | null;
  progressByLesson: Record<string, number>;
}

export const READER_STATE_KEY = "biolearning.reader-state.v1";

export const defaultReaderState: ReaderState = {
  language: "zh",
  lessonId: null,
  sidebarOpen: false,
  activeSectionId: null,
  progressByLesson: {},
};

const SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type StorageAdapter = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function validId(value: unknown): string | null {
  return typeof value === "string" && SAFE_ID.test(value) ? value : null;
}

function validProgress(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([lessonId, progress]) =>
        SAFE_ID.test(lessonId) &&
        typeof progress === "number" &&
        Number.isFinite(progress) &&
        progress >= 0 &&
        progress <= 1,
    ),
  );
}

function normalize(value: unknown): ReaderState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultReaderState };
  }
  const candidate = value as Record<string, unknown>;
  return {
    language: candidate.language === "en" || candidate.language === "zh"
      ? candidate.language
      : defaultReaderState.language,
    lessonId: validId(candidate.lessonId),
    sidebarOpen: typeof candidate.sidebarOpen === "boolean"
      ? candidate.sidebarOpen
      : defaultReaderState.sidebarOpen,
    activeSectionId: validId(candidate.activeSectionId),
    progressByLesson: validProgress(candidate.progressByLesson),
  };
}

export class BrowserStateStore {
  constructor(private readonly storage: StorageAdapter = window.localStorage) {}

  read(): ReaderState {
    try {
      const serialized = this.storage.getItem(READER_STATE_KEY);
      return serialized === null
        ? { ...defaultReaderState }
        : normalize(JSON.parse(serialized));
    } catch {
      return { ...defaultReaderState };
    }
  }

  write(state: ReaderState): void {
    try {
      this.storage.setItem(READER_STATE_KEY, JSON.stringify(normalize(state)));
    } catch {
      // Reading must remain available when storage is blocked or full.
    }
  }

  clear(): void {
    try {
      this.storage.removeItem(READER_STATE_KEY);
    } catch {
      // A blocked storage implementation is equivalent to an empty store.
    }
  }
}
