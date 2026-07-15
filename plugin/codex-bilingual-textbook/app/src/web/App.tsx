import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
} from "../shared/contracts";
import { useTextbookBridge, type TextbookBridge } from "./bridge/app-bridge";
import { CourseHeader } from "./components/CourseHeader";
import { DatasetPanel } from "./components/DatasetPanel";
import { LessonReader } from "./components/LessonReader";
import { LessonSidebar } from "./components/LessonSidebar";
import {
  defaultReaderState,
  type ReaderState,
} from "./state/reader-state";
import "./styles/tokens.css";
import "./styles/textbook.css";

interface DatasetResult {
  language: Language;
  datasets: DatasetEntry[];
}

interface TextbookAppProps {
  bridge: TextbookBridge;
}

export function TextbookApp({ bridge }: TextbookAppProps) {
  const initialState = useMemo(
    () => bridge.readWidgetState() ?? defaultReaderState,
    [bridge],
  );
  const [readerState, setReaderState] = useState<ReaderState>(initialState);
  const [course, setCourse] = useState<CourseIndex | null>(null);
  const [lesson, setLesson] = useState<LessonPayload | null>(null);
  const [datasets, setDatasets] = useState<DatasetEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const persistState = useCallback(
    (next: ReaderState) => {
      setReaderState(next);
      void bridge.writeWidgetState(next);
    },
    [bridge],
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
        const [nextLesson, datasetResult] = await Promise.all([
          bridge.callTool<LessonPayload>("get_lesson", {
            lessonId,
            language,
            knownRevision: currentCourse.revision,
          }),
          bridge.callTool<DatasetResult>("get_dataset_catalog", { language }),
        ]);
        if (sequence !== requestSequence.current) return;
        setLesson(nextLesson);
        setDatasets(datasetResult.datasets);
        persistState(nextState);
      } catch (caught) {
        if (sequence !== requestSequence.current) return;
        setError(
          caught instanceof Error ? caught.message : "The lesson could not be loaded.",
        );
      }
    },
    [bridge, persistState],
  );

  useEffect(() => {
    let active = true;
    async function openCourse() {
      try {
        const nextCourse = await bridge.callTool<CourseIndex>("open_course", {
          language: initialState.language,
        });
        if (!active) return;
        setCourse(nextCourse);
        const lessonId =
          nextCourse.lessons.find((item) => item.id === initialState.lessonId)?.id ??
          nextCourse.lessons[0]?.id;
        if (!lessonId) {
          setError("The course does not contain any lessons.");
          return;
        }
        const nextState = { ...initialState, lessonId };
        await loadLesson(nextCourse, lessonId, initialState.language, nextState);
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
  }, [bridge, initialState, loadLesson]);

  function changeLanguage(language: Language) {
    if (!course || !readerState.lessonId || language === readerState.language) return;
    const nextState = { ...readerState, language, sidebarOpen: false };
    void loadLesson(course, readerState.lessonId, language, nextState);
  }

  function selectLesson(lessonId: string) {
    if (!course || lessonId === readerState.lessonId) return;
    const nextState = {
      ...readerState,
      lessonId,
      sidebarOpen: false,
      activeSectionId: null,
    };
    void loadLesson(course, lessonId, readerState.language, nextState);
  }

  if (!course || !lesson) {
    return (
      <main className="connection-state" aria-label="Bilingual interactive textbook">
        <span className="sequence-mark" aria-hidden="true" />
        <p>{error ?? (readerState.language === "zh" ? "正在打开教材…" : "Opening textbook…")}</p>
      </main>
    );
  }

  return (
    <div className="textbook-app" data-theme={bridge.getHostTheme()}>
      <CourseHeader
        course={course}
        language={readerState.language}
        onLanguageChange={changeLanguage}
        onToggleSidebar={() =>
          persistState({ ...readerState, sidebarOpen: !readerState.sidebarOpen })
        }
      />
      <div className="textbook-body">
        <LessonSidebar
          course={course}
          language={readerState.language}
          lessonId={lesson.lessonId}
          open={readerState.sidebarOpen}
          onClose={() => persistState({ ...readerState, sidebarOpen: false })}
          onSelectLesson={selectLesson}
        />
        <aside className="sequence-rail" aria-label={readerState.language === "zh" ? "章节位置" : "Section position"}>
          <span className="rail-line" aria-hidden="true" />
          {lesson.sections.map((section, index) => (
            <a key={section.id} href={`#${section.id}`} title={section.heading} className={index === 0 ? "active" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
            </a>
          ))}
        </aside>
        <div className="reading-canvas">
          {error ? <div className="inline-error" role="alert">{error}</div> : null}
          <LessonReader lesson={lesson} language={readerState.language} bridge={bridge} />
          <DatasetPanel datasets={datasets} language={readerState.language} bridge={bridge} />
        </div>
      </div>
    </div>
  );
}

export function App() {
  const { bridge, isConnected, error } = useTextbookBridge();
  if (error) {
    return <main className="connection-state" role="alert">{error.message}</main>;
  }
  if (!isConnected) {
    return <main className="connection-state" aria-label="Bilingual interactive textbook">Connecting to Codex…</main>;
  }
  return <TextbookApp bridge={bridge} />;
}
