import path from "node:path";
import { fileURLToPath } from "node:url";

import { FileContentStore } from "./content-store";
import { createCourseHttpApp } from "./create-course-server";
import { readWidgetHtml } from "./read-widget-html";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDirectory, "..", "..");
const port = Number.parseInt(process.env.PORT ?? "8000", 10);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error(`Invalid PORT: ${process.env.PORT ?? "8000"}`);
}

const app = createCourseHttpApp({
  contentStore: new FileContentStore(path.join(appRoot, "content", "dev")),
  widgetHtml: readWidgetHtml(),
});

app.listen(port, () => {
  console.log(`Textbook MCP server listening on http://localhost:${port}/mcp`);
});
