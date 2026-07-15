import type { Language } from "../../shared/contracts";

export interface CodexQuestionContext {
  courseId: string;
  contentVersion: string;
  lessonId: string;
  sectionHeading: string;
  language: Language;
  selectedText: string;
  question: string;
}

export function formatCodexQuestion(context: CodexQuestionContext): string {
  return [
    `Course: ${context.courseId} ${context.contentVersion}`,
    `Lesson: ${context.lessonId}`,
    `Section: ${context.sectionHeading}`,
    `Language: ${context.language}`,
    "",
    "Selected material:",
    context.selectedText,
    "",
    "Learner question:",
    context.question.trim(),
  ].join("\n");
}
