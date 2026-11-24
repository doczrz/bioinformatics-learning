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
import { ReaderError, readerProblem, type ReaderProblem } from "./components/ReaderError";
import { messages } from "./i18n";
import { languageInUrl, readingHref } from "./reader-location";
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
  const initialState = useMemo(() => {
    const saved = stateStore.read();
    return { ...saved, language: languageInUrl(window.location.search) ?? saved.language };
  }, [stateStore]);
  const [readerState, setReaderState] = useState<ReaderState>(initialState);
  const [requestedLesson, setRequestedLesson] = useState(() => lessonInUrl(initialState.lessonId));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [course, setCourse] = useState<CourseIndex | null>(null);
  const [lesson, setLesson] = useState<LessonPayload | null>(null);
  const [datasets, setDatasets] = useState<DatasetEntry[]>([]);
  const [error, setError] = useState<ReaderProblem | null>(null);
  const [theme, setTheme] = useState<Theme>(preferredTheme);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);
  const [checkingForUpdates, setCheckingForUpdates] = useState(false);
  const [applyingUpdate, setApplyingUpdate] = useState(false);
  const [updateError, setUpdateError] = useState<ReaderProblem | null>(null);
  const language = readerState.language;
  const t = messages[language];
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
    // Keep the initial language in history when arriving through an older, language-neutral URL.
    if (!languageInUrl(window.location.search)) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", initialState.language);
      window.history.replaceState(window.history.state, "", url);
    }
    const syncLocation = () => {
      setRequestedLesson(lessonInUrl(stateStore.read().lessonId));
      const next = languageInUrl(window.location.search);
      if (next) setReaderState((state) => state.language === next ? state : { ...state, language: next });
      setSidebarOpen(false);
    };
    window.addEventListener("popstate", syncLocation);
    return () => window.removeEventListener("popstate", syncLocation);
  }, [stateStore, initialState]);

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
    document.documentElement.lang = language;
    document.title = `Biolearning · ${t.textbook}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.catalogIntro);
  }, [language, t]);

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
        setError(readerProblem("courseError", caught));
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
        if (active) setError(readerProblem("lessonError", caught));
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

  function changeLanguage(next: Language) {
    if (next === language) return;
    const href = readingHref(selected?.id ?? requestedLesson, next, window.location.search);
    window.history.pushState(null, "", href);
    setReaderState((state) => ({ ...state, language: next }));
    setSidebarOpen(false);
  }

  function navigate(lessonId: string | null) {
    const url = new URL(readingHref(lessonId, language, window.location.search), window.location.href);
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
      setUpdateError(readerProblem("checkError", caught));
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
      setUpdateError(readerProblem("applyError", caught));
    } finally {
      setApplyingUpdate(false);
    }
  }

  if (!course) {
    return (
      <main
        className="connection-state"
        data-theme={theme}
        aria-label={t.textbook}
      >
        <span className="sequence-mark" aria-hidden="true" />
        {error ? <ReaderError problem={error} language={language} /> : <p role="status">{t.openTextbook}</p>}
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
              aria-label={t.closeContents} onClick={closeSidebar} />
          )}
          <div className="reading-canvas">
            <div className="reader-tools">
              <nav className="reader-trail" aria-label={t.breadcrumb}>
                <a href={readingHref(null, language)} onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  navigate(null);
                }}>{t.catalog}</a>
                <span aria-hidden="true">/</span>
                <span>{t.lessonNumber.replace("{n}", String(selected.number ?? selected.order))}</span>
              </nav>
              {headings.length > 0 && (
                <details className="section-menu" key={selected.id + language}>
                  <summary>{t.onThisPage}</summary>
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
            {error ? <ReaderError problem={error} language={language} />
              : currentLesson ? (
                <>
                  <LessonReader lesson={currentLesson} language={language} contentProvider={contentProvider} />
                  <DatasetPanel datasets={datasets} language={language} />
                </>
              ) : <p className="lesson-loading" role="status">{t.openLesson}</p>}
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
