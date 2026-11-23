import type { MouseEvent } from "react";
import type { CourseIndex, Language, LessonSummary } from "../contracts";
import centerLogo from "../assets/vib-ccb.png";
import vibLogo from "../assets/vib.svg";
import kuLeuvenLogo from "../assets/ku-leuven.svg";
import "../styles/catalog.css";

interface CourseCatalogProps {
  course: CourseIndex;
  language: Language;
  resumeLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
}

const moduleNames: Record<string, Record<Language, string>> = {
  "0": { zh: "学习单细胞前的基础知识", en: "Foundations before single-cell analysis" },
  "1": { zh: "单细胞 RNA 测序", en: "Single-cell RNA sequencing" },
};

const lessonMarks: Record<string, string> = {
  "bioinformatics-computing-foundations": ">_",
  "software-packages-environments": "{ }",
  "r-code-reading-basics": "R",
  "python-code-reading-basics": "Py",
};

export function CourseCatalog({ course, language, resumeLessonId, onSelectLesson }: CourseCatalogProps) {
  const zh = language === "zh";
  const modules = new Map<string, LessonSummary[]>();
  for (const lesson of course.lessons) {
    const key = lesson.number?.split(".")[0] ?? "";
    const group = modules.get(key);
    if (group) group.push(lesson);
    else modules.set(key, [lesson]);
  }
  const lastLesson = course.lessons.find((lesson) => lesson.id === resumeLessonId);
  const entry = lastLesson ?? course.lessons[0];

  function openLesson(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onSelectLesson(id);
  }

  return (<>
    <main className="course-catalog" aria-labelledby="catalog-title">
      <header className="catalog-overview">
        <div className="catalog-intro">
          <h1 id="catalog-title">{zh ? "生物信息学入门" : "Learning bioinformatics"}</h1>
          <p>{zh
            ? "从 Linux、R 和 Python 开始，学习单细胞 RNA 测序与分析。"
            : "Explore single-cell RNA sequencing and analysis, starting with Linux, R and Python."}</p>
          {entry && (
            <a className="catalog-enter" href={`?lesson=${encodeURIComponent(entry.id)}`} onClick={(event) => openLesson(event, entry.id)}>
              <span className="catalog-read-icon" aria-hidden="true" />
              {zh ? (lastLesson ? "继续阅读" : "开始学习") : (lastLesson ? "Continue reading" : "Start learning")}
              {entry.number && <span className="catalog-enter-number">{entry.number}</span>}
            </a>
          )}
        </div>
        <dl className="catalog-metrics">
          <div><dt>{zh ? "学习模块" : "Modules"}</dt><dd>{modules.size}</dd></div>
          <div><dt>{zh ? "已发布课程" : "Lessons"}</dt><dd>{course.lessons.length}</dd></div>
        </dl>
      </header>

      <h2 className="catalog-directory-title">{zh ? "课程目录" : "Course contents"}</h2>
      {Array.from(modules, ([key, lessons]) => {
        const moduleTitle = moduleNames[key]?.[language] ?? (key ? (zh ? `模块 ${key}` : `Module ${key}`) : (zh ? "其他课程" : "Other lessons"));
        return (
          <details className="catalog-group" key={key} open>
            <summary>
              <span className="catalog-folder" aria-hidden="true" />
              <span className="catalog-group-name">{moduleTitle}</span>
              <span className="catalog-group-count">{zh ? `${lessons.length} 节` : `${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}`}</span>
              <span className="catalog-chevron" aria-hidden="true" />
            </summary>
            <ul className="catalog-grid">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <a className="catalog-card" href={`?lesson=${encodeURIComponent(lesson.id)}`} onClick={(event) => openLesson(event, lesson.id)}>
                    <span className="catalog-glyph" aria-hidden="true">
                      {lessonMarks[lesson.id] ?? (key === "1" ? <span className="catalog-cells" /> : <span className="catalog-read-icon" />)}
                    </span>
                    <span className="catalog-card-text">
                      {lesson.number && <span className="catalog-lesson-number">{zh ? "第 " : "Lesson "}{lesson.number}{zh && " 节"}</span>}
                      <span className="catalog-card-title">{lesson.title[language]}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </main>
    <footer className="catalog-publisher" aria-label={zh ? "发布方" : "Publisher"}>
      <div className="catalog-publisher-inner">
        <div className="catalog-publisher-credit">
          <span>{zh ? "发布方" : "Published by"}</span>
          <a href="https://lambrechtslab.sites.vib.be/en" lang="en">Diether Lambrechts Lab</a>
          <span lang="en">Laboratory of Translational Genetics</span>
        </div>
        <div className="catalog-publisher-marks">
          <a className="catalog-center-mark" href="https://ccb.sites.vib.be/en">
            <img src={centerLogo} width={1059} height={411} alt="VIB–KU Leuven Center for Cancer Biology" />
          </a>
          <a href="https://vib.be/en">
            <img src={vibLogo} width={102} height={55} alt="VIB" />
          </a>
          <a href="https://www.kuleuven.be/english/kuleuven/">
            <img src={kuLeuvenLogo} width={1587} height={567} alt="KU Leuven" />
          </a>
        </div>
      </div>
    </footer>
  </>);
}
