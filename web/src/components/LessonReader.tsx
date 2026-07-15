import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import type { ContentProvider } from "../content/content-provider";
import type { Language, LessonPayload } from "../contracts";
import { CodeBlock } from "./CodeBlock";

interface LessonReaderProps {
  lesson: LessonPayload;
  language: Language;
  contentProvider: ContentProvider;
}

export function LessonReader({
  lesson,
  language,
  contentProvider,
}: LessonReaderProps) {
  const isChinese = language === "zh";

  if (!lesson.translationAvailable) {
    return (
      <main className="lesson-reader translation-missing" id="lesson-content">
        <span className="section-eyebrow">TRANSLATION</span>
        <h1>{lesson.title}</h1>
        <p>
          {isChinese
            ? "本课暂未提供中文版本。"
            : "This lesson is not yet available in English."}
        </p>
      </main>
    );
  }

  let headingIndex = 0;
  function heading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
    return function MarkdownHeading({ children }: { children?: ReactNode }) {
      const section = lesson.sections[headingIndex++];
      return <Tag id={section?.id}>{children}</Tag>;
    };
  }

  return (
    <main
      className="lesson-reader"
      id="lesson-content"
      data-lesson-id={lesson.lessonId}
      tabIndex={-1}
    >
      <div className="lesson-meta">
        <span>{isChinese ? "课程正文" : "Lesson"}</span>
        <code>{lesson.lessonId}</code>
      </div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        skipHtml
        components={{
          h1: heading("h1"),
          h2: heading("h2"),
          h3: heading("h3"),
          h4: heading("h4"),
          h5: heading("h5"),
          h6: heading("h6"),
          pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
          code: ({ className, children, ...properties }) => {
            const code = String(children).replace(/\n$/, "");
            const languageLabel = /language-([^ ]+)/.exec(className ?? "")?.[1];
            return languageLabel ? (
              <CodeBlock
                code={code}
                languageLabel={languageLabel}
                interfaceLanguage={language}
              />
            ) : (
              <code className="inline-code" {...properties}>
                {children}
              </code>
            );
          },
          a: ({ href, children }) => {
            const external = Boolean(href && /^https?:\/\//i.test(href));
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            <img
              src={src ? contentProvider.resolveAssetUrl(src) : undefined}
              alt={alt ?? ""}
            />
          ),
        }}
      >
        {lesson.markdown}
      </ReactMarkdown>
    </main>
  );
}
