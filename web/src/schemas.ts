import { z } from "zod";
import { LANGUAGES } from "./contracts";

export const languageSchema = z.enum(LANGUAGES);

const translatedTitleSchema = z.object({
  zh: z.string().min(1),
  en: z.string().min(1),
  nl: z.string().min(1).optional(),
  fr: z.string().min(1).optional(),
  es: z.string().min(1).optional(),
  de: z.string().min(1).optional(),
});

export const lessonSummarySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().nonnegative(),
  number: z.string().regex(/^\d+(?:\.\d+)*$/).optional(),
  title: translatedTitleSchema,
});

export const datasetEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: translatedTitleSchema,
  sourceUrl: z.string().url(),
  sizeBytes: z.number().int().nonnegative().optional(),
  license: z.string().min(1).optional(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
});

export const courseFileSchema = z.object({
  schemaVersion: z.literal(1),
  courseId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  revision: z.number().int().nonnegative(),
  defaultLanguage: languageSchema,
  languages: languageSchema.array().min(1).default(["zh", "en"]),
  title: translatedTitleSchema,
  lessons: z.array(lessonSummarySchema).min(1),
  datasets: z.array(datasetEntrySchema).default([]),
}).superRefine((course, context) => {
  if (!course.languages.includes(course.defaultLanguage) ||
      new Set(course.languages).size !== course.languages.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["languages"],
      message: "List each course language once, including the default language." });
  }
  const titles = [course.title, ...course.lessons.map((lesson) => lesson.title),
    ...course.datasets.map((dataset) => dataset.title)];
  for (const language of course.languages) {
    if (titles.some((title) => !title[language]?.trim())) {
      context.addIssue({ code: z.ZodIssueCode.custom,
        message: `Missing course, lesson or dataset title in ${language}.` });
    }
  }
});

export const siteConfigSchema = z.object({
  uiVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  contentManifestUrl: z.string().url().nullable(),
});

export const contentReleaseAssetSchema = z.object({
  path: z.string().min(1),
  url: z.string().url(),
  sizeBytes: z.number().int().nonnegative(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
});

export const contentReleaseManifestSchema = z.object({
  schemaVersion: z.literal(1),
  courseId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  releaseTag: z.string().min(1),
  commitSha: z.string().regex(/^[a-f0-9]{40}$/),
  minimumUiVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  summary: translatedTitleSchema,
  assets: z.array(contentReleaseAssetSchema).min(1),
});

export type CourseFile = z.infer<typeof courseFileSchema>;
