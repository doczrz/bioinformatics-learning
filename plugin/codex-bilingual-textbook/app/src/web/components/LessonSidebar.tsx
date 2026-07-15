import type { CourseIndex, Language } from "../../shared/contracts";
import { EnvironmentStatus } from "./EnvironmentStatus";

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
  return (
    <aside className={`lesson-sidebar${open ? " open" : ""}`} aria-label={isChinese ? "课程目录" : "Course contents"}>
      <div className="sidebar-heading">
        <h2>{isChinese ? "目录" : "Contents"}</h2>
        <button type="button" className="icon-button sidebar-close" onClick={onClose} aria-label={isChinese ? "关闭目录" : "Close contents"}>
          ×
        </button>
      </div>
      <nav>
        <ol>
          {course.lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <button
                type="button"
                className={lesson.id === lessonId ? "current" : ""}
                aria-current={lesson.id === lessonId ? "page" : undefined}
                onClick={() => onSelectLesson(lesson.id)}
              >
                <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{lesson.title[language]}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <EnvironmentStatus language={language} />
    </aside>
  );
}
