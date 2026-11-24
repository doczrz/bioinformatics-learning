import { isLanguage, LANGUAGES, type CourseIndex, type Language } from "../contracts";
import { languageNames, messages } from "../i18n";
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
  const t = messages[language];
  const contentsLabel = t.contents;
  const updateLabel = checkingForUpdates ? t.checking : t.checkUpdates;
  const offered = course.languages ?? LANGUAGES;
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
          <select className="masthead-language" aria-label={t.language} value={language}
            onChange={(event) => {
              const next = event.currentTarget.value;
              if (isLanguage(next)) onLanguageChange(next);
            }}>
            {LANGUAGES.filter((code) => offered.includes(code) || code === language).map((code) => (
              <option key={code} value={code} lang={code}>{languageNames[code]}</option>
            ))}
          </select>
          <button
            className="masthead-theme"
            type="button"
            aria-label={t.darkMode}
            title={t.darkMode}
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
