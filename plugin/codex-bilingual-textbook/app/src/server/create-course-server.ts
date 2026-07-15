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
}

function readerMeta() {
  return { ui: { resourceUri: READER_URI } } as const;
}

export function createCourseServer({
  contentStore,
  widgetHtml,
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
