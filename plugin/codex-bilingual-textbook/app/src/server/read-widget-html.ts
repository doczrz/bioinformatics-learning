import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDirectory, "..", "..");

export function readWidgetHtml(distDirectory = path.join(appRoot, "dist")): string {
  for (const fileName of ["reader.html", "index.html"]) {
    const filePath = path.join(distDirectory, fileName);
    if (existsSync(filePath)) {
      return readFileSync(filePath, "utf8");
    }
  }

  throw new Error(
    'Widget HTML was not found. Run "pnpm run build" before starting the server.',
  );
}
