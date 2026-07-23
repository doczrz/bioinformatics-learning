import { useState } from "react";

import type { CourseIndex, Language } from "../contracts";

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
  const isChinese = language === "zh";
  const [foundationOpen, setFoundationOpen] = useState(true);
  const foundationTitle = isChinese
    ? "学习单细胞前的基础知识"
    : "Foundations before single-cell analysis";
  const lessonEntries = course.lessons.map((lesson, index) => ({ lesson, index }));
  const foundationLessons = lessonEntries.filter(({ lesson }) =>
    lesson.number?.startsWith("0."),
  );
  const otherLessons = lessonEntries.filter(({ lesson }) =>
    !lesson.number?.startsWith("0."),
  );

  return (
    <aside
      className={`lesson-sidebar${open ? " open" : ""}`}
      aria-label={isChinese ? "课程目录" : "Course contents"}
    >
      <div className="sidebar-heading">
        <h2>{isChinese ? "目录" : "Contents"}</h2>
        <button
          type="button"
          className="icon-button sidebar-close"
          onClick={onClose}
          aria-label={isChinese ? "关闭目录" : "Close contents"}
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
                <span className="lesson-module-number" aria-hidden="true">0</span>
                <span className="lesson-module-title">{foundationTitle}</span>
                <span className="lesson-module-action" aria-hidden="true">
                  {foundationOpen ? "−" : "+"}
                </span>
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
                      <span>{lesson.title[language]}</span>
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
                <span>{lesson.title[language]}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
