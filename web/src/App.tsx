import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ContentProvider } from "./content/content-provider";
import type {
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
  UpdateCheckResult,
} from "./contracts";
import { CourseHeader } from "./components/CourseHeader";
import { DatasetPanel } from "./components/DatasetPanel";
import { LessonReader } from "./components/LessonReader";
import { LessonSidebar } from "./components/LessonSidebar";
import { UpdateDialog } from "./components/UpdateDialog";
import {
  type BrowserStateStore,
  type ReaderState,
} from "./state/browser-state-store";
import type { ContentUpdateClient } from "./updates/update-service";
import {
  type ExecutionRunner,
  type RunnerStatus,
  unavailableRunnerStatus,
} from "./runtime/execution-runner";
import "./styles/tokens.css";
import "./styles/textbook.css";

interface TextbookAppProps {
  contentProvider: ContentProvider;
  stateStore: BrowserStateStore;
  updateService?: ContentUpdateClient;
  runner?: ExecutionRunner;
}

type Theme = "light" | "dark";

function preferredTheme(): Theme {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function TextbookApp({
  contentProvider,
  stateStore,
  updateService,
  runner,
}: TextbookAppProps) {
  const initialState = useMemo(() => stateStore.read(), [stateStore]);
  const [readerState, setReaderState] = useState<ReaderState>(initialState);
  const [course, setCourse] = useState<CourseIndex | null>(null);
  const [lesson, setLesson] = useState<LessonPayload | null>(null);
  const [datasets, setDatasets] = useState<DatasetEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(preferredTheme);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [applyingUpdate, setApplyingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [environmentStatus, setEnvironmentStatus] = useState<RunnerStatus>({
    ...unavailableRunnerStatus,
  });
  const requestSequence = useRef(0);

  const persistState = useCallback(
    (next: ReaderState) => {
      setReaderState(next);
      stateStore.write(next);
    },
    [stateStore],
  );

  const loadLesson = useCallback(
    async (
      currentCourse: CourseIndex,
      lessonId: string,
      language: Language,
      nextState: ReaderState,
    ) => {
      const sequence = ++requestSequence.current;
      setError(null);
      try {
        const [nextLesson, nextDatasets] = await Promise.all([
          contentProvider.getLesson(lessonId, language),
          contentProvider.getDatasets(language),
        ]);
        if (sequence !== requestSequence.current) return;
        setLesson(nextLesson);
        setDatasets(nextDatasets);
        persistState(nextState);
      } catch (caught) {
        if (sequence !== requestSequence.current) return;
        setError(
          caught instanceof Error ? caught.message : "The lesson could not be loaded.",
        );
      }
    },
    [contentProvider, persistState],
  );

  useEffect(() => {
    const media = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    if (!media) return;
    const updateTheme = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, []);

  useEffect(() => {
    let active = true;
    if (!runner) return;
    void runner.getStatus().then(
      (status) => {
        if (active) setEnvironmentStatus(status);
      },
      () => {
        if (active) setEnvironmentStatus({ ...unavailableRunnerStatus });
      },
    );
    return () => {
      active = false;
    };
  }, [runner]);

  useEffect(() => {
    document.documentElement.lang = readerState.language;
  }, [readerState.language]);

  useEffect(() => {
    let active = true;
    async function openCourse() {
      try {
        const nextCourse = await contentProvider.getCourse();
        if (!active) return;
        setCourse(nextCourse);
        const lessonId =
          nextCourse.lessons.find((item) => item.id === initialState.lessonId)?.id ??
          nextCourse.lessons[0]?.id;
        if (!lessonId) {
          setError("The course does not contain any lessons.");
          return;
        }
        await loadLesson(nextCourse, lessonId, initialState.language, {
          ...initialState,
          lessonId,
        });
      } catch (caught) {
        if (!active) return;
        setError(
          caught instanceof Error ? caught.message : "The course could not be opened.",
        );
      }
    }
    void openCourse();
    return () => {
      active = false;
    };
  }, [contentProvider, initialState, loadLesson]);

  function changeLanguage(language: Language) {
    if (!course || !readerState.lessonId || language === readerState.language) return;
    void loadLesson(course, readerState.lessonId, language, {
      ...readerState,
      language,
      sidebarOpen: false,
    });
  }

  function selectLesson(lessonId: string) {
    if (!course || lessonId === readerState.lessonId) return;
    void loadLesson(course, lessonId, readerState.language, {
      ...readerState,
      lessonId,
      sidebarOpen: false,
      activeSectionId: null,
    });
  }

  async function checkForUpdates() {
    if (!course || checkingForUpdates) return;
    setCheckingForUpdates(true);
    setUpdateError(null);
    try {
      const result = updateService
        ? await updateService.check(course.contentVersion)
        : {
            configured: false,
            updateAvailable: false,
            currentVersion: course.contentVersion,
          };
      setUpdateResult(result);
    } catch (caught) {
      setUpdateResult({
        configured: true,
        updateAvailable: false,
        currentVersion: course.contentVersion,
      });
      setUpdateError(
        caught instanceof Error ? caught.message : "Could not check for updates.",
      );
    } finally {
      setCheckingForUpdates(false);
    }
  }

  async function applyUpdate(targetVersion: string) {
    if (!course || !lesson || !updateService || applyingUpdate) return;
    setApplyingUpdate(true);
    setUpdateError(null);
    try {
      await updateService.apply(course.contentVersion, targetVersion);
      await contentProvider.refresh();
      const nextCourse = await contentProvider.getCourse();
      if (nextCourse.contentVersion !== targetVersion) {
        throw new Error("The activated course version does not match the checked update.");
      }
      setCourse(nextCourse);
      const nextLessonId = nextCourse.lessons.some((item) => item.id === lesson.lessonId)
        ? lesson.lessonId
        : nextCourse.lessons[0]?.id;
      if (!nextLessonId) throw new Error("The updated course does not contain any lessons.");
      await loadLesson(nextCourse, nextLessonId, readerState.language, {
        ...readerState,
        lessonId: nextLessonId,
      });
      setUpdateResult(null);
    } catch (caught) {
      setUpdateError(
        caught instanceof Error ? caught.message : "Could not apply the update.",
      );
    } finally {
      setApplyingUpdate(false);
    }
  }

  if (!course || !lesson) {
    return (
      <main
        className="connection-state"
        data-theme={theme}
        aria-label="Bilingual interactive textbook"
      >
        <span className="sequence-mark" aria-hidden="true" />
        <p>
          {error ?? (readerState.language === "zh" ? "正在打开教材…" : "Opening textbook…")}
        </p>
      </main>
    );
  }

  return (
    <div className="textbook-app" data-theme={theme}>
      <CourseHeader
        course={course}
        language={readerState.language}
        onLanguageChange={changeLanguage}
        onToggleSidebar={() =>
          persistState({ ...readerState, sidebarOpen: !readerState.sidebarOpen })
        }
        onCheckForUpdates={() => void checkForUpdates()}
        checkingForUpdates={checkingForUpdates}
      />
      <div className="textbook-body">
        <LessonSidebar
          course={course}
          language={readerState.language}
          lessonId={lesson.lessonId}
          open={readerState.sidebarOpen}
          onClose={() => persistState({ ...readerState, sidebarOpen: false })}
          onSelectLesson={selectLesson}
          environmentStatus={environmentStatus}
        />
        <aside
          className="sequence-rail"
          aria-label={readerState.language === "zh" ? "章节位置" : "Section position"}
        >
          <span className="rail-line" aria-hidden="true" />
          {lesson.sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              title={section.heading}
              className={index === 0 ? "active" : ""}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </a>
          ))}
        </aside>
        <div className="reading-canvas">
          {error ? <div className="inline-error" role="alert">{error}</div> : null}
          <LessonReader
            lesson={lesson}
            language={readerState.language}
            contentProvider={contentProvider}
          />
          <DatasetPanel datasets={datasets} language={readerState.language} />
        </div>
      </div>
      {updateResult ? (
        <UpdateDialog
          language={readerState.language}
          result={updateResult}
          applying={applyingUpdate}
          error={updateError}
          onClose={() => {
            if (!applyingUpdate) {
              setUpdateResult(null);
              setUpdateError(null);
            }
          }}
          onApply={applyUpdate}
        />
      ) : null}
    </div>
  );
}
