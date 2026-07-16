import { z } from "zod";

export const languageSchema = z.enum(["zh", "en"]);

const translatedTitleSchema = z.object({
  zh: z.string().min(1),
  en: z.string().min(1),
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
  title: translatedTitleSchema,
  lessons: z.array(lessonSummarySchema).min(1),
  datasets: z.array(datasetEntrySchema).default([]),
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
