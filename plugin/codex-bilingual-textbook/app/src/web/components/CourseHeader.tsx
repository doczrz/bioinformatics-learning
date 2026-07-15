import type { CourseIndex, Language } from "../../shared/contracts";

interface CourseHeaderProps {
  course: CourseIndex;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onToggleSidebar: () => void;
}

export function CourseHeader({
  course,
  language,
  onLanguageChange,
  onToggleSidebar,
}: CourseHeaderProps) {
  const isChinese = language === "zh";
  return (
    <header className="course-header">
      <button
        className="icon-button sidebar-toggle"
        type="button"
        onClick={onToggleSidebar}
        aria-label={isChinese ? "打开目录" : "Open contents"}
      >
        <span aria-hidden="true">☰</span>
      </button>
      <div className="course-identity">
        <span className="course-kicker">CODEX · TEXTBOOK</span>
        <strong>{course.title[language]}</strong>
        <span className="version-label">v{course.contentVersion}</span>
      </div>
      <div className="header-actions">
        <div className="language-switch" role="group" aria-label="Language">
          <button
            type="button"
            className={language === "zh" ? "active" : ""}
            aria-pressed={language === "zh"}
            onClick={() => onLanguageChange("zh")}
          >
            中文
          </button>
          <button
            type="button"
            className={language === "en" ? "active" : ""}
            aria-pressed={language === "en"}
            onClick={() => onLanguageChange("en")}
          >
            English
          </button>
        </div>
        <button className="update-button" type="button" disabled>
          {isChinese ? "检查更新" : "Check for updates"}
        </button>
      </div>
    </header>
  );
}
