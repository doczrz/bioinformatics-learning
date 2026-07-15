import type {
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
} from "../contracts";
import { courseFileSchema, type CourseFile } from "../schemas";
import type { ContentProvider } from "./content-provider";
import { parseSections } from "./markdown";

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const LESSON_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function safeAssetPath(value: string): string {
  const normalized = value.replace(/\\/g, "/");
  if (
    normalized.startsWith("/") ||
    normalized.split("/").some((part) => part === "" || part === "..") ||
    /^[a-z][a-z0-9+.-]*:/i.test(normalized)
  ) {
    throw new Error(`Unsafe asset path: ${value}`);
  }
  return normalized;
}

export class StaticContentProvider implements ContentProvider {
  private readonly root: URL;
  private readonly fetcher: Fetcher;

  constructor(baseUrl: string | URL, fetcher: Fetcher = fetch) {
    this.root = new URL("./", baseUrl);
    this.fetcher = fetcher;
  }

  private async readCourseFile(): Promise<CourseFile> {
    const response = await this.fetcher(new URL("course.json", this.root));
    if (!response.ok) {
      throw new Error(`Course index request failed (${response.status}).`);
    }
    return courseFileSchema.parse(await response.json());
  }

  async getCourse(): Promise<CourseIndex> {
    const course = await this.readCourseFile();
    return {
      schemaVersion: course.schemaVersion,
      courseId: course.courseId,
      contentVersion: course.contentVersion,
      revision: course.revision,
      defaultLanguage: course.defaultLanguage,
      title: course.title,
      lessons: [...course.lessons].sort((left, right) => left.order - right.order),
      environments: [
        { id: "local-r", status: "reserved" },
        { id: "local-python", status: "reserved" },
        { id: "ssh-hpc", status: "reserved" },
      ],
    };
  }

  async getLesson(
    lessonId: string,
    language: Language,
  ): Promise<LessonPayload> {
    if (!LESSON_ID.test(lessonId)) {
      throw new Error(`Invalid lesson ID: ${lessonId}`);
    }
    const course = await this.readCourseFile();
    const summary = course.lessons.find((lesson) => lesson.id === lessonId);
    if (!summary) throw new Error(`Unknown lesson ID: ${lessonId}`);

    const response = await this.fetcher(
      new URL(`lessons/${lessonId}.${language}.md`, this.root),
    );
    if (response.status === 404) {
      return {
        courseId: course.courseId,
        contentVersion: course.contentVersion,
        revision: course.revision,
        lessonId,
        language,
        translationAvailable: false,
        title: summary.title[language],
        markdown: "",
        sections: [],
      };
    }
    if (!response.ok) {
      throw new Error(`Lesson request failed (${response.status}).`);
    }
    const markdown = await response.text();
    return {
      courseId: course.courseId,
      contentVersion: course.contentVersion,
      revision: course.revision,
      lessonId,
      language,
      translationAvailable: true,
      title: summary.title[language],
      markdown,
      sections: parseSections(markdown),
    };
  }

  async getDatasets(_language: Language): Promise<DatasetEntry[]> {
    return (await this.readCourseFile()).datasets;
  }

  resolveAssetUrl(path: string): string {
    return new URL(safeAssetPath(path), this.root).href;
  }

  async refresh(): Promise<void> {}
}
