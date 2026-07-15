import { z } from "zod";

export const languageSchema = z.enum(["zh", "en"]);

const translatedTitleSchema = z.object({
  zh: z.string().min(1),
  en: z.string().min(1),
});

export const lessonSummarySchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().nonnegative(),
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
  contentVersion: z.string().min(1),
  revision: z.number().int().nonnegative(),
  defaultLanguage: languageSchema,
  title: translatedTitleSchema,
  lessons: z.array(lessonSummarySchema),
  datasets: z.array(datasetEntrySchema).default([]),
});

export const contentReleaseManifestSchema = z.object({
  schemaVersion: z.literal(1),
  courseId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contentVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  releaseTag: z.string().min(1),
  commitSha: z.string().regex(/^[a-f0-9]{40}$/),
  minimumPluginVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  summary: translatedTitleSchema,
  assets: z.array(
    z.object({
      path: z.string().min(1),
      url: z.string().url(),
      sizeBytes: z.number().int().nonnegative(),
      sha256: z.string().regex(/^[a-f0-9]{64}$/),
    }),
  ).min(1),
});

export type CourseFile = z.infer<typeof courseFileSchema>;
