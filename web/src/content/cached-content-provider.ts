import type {
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
} from "../contracts";
import {
  contentReleaseManifestSchema,
  courseFileSchema,
  type CourseFile,
} from "../schemas";
import type { CachedRelease, ContentCache } from "../updates/content-cache";
import type { ContentProvider } from "./content-provider";
import { parseSections } from "./markdown";

const SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function safeAssetPath(value: string): string {
  const normalized = value.replace(/\\/g, "/");
  if (
    normalized.startsWith("/") ||
    normalized.split("/").some((part) => part === "" || part === "." || part === "..") ||
    /^[a-z][a-z0-9+.-]*:/i.test(normalized)
  ) {
    throw new Error(`Unsafe asset path: ${value}`);
  }
  return normalized;
}

function decodeText(bytes: ArrayBuffer): string {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function contentType(path: string): string {
  const extension = path.split(".").at(-1)?.toLowerCase();
  return ({
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  } as Record<string, string>)[extension ?? ""] ?? "application/octet-stream";
}

function compareVersions(left: string, right: string): number {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(
    new Uint8Array(bytes),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function validCachedRelease(
  value: CachedRelease | null,
  crypto: Crypto,
): Promise<{
  release: CachedRelease;
  course: CourseFile;
} | null> {
  if (!value || !value.assets || typeof value.assets !== "object") return null;
  const manifest = contentReleaseManifestSchema.safeParse(value.manifest);
  if (!manifest.success) return null;
  const courseBytes = value.assets["course.json"];
  if (!(courseBytes instanceof ArrayBuffer)) return null;
  try {
    const course = courseFileSchema.parse(JSON.parse(decodeText(courseBytes)));
    if (
      course.courseId !== manifest.data.courseId ||
      course.contentVersion !== manifest.data.contentVersion
    ) {
      return null;
    }
    for (const asset of manifest.data.assets) {
      const bytes = value.assets[asset.path];
      if (!(bytes instanceof ArrayBuffer) || bytes.byteLength !== asset.sizeBytes) {
        return null;
      }
      const digest = hex(await crypto.subtle.digest("SHA-256", bytes));
      if (digest !== asset.sha256) return null;
    }
    return {
      release: { manifest: manifest.data, assets: value.assets },
      course,
    };
  } catch {
    return null;
  }
}

export class CachedContentProvider implements ContentProvider {
  private release: CachedRelease | null = null;
  private course: CourseFile | null = null;
  private initialized = false;
  private readonly blobUrls = new Map<string, string>();

  constructor(
    private readonly fallback: ContentProvider,
    private readonly cache: ContentCache,
    private readonly crypto: Crypto = globalThis.crypto,
  ) {}

  private async ensureReady(): Promise<void> {
    if (!this.initialized) await this.refresh();
  }

  async refresh(): Promise<void> {
    for (const url of this.blobUrls.values()) {
      URL.revokeObjectURL?.(url);
    }
    this.blobUrls.clear();
    this.release = null;
    this.course = null;
    await this.fallback.refresh();
    const fallbackCourse = await this.fallback.getCourse().catch(() => null);
    const candidate = await this.cache.readActive().catch(() => null);
    const valid = await validCachedRelease(candidate, this.crypto);
    if (
      valid &&
      (!fallbackCourse ||
        (valid.course.courseId === fallbackCourse.courseId &&
          compareVersions(valid.course.contentVersion, fallbackCourse.contentVersion) > 0))
    ) {
      this.release = valid.release;
      this.course = valid.course;
    }
    this.initialized = true;
  }

  async getCourse(): Promise<CourseIndex> {
    await this.ensureReady();
    if (!this.course) return this.fallback.getCourse();
    return {
      schemaVersion: this.course.schemaVersion,
      courseId: this.course.courseId,
      contentVersion: this.course.contentVersion,
      revision: this.course.revision,
      defaultLanguage: this.course.defaultLanguage,
      title: this.course.title,
      lessons: [...this.course.lessons].sort((left, right) => left.order - right.order),
      environments: [
        { id: "local-r", status: "reserved" },
        { id: "local-python", status: "reserved" },
        { id: "ssh-hpc", status: "reserved" },
      ],
    };
  }

  async getLesson(lessonId: string, language: Language): Promise<LessonPayload> {
    await this.ensureReady();
    if (!this.course || !this.release) {
      return this.fallback.getLesson(lessonId, language);
    }
    if (!SAFE_ID.test(lessonId)) throw new Error(`Invalid lesson ID: ${lessonId}`);
    const summary = this.course.lessons.find((item) => item.id === lessonId);
    if (!summary) throw new Error(`Unknown lesson ID: ${lessonId}`);
    const bytes = this.release.assets[`lessons/${lessonId}.${language}.md`];
    if (!bytes) {
      return {
        courseId: this.course.courseId,
        contentVersion: this.course.contentVersion,
        revision: this.course.revision,
        lessonId,
        language,
        translationAvailable: false,
        title: summary.title[language],
        markdown: "",
        sections: [],
      };
    }
    const markdown = decodeText(bytes);
    return {
      courseId: this.course.courseId,
      contentVersion: this.course.contentVersion,
      revision: this.course.revision,
      lessonId,
      language,
      translationAvailable: true,
      title: summary.title[language],
      markdown,
      sections: parseSections(markdown),
    };
  }

  async getDatasets(_language: Language): Promise<DatasetEntry[]> {
    await this.ensureReady();
    return this.course ? this.course.datasets : this.fallback.getDatasets(_language);
  }

  resolveAssetUrl(path: string): string {
    if (!this.release) return this.fallback.resolveAssetUrl(path);
    const safePath = safeAssetPath(path.split(/[?#]/, 1)[0]);
    const bytes = this.release.assets[safePath];
    if (!bytes) return this.fallback.resolveAssetUrl(path);
    const existing = this.blobUrls.get(safePath);
    if (existing) return existing;
    const url = URL.createObjectURL(new Blob([bytes], { type: contentType(safePath) }));
    this.blobUrls.set(safePath, url);
    return url;
  }
}
