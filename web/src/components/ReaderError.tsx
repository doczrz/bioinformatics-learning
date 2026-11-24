import type { Language } from "../contracts";
import { messages } from "../i18n";

export type ReaderProblem = {
  reason: "courseError" | "lessonError" | "checkError" | "applyError";
  detail?: string;
};

export function readerProblem(reason: ReaderProblem["reason"], error: unknown): ReaderProblem {
  return { reason, detail: error instanceof Error ? error.message : undefined };
}

export function ReaderError({ problem, language }: { problem: ReaderProblem; language: Language }) {
  const t = messages[language];
  return (
    <div className="inline-error" role="alert">
      <p>{t[problem.reason]}</p>
      {problem.detail && <details><summary>{t.details}</summary><p>{problem.detail}</p></details>}
    </div>
  );
}
