import { isLanguage, type Language } from "./contracts";

export function languageInUrl(search: string) {
  const value = new URLSearchParams(search).get("lang");
  return isLanguage(value) ? value : null;
}

export function readingHref(lessonId: string | null, language: Language, search = "") {
  const query = new URLSearchParams(search);
  if (lessonId) query.set("lesson", lessonId);
  else query.delete("lesson");
  query.set("lang", language);
  return `?${query.toString()}`;
}
