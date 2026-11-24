import type { MouseEvent } from "react";
import type { CourseIndex, Language, LessonSummary } from "../contracts";
import { messages } from "../i18n";
import { readingHref } from "../reader-location";
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

const lessonMarks: Record<string, string> = {
  "bioinformatics-computing-foundations": ">_",
  "software-packages-environments": "{ }",
  "r-code-reading-basics": "R",
  "python-code-reading-basics": "Py",
};

export function CourseCatalog({ course, language, resumeLessonId, onSelectLesson }: CourseCatalogProps) {
  const t = messages[language];
  const moduleNames: Record<string, string> = { "0": t.foundations, "1": t.sequencing };
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
          <h1 id="catalog-title">{t.catalogTitle}</h1>
          <p>{t.catalogIntro}</p>
          {entry && (
            <a className="catalog-enter" href={readingHref(entry.id, language)} onClick={(event) => openLesson(event, entry.id)}>
              <span className="catalog-read-icon" aria-hidden="true" />
              {lastLesson ? t.continueReading : t.startLearning}
              {entry.number && <span className="catalog-enter-number">{entry.number}</span>}
            </a>
          )}
        </div>
        <dl className="catalog-metrics">
          <div><dt>{t.modules}</dt><dd>{modules.size}</dd></div>
          <div><dt>{t.lessons}</dt><dd>{course.lessons.length}</dd></div>
        </dl>
      </header>

      <h2 className="catalog-directory-title">{t.contents}</h2>
      {Array.from(modules, ([key, lessons]) => {
        const moduleTitle = moduleNames[key] ?? (key ? t.moduleNumber.replace("{n}", key) : t.otherLessons);
        return (
          <details className="catalog-group" key={key} open>
            <summary>
              <span className="catalog-folder" aria-hidden="true" />
              <span className="catalog-group-name">{moduleTitle}</span>
              <span className="catalog-group-count">{(lessons.length === 1 ? t.oneLesson : t.manyLessons).replace("{n}", String(lessons.length))}</span>
              <span className="catalog-chevron" aria-hidden="true" />
            </summary>
            <ul className="catalog-grid">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <a className="catalog-card" href={readingHref(lesson.id, language)} onClick={(event) => openLesson(event, lesson.id)}>
                    <span className="catalog-glyph" aria-hidden="true">
                      {lessonMarks[lesson.id] ?? (key === "1" ? <span className="catalog-cells" /> : <span className="catalog-read-icon" />)}
                    </span>
                    <span className="catalog-card-text">
                      {lesson.number && <span className="catalog-lesson-number">{t.lessonNumber.replace("{n}", lesson.number)}</span>}
                      <span className="catalog-card-title">{lesson.title[language] ?? lesson.title.en}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </main>
    <footer className="catalog-publisher" aria-label={t.publisher}>
      <div className="catalog-publisher-inner">
        <div className="catalog-publisher-credit">
          <span>{t.publishedBy}</span>
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
