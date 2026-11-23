import type { CourseIndex, Language } from "../contracts";
import "../styles/masthead.css";

interface CourseHeaderProps {
  course: CourseIndex;
  language: Language;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onLanguageChange: (language: Language) => void;
  onHome: () => void;
  showSidebarToggle: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCheckForUpdates?: () => void;
  checkingForUpdates: boolean;
}

export function CourseHeader({
  course,
  language,
  theme,
  onToggleTheme,
  onLanguageChange,
  onHome,
  showSidebarToggle,
  sidebarOpen,
  onToggleSidebar,
  onCheckForUpdates,
  checkingForUpdates,
}: CourseHeaderProps) {
  const isChinese = language === "zh";
  const contentsLabel = isChinese ? "课程目录" : "Course contents";
  const updateLabel = checkingForUpdates
    ? (isChinese ? "正在检查…" : "Checking…")
    : (isChinese ? "检查更新" : "Check for updates");
  return (
    <header className="course-masthead">
      <div className="masthead-inner">
        {showSidebarToggle && (
          <button
            className="masthead-menu"
            type="button"
            onClick={onToggleSidebar}
            aria-label={contentsLabel}
            aria-expanded={sidebarOpen}
            aria-controls="lesson-sidebar"
          >
            <span className="masthead-menu-icon" aria-hidden="true" />
          </button>
        )}
        <button className="masthead-brand" type="button" onClick={onHome} aria-label={`Biolearning · ${contentsLabel}`} title={contentsLabel}>
          <span className="masthead-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="masthead-wordmark">Biolearning</span>
        </button>
        <span className="masthead-version">v{course.contentVersion}</span>
        <div className="masthead-actions">
          <div className="masthead-languages" role="group" aria-label={isChinese ? "教材语言" : "Textbook language"}>
            <button type="button" lang="en" aria-label="English" aria-pressed={!isChinese} onClick={() => onLanguageChange("en")}>
              <span className="lang-full">English</span><span className="lang-short">EN</span>
            </button>
            <button type="button" lang="zh" aria-pressed={isChinese} onClick={() => onLanguageChange("zh")}>中文</button>
          </div>
          <button
            className="masthead-theme"
            type="button"
            aria-label={isChinese ? "深色模式" : "Dark mode"}
            title={isChinese ? "深色模式" : "Dark mode"}
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
          >
            <span className="masthead-theme-icon" aria-hidden="true" />
          </button>
          {onCheckForUpdates && (
            <button className="masthead-update" type="button" disabled={checkingForUpdates} onClick={onCheckForUpdates} aria-label={updateLabel} title={updateLabel}>
              <span className="masthead-update-icon" aria-hidden="true">↻</span>
              <span className="masthead-update-text">{updateLabel}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
