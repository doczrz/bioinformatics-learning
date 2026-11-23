import type { ReactNode } from "react";
import ReactMarkdown, { type ExtraProps } from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import type { ContentProvider } from "../content/content-provider";
import { parseSections } from "../content/markdown";
import type { Language, LessonPayload } from "../contracts";
import { CodeBlock } from "./CodeBlock";
import "../styles/reader.css";

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
        <h1>{lesson.title}</h1>
        <p>
          {isChinese
            ? "本课暂未提供中文版本。"
            : "This lesson is not yet available in English."}
        </p>
      </main>
    );
  }

  const sections = lesson.sections.some(section => section.line === undefined)
    ? parseSections(lesson.markdown).map((section, index) => ({
        ...section, id: lesson.sections[index]?.id ?? section.id,
      }))
    : lesson.sections;
  const sectionIds = new Map(sections.map(section => [section.line, section.id]));
  function heading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
    return function MarkdownHeading({ node, children }: ExtraProps & { children?: ReactNode }) {
      return <Tag id={sectionIds.get(node?.position?.start.line)}>{children}</Tag>;
    };
  }

  return (
    <main
      className="lesson-reader"
      id="lesson-content"
      data-lesson-id={lesson.lessonId}
      tabIndex={-1}
    >
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
          pre: ({ node, children }) => {
            const code = node?.children[0];
            if (code?.type !== "element" || code.tagName !== "code") return <pre>{children}</pre>;
            const value = code.children.map(child => child.type === "text" ? child.value : "").join("");
            const languageLabel = /language-([\w+-]+)/.exec(String(code.properties.className ?? ""))?.[1];
            return <CodeBlock code={value.replace(/\n$/, "")} languageLabel={languageLabel ?? "text"} interfaceLanguage={language} />;
          },
          code: ({ children }) => <code className="inline-code">{children}</code>,
          table: ({ children }) => (
            <div className="lesson-table-wrap" tabIndex={0} role="region" aria-label={isChinese ? "表格" : "Table"}>
              <table>{children}</table>
            </div>
          ),
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
