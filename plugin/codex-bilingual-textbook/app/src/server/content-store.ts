import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  ContentStore,
  CourseIndex,
  DatasetEntry,
  Language,
  LessonPayload,
} from "../shared/contracts";
import { courseFileSchema, type CourseFile } from "../shared/schemas";

const LESSON_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isMissingFile(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function sectionId(heading: string, position: number): string {
  const slug = heading
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || `section-${position + 1}`;
}

function parseSections(markdown: string): Array<{ id: string; heading: string }> {
  const sections: Array<{ id: string; heading: string }> = [];
  const counts = new Map<string, number>();

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^(?:#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const heading = match[1].trim();
    const baseId = sectionId(heading, sections.length);
    const count = (counts.get(baseId) ?? 0) + 1;
    counts.set(baseId, count);
    sections.push({
      id: count === 1 ? baseId : `${baseId}-${count}`,
      heading,
    });
  }

  return sections;
}

export class FileContentStore implements ContentStore {
  private readonly root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  private async readCourseFile(): Promise<CourseFile> {
    const raw = await readFile(path.join(this.root, "course.json"), "utf8");
    return courseFileSchema.parse(JSON.parse(raw));
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
    const lesson = course.lessons.find((candidate) => candidate.id === lessonId);
    if (!lesson) {
      throw new Error(`Unknown lesson ID: ${lessonId}`);
    }

    let markdown = "";
    let translationAvailable = true;
    try {
      markdown = await readFile(
        path.join(this.root, "lessons", `${lessonId}.${language}.md`),
        "utf8",
      );
    } catch (error) {
      if (!isMissingFile(error)) {
        throw error;
      }
      translationAvailable = false;
    }

    return {
      courseId: course.courseId,
      contentVersion: course.contentVersion,
      revision: course.revision,
      lessonId,
      language,
      translationAvailable,
      title: lesson.title[language],
      markdown,
      sections: translationAvailable ? parseSections(markdown) : [],
    };
  }

  async getDatasets(language: Language): Promise<DatasetEntry[]> {
    void language;
    const course = await this.readCourseFile();
    return course.datasets;
  }
}
