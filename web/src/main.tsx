import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { TextbookApp } from "./App";
import { CachedContentProvider } from "./content/cached-content-provider";
import { StaticContentProvider } from "./content/static-content-provider";
import { siteConfigSchema } from "./schemas";
import { BrowserStateStore } from "./state/browser-state-store";
import { NullExecutionRunner } from "./runtime/null-execution-runner";
import { IndexedDbContentCache } from "./updates/indexeddb-content-cache";
import { ContentUpdateService } from "./updates/update-service";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element.");
}

const reactRoot = createRoot(root);

async function start() {
  const configResponse = await fetch(new URL("content/site-config.json", document.baseURI));
  if (!configResponse.ok) {
    throw new Error(`Site configuration request failed (${configResponse.status}).`);
  }
  const siteConfig = siteConfigSchema.parse(await configResponse.json());
  const fallbackProvider = new StaticContentProvider(
    new URL("content/dev/", document.baseURI),
  );
  const cache = new IndexedDbContentCache();
  const contentProvider = new CachedContentProvider(fallbackProvider, cache);
  await contentProvider.refresh();
  const course = await contentProvider.getCourse();
  const updateService = new ContentUpdateService({
    manifestUrl: siteConfig.contentManifestUrl,
    uiVersion: siteConfig.uiVersion,
    courseId: course.courseId,
    cache,
  });

  reactRoot.render(
    <StrictMode>
      <TextbookApp
        contentProvider={contentProvider}
        stateStore={new BrowserStateStore()}
        updateService={updateService}
        runner={new NullExecutionRunner()}
      />
    </StrictMode>,
  );
}

void start().catch((caught: unknown) => {
  const message = caught instanceof Error ? caught.message : "The textbook could not be opened.";
  reactRoot.render(
    <main className="connection-state" role="alert">
      {message}
    </main>,
  );
});
