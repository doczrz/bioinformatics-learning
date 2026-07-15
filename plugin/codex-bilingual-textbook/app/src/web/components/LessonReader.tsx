import { useRef, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import type { Language, LessonPayload } from "../../shared/contracts";
import type { TextbookBridge } from "../bridge/app-bridge";
import { extractLessonSelection, type LessonSelection } from "../selection/extract-selection";
import { formatCodexQuestion } from "../selection/format-question";
import { AskComposer } from "./AskComposer";
import { CodeBlock } from "./CodeBlock";
import { SelectionAction } from "./SelectionAction";

interface LessonReaderProps {
  lesson: LessonPayload;
  language: Language;
  bridge: TextbookBridge;
}

export function LessonReader({ lesson, language, bridge }: LessonReaderProps) {
  const isChinese = language === "zh";
  const readerRef = useRef<HTMLElement>(null);
  const [selection, setSelection] = useState<LessonSelection | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

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

  function captureSelection() {
    if (!readerRef.current || composerOpen) return;
    setSelection(extractLessonSelection(readerRef.current, window.getSelection()));
  }

  function clearSelection() {
    setComposerOpen(false);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
    queueMicrotask(() => readerRef.current?.focus());
  }

  async function sendQuestion(question: string) {
    if (!selection) return;
    await bridge.sendMessage(
      formatCodexQuestion({
        courseId: lesson.courseId,
        contentVersion: lesson.contentVersion,
        lessonId: lesson.lessonId,
        sectionHeading: selection.sectionHeading || lesson.title,
        language,
        selectedText: selection.text,
        question,
      }),
    );
    clearSelection();
  }

  return (
    <>
    <main
      ref={readerRef}
      className="lesson-reader"
      id="lesson-content"
      data-lesson-id={lesson.lessonId}
      tabIndex={-1}
      onMouseUp={captureSelection}
      onKeyUp={captureSelection}
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
          a: ({ href, children }) => (
            <a
              href={href}
              onClick={(event) => {
                if (!href) return;
                event.preventDefault();
                void bridge.openLink(href);
              }}
            >
              {children}
            </a>
          ),
        }}
      >
        {lesson.markdown}
      </ReactMarkdown>
    </main>
    {selection && !composerOpen ? (
      <SelectionAction
        language={language}
        selection={selection}
        onAsk={() => setComposerOpen(true)}
      />
    ) : null}
    {selection && composerOpen ? (
      <AskComposer
        language={language}
        selection={selection}
        onCancel={clearSelection}
        onSend={sendQuestion}
      />
    ) : null}
    </>
  );
}
