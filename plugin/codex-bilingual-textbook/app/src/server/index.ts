import path from "node:path";
import { fileURLToPath } from "node:url";

import { FileContentStore } from "./content-store";
import { createCourseHttpApp } from "./create-course-server";
import { readWidgetHtml } from "./read-widget-html";
import { ActiveContentStore, CacheStore } from "./update/cache-store";
import { UpdateService } from "./update/update-service";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDirectory, "..", "..");
const port = Number.parseInt(process.env.PORT ?? "8000", 10);
const cacheStore = new CacheStore(
  process.env.COURSE_CACHE_DIR ?? path.join(appRoot, ".course-cache"),
);
const contentStore = new ActiveContentStore(
  cacheStore,
  new FileContentStore(path.join(appRoot, "content", "dev")),
);
const updateService = new UpdateService({
  latestManifestUrl: process.env.COURSE_LATEST_MANIFEST_URL,
  pluginVersion: "0.1.0",
  cacheStore,
});

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`Invalid PORT: ${process.env.PORT ?? "8000"}`);
}

const app = createCourseHttpApp({
  contentStore,
  updateService,
  widgetHtml: readWidgetHtml(),
});

app.listen(port, () => {
  console.log(`Textbook MCP server listening on http://localhost:${port}/mcp`);
});
