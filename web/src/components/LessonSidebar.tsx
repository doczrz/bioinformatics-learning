import { useState } from "react";

import type { CourseIndex, Language } from "../contracts";
import { messages } from "../i18n";

interface LessonSidebarProps {
  course: CourseIndex;
  language: Language;
  lessonId: string;
  open: boolean;
  onSelectLesson: (lessonId: string) => void;
  onClose: () => void;
}

export function LessonSidebar({
  course,
  language,
  lessonId,
  open,
  onSelectLesson,
  onClose,
}: LessonSidebarProps) {
  const t = messages[language];
  const [foundationOpen, setFoundationOpen] = useState(true);
  const foundationTitle = t.foundations;
  const lessonEntries = course.lessons.map((lesson, index) => ({ lesson, index }));
  const foundationLessons = lessonEntries.filter(({ lesson }) =>
    lesson.number?.startsWith("0."),
  );
  const otherLessons = lessonEntries.filter(({ lesson }) =>
    !lesson.number?.startsWith("0."),
  );

  return (
    <aside
      id="lesson-sidebar"
      className={`lesson-sidebar${open ? " open" : ""}`}
      aria-label={t.contents}
    >
      <div className="sidebar-heading">
        <h2>{t.contents}</h2>
        <button
          type="button"
          className="icon-button sidebar-close"
          onClick={onClose}
          aria-label={t.closeContents}
        >
          ×
        </button>
      </div>
      <nav>
        <ol className="lesson-outline">
          {foundationLessons.length > 0 ? (
            <li className="lesson-module">
              <button
                type="button"
                className="lesson-module-toggle"
                aria-expanded={foundationOpen}
                aria-controls="foundation-module-lessons"
                onClick={() => setFoundationOpen((open) => !open)}
              >
                <span className="lesson-module-title">{foundationTitle}</span>
                <span className="lesson-module-action" aria-hidden="true" />
              </button>
              <ol
                id="foundation-module-lessons"
                aria-label={foundationTitle}
                hidden={!foundationOpen}
              >
                {foundationLessons.map(({ lesson, index }) => (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      className={lesson.id === lessonId ? "current" : ""}
                      aria-current={lesson.id === lessonId ? "page" : undefined}
                      onClick={() => onSelectLesson(lesson.id)}
                    >
                      <span className="lesson-number">
                        {lesson.number ?? String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{lesson.title[language] ?? lesson.title.en}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </li>
          ) : null}
          {otherLessons.map(({ lesson, index }) => (
            <li key={lesson.id}>
              <button
                type="button"
                className={lesson.id === lessonId ? "current" : ""}
                aria-current={lesson.id === lessonId ? "page" : undefined}
                onClick={() => onSelectLesson(lesson.id)}
              >
                <span className="lesson-number">
                  {lesson.number ?? String(index + 1).padStart(2, "0")}
                </span>
                <span>{lesson.title[language] ?? lesson.title.en}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
