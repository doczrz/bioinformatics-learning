import { useEffect, useMemo, useState } from "react";

import type { ContentProvider } from "./content/content-provider";
import type {
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
  UpdateCheckResult,
} from "./contracts";
import { CourseHeader } from "./components/CourseHeader";
import { CourseCatalog } from "./components/CourseCatalog";
import { DatasetPanel } from "./components/DatasetPanel";
import { LessonReader } from "./components/LessonReader";
import { LessonSidebar } from "./components/LessonSidebar";
import { UpdateDialog } from "./components/UpdateDialog";
import {
  type BrowserStateStore,
  type ReaderState,
} from "./state/browser-state-store";
import type { ContentUpdateClient } from "./updates/update-service";
import "./styles/tokens.css";
import "./styles/textbook.css";

interface TextbookAppProps {
  contentProvider: ContentProvider;
  stateStore: BrowserStateStore;
  updateService?: ContentUpdateClient;
}

type Theme = "light" | "dark";

function lessonInUrl(lastLesson: string | null) {
  return new URLSearchParams(window.location.search).get("lesson")
    ?? (window.location.hash ? lastLesson ?? "" : null);
}

function preferredTheme(): Theme {
  try {
    return window.localStorage.getItem("biolearning.theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function TextbookApp({
  contentProvider,
  stateStore,
  updateService,
}: TextbookAppProps) {
  const initialState = useMemo(() => stateStore.read(), [stateStore]);
  const [readerState, setReaderState] = useState<ReaderState>(initialState);
  const [requestedLesson, setRequestedLesson] = useState(() => lessonInUrl(initialState.lessonId));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [course, setCourse] = useState<CourseIndex | null>(null);
  const [lesson, setLesson] = useState<LessonPayload | null>(null);
  const [datasets, setDatasets] = useState<DatasetEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(preferredTheme);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [applyingUpdate, setApplyingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const language = readerState.language;
  const zh = language === "zh";
  const selected = requestedLesson === "" ? course?.lessons[0]
    : course?.lessons.find((entry) => entry.id === requestedLesson);
  const currentLesson = lesson && lesson.lessonId === selected?.id && lesson.language === language ? lesson : null;
  const headings = currentLesson?.sections.filter((section) => section.level === 2) ?? [];

  function closeSidebar() {
    setSidebarOpen(false);
    document.querySelector<HTMLButtonElement>('[aria-controls="lesson-sidebar"]')?.focus();
  }

  useEffect(() => {
    stateStore.write(readerState);
  }, [readerState, stateStore]);

  useEffect(() => {
    const syncLocation = () => {
      setRequestedLesson(lessonInUrl(stateStore.read().lessonId));
      setSidebarOpen(false);
    };
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, [stateStore]);

  useEffect(() => {
    if (!sidebarOpen) return;
    document.querySelector<HTMLButtonElement>(".sidebar-close")?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [sidebarOpen]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { window.localStorage.setItem("biolearning.theme", next); }
    catch { /* The current session still uses the selected theme. */ }
  }

  useEffect(() => {
    document.documentElement.lang = readerState.language;
    document.title = readerState.language === "zh"
      ? "Biolearning · 双语交互教材"
      : "Biolearning · Bilingual interactive textbook";
  }, [readerState.language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let active = true;
    async function openCourse() {
      try {
        const nextCourse = await contentProvider.getCourse();
        if (!active) return;
        setCourse(nextCourse);
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
  }, [contentProvider]);

  useEffect(() => {
    let active = true;
    setError(null);
    if (!selected) {
      setLesson(null);
      return;
    }
    async function readLesson(id: string) {
      try {
        const [nextLesson, nextDatasets] = await Promise.all([
          contentProvider.getLesson(id, language),
          contentProvider.getDatasets(language),
        ]);
        if (!active) return;
        setLesson(nextLesson);
        setDatasets(nextDatasets);
        setReaderState((state) => state.lessonId === id ? state : { ...state, lessonId: id });
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "The lesson could not be loaded.");
      }
    }
    void readLesson(selected.id);
    return () => { active = false; };
  }, [selected, language, contentProvider]);

  useEffect(() => {
    if (!lesson || lesson.lessonId !== selected?.id) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
  }, [lesson, selected]);

  function changeLanguage(language: Language) {
    setReaderState((state) => ({ ...state, language }));
    setSidebarOpen(false);
  }

  function navigate(lessonId: string | null) {
    const url = new URL(window.location.href);
    if (lessonId) url.searchParams.set("lesson", lessonId);
    else url.searchParams.delete("lesson");
    url.hash = "";
    if (url.href !== window.location.href) window.history.pushState(null, "", url);
    setRequestedLesson(lessonId);
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }

  async function checkForUpdates() {
    if (!course || !updateService || checkingForUpdates) return;
    setCheckingForUpdates(true);
    setUpdateError(null);
    try {
      const result = await updateService.check(course.contentVersion);
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
    if (!course || !updateService || applyingUpdate) return;
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
      if (selected && !nextCourse.lessons.some((entry) => entry.id === selected.id)) navigate(null);
      setUpdateResult(null);
    } catch (caught) {
      setUpdateError(
        caught instanceof Error ? caught.message : "Could not apply the update.",
      );
    } finally {
      setApplyingUpdate(false);
    }
  }

  if (!course) {
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
        onHome={() => navigate(null)}
        showSidebarToggle={Boolean(selected)}
        theme={theme}
        onToggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onCheckForUpdates={updateService ? checkForUpdates : undefined}
        checkingForUpdates={checkingForUpdates}
      />
      {!selected ? (
        <CourseCatalog
          course={course}
          language={language}
          resumeLessonId={readerState.lessonId}
          onSelectLesson={navigate}
        />
      ) : (
        <div className="textbook-body">
          <LessonSidebar
            course={course}
            language={language}
            lessonId={selected.id}
            open={sidebarOpen}
            onClose={closeSidebar}
            onSelectLesson={navigate}
          />
          {sidebarOpen && (
            <button type="button" className="drawer-backdrop" tabIndex={-1}
              aria-label={zh ? "关闭课程目录" : "Close course contents"} onClick={closeSidebar} />
          )}
          <div className="reading-canvas">
            <div className="reader-tools">
              <nav className="reader-trail" aria-label={zh ? "当前位置" : "Breadcrumb"}>
                <a href={window.location.pathname} onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  navigate(null);
                }}>{zh ? "课程目录" : "Course catalog"}</a>
                <span aria-hidden="true">/</span>
                <span>{zh ? "第 " : "Lesson "}{selected.number ?? selected.order}{zh ? " 节" : ""}</span>
              </nav>
              {headings.length > 0 && (
                <details className="section-menu" key={selected.id + language}>
                  <summary>{zh ? "本课小节" : "On this page"}</summary>
                  <ul>
                    {headings.map((section) => (
                      <li key={section.id}>
                        <a href={`#${section.id}`} onClick={(event) => {
                          event.currentTarget.closest("details")?.removeAttribute("open");
                        }}>{section.heading}</a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
            {error ? <p className="inline-error" role="alert">{error}</p>
              : currentLesson ? (
                <>
                  <LessonReader lesson={currentLesson} language={language} contentProvider={contentProvider} />
                  <DatasetPanel datasets={datasets} language={language} />
                </>
              ) : <p className="lesson-loading" role="status">{zh ? "正在读取课程…" : "Opening lesson…"}</p>}
          </div>
        </div>
      )}
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
