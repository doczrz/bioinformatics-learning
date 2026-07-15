import { useEffect, useRef, useState, type FormEvent } from "react";

import type { Language } from "../../shared/contracts";
import type { LessonSelection } from "../selection/extract-selection";

interface AskComposerProps {
  language: Language;
  selection: LessonSelection;
  onCancel: () => void;
  onSend: (question: string) => Promise<void>;
}

export function AskComposer({
  language,
  selection,
  onCancel,
  onSend,
}: AskComposerProps) {
  const isChinese = language === "zh";
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onCancel]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!question.trim() || sending) return;
    setSending(true);
    setFailed(false);
    try {
      await onSend(question);
    } catch {
      setFailed(true);
      setSending(false);
    }
  }

  return (
    <section
      className="ask-composer"
      role="dialog"
      aria-modal="true"
      aria-label={isChinese ? "问 Codex" : "Ask Codex"}
    >
      <form onSubmit={submit}>
        <div className="ask-composer-heading">
          <div>
            <span className="section-eyebrow">CODEX</span>
            <h2>{isChinese ? "就这段内容提问" : "Ask about this selection"}</h2>
          </div>
          <button type="button" className="composer-close" onClick={onCancel}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">{isChinese ? "取消" : "Cancel"}</span>
          </button>
        </div>

        <blockquote>{selection.text}</blockquote>
        {selection.truncated ? (
          <p className="selection-warning">
            {isChinese
              ? `所选内容共 ${selection.originalCharacterCount} 个字符，本次发送前 ${selection.sentCharacterCount} 个。`
              : `The selection has ${selection.originalCharacterCount} characters; the first ${selection.sentCharacterCount} will be sent.`}
          </p>
        ) : null}

        <label htmlFor="codex-question">
          {isChinese ? "你的问题" : "Your question"}
        </label>
        <textarea
          ref={inputRef}
          id="codex-question"
          value={question}
          rows={4}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={isChinese ? "例如：为什么这里需要这一步？" : "For example: Why is this step needed?"}
        />

        {failed ? (
          <p className="composer-error" role="alert">
            {isChinese
              ? "未能发送给 Codex，你的问题仍保留在这里。"
              : "Could not send to Codex. Your question is still here."}
          </p>
        ) : null}

        <div className="composer-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {isChinese ? "取消" : "Cancel"}
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={!question.trim() || sending}
          >
            {sending
              ? isChinese ? "发送中…" : "Sending…"
              : failed
                ? isChinese ? "重试" : "Retry"
                : isChinese ? "发送给 Codex" : "Send to Codex"}
          </button>
        </div>
      </form>
    </section>
  );
}
