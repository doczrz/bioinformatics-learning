import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Express } from "express";
import { z } from "zod";

import type { ContentStore } from "../shared/contracts";
import { languageSchema } from "../shared/schemas";
import type { CourseUpdateService } from "./update/update-service";

export const READER_URI = "ui://codex-bilingual-textbook/reader.html";

const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

interface CourseServerOptions {
  contentStore: ContentStore;
  widgetHtml: string;
  updateService?: CourseUpdateService;
}

function readerMeta() {
  return { ui: { resourceUri: READER_URI } } as const;
}

export function createCourseServer({
  contentStore,
  widgetHtml,
  updateService,
}: CourseServerOptions): McpServer {
  const server = new McpServer({
    name: "codex-bilingual-textbook",
    version: "0.1.0",
  });

  registerAppResource(
    server,
    "Interactive textbook reader",
    READER_URI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      description: "Bilingual interactive textbook reader",
    },
    async () => ({
      contents: [
        {
          uri: READER_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml,
          _meta: {
            ui: {
              csp: {
                connectDomains: [],
                resourceDomains: [],
              },
            },
          },
        },
      ],
    }),
  );

  registerAppTool(
    server,
    "open_course",
    {
      title: "Open bilingual textbook",
      description: "Open the interactive bilingual textbook reader.",
      inputSchema: {
        language: languageSchema.default("zh"),
      },
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: readerMeta(),
    },
    async ({ language }) => {
      const course = await contentStore.getCourse();
      return {
        content: [
          {
            type: "text" as const,
            text: `Opened ${course.title[language]} (content ${course.contentVersion}).`,
          },
        ],
        structuredContent: {
          ...course,
          requestedLanguage: language,
        },
      };
    },
  );

  registerAppTool(
    server,
    "get_lesson",
    {
      title: "Load textbook lesson",
      description: "Load one lesson by stable ID and language.",
      inputSchema: {
        lessonId: z.string(),
        language: languageSchema,
        knownRevision: z.number().int().optional(),
      },
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: readerMeta(),
    },
    async ({ lessonId, language }) => {
      const lesson = await contentStore.getLesson(lessonId, language);
      return {
        content: [
          {
            type: "text" as const,
            text: lesson.translationAvailable
              ? `Loaded lesson ${lesson.lessonId} in ${lesson.language}.`
              : `Lesson ${lesson.lessonId} has no ${lesson.language} translation.`,
          },
        ],
        structuredContent: { ...lesson },
      };
    },
  );

  registerAppTool(
    server,
    "get_dataset_catalog",
    {
      title: "Load external dataset catalog",
      description:
        "Load metadata and authoritative external download links for course datasets.",
      inputSchema: {
        language: languageSchema,
      },
      annotations: {
        ...READ_ONLY_ANNOTATIONS,
        openWorldHint: true,
      },
      _meta: readerMeta(),
    },
    async ({ language }) => {
      const [course, datasets] = await Promise.all([
        contentStore.getCourse(),
        contentStore.getDatasets(language),
      ]);
      return {
        content: [
          {
            type: "text" as const,
            text: `Loaded ${datasets.length} external dataset entr${datasets.length === 1 ? "y" : "ies"}.`,
          },
        ],
        structuredContent: {
          courseId: course.courseId,
          contentVersion: course.contentVersion,
          revision: course.revision,
          language,
          datasets,
        },
      };
    },
  );

  registerAppTool(
    server,
    "check_course_update",
    {
      title: "Check course content update",
      description: "Check the configured public content channel without activating it.",
      inputSchema: {
        currentVersion: z.string(),
        language: languageSchema,
      },
      annotations: {
        ...READ_ONLY_ANNOTATIONS,
        openWorldHint: true,
      },
      _meta: readerMeta(),
    },
    async ({ currentVersion, language }) => {
      const result = updateService
        ? await updateService.checkCourseUpdate(currentVersion, language)
        : {
            configured: false,
            updateAvailable: false,
            currentVersion,
            message: "Online course updates are not configured.",
          };
      return {
        content: [
          {
            type: "text" as const,
            text: result.configured
              ? result.updateAvailable
                ? `Course content ${result.targetVersion} is available.`
                : "Course content is current."
              : result.message ?? "Online course updates are not configured.",
          },
        ],
        structuredContent: { ...result },
      };
    },
  );

  registerAppTool(
    server,
    "apply_course_update",
    {
      title: "Apply verified course content update",
      description:
        "Download, verify, cache, and activate the exact content version confirmed by the learner.",
      inputSchema: {
        expectedCurrentVersion: z.string(),
        targetVersion: z.string(),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
      _meta: readerMeta(),
    },
    async ({ expectedCurrentVersion, targetVersion }) => {
      if (!updateService) {
        throw new Error("Online course updates are not configured.");
      }
      const result = await updateService.applyCourseUpdate(
        expectedCurrentVersion,
        targetVersion,
      );
      return {
        content: [
          {
            type: "text" as const,
            text: result.applied
              ? `Activated course content ${result.contentVersion}.`
              : `Course content ${result.contentVersion} was already active.`,
          },
        ],
        structuredContent: { ...result },
      };
    },
  );

  return server;
}

export function createCourseHttpApp(options: CourseServerOptions): Express {
  const app = createMcpExpressApp();

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.post("/mcp", async (request, response) => {
    const server = createCourseServer(options);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    response.on("close", () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(request, response, request.body);
    } catch (error) {
      console.error("MCP request failed", error);
      if (!response.headersSent) {
        response.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  return app;
}
