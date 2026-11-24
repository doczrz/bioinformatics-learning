import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { contentVersion } from "../public/content/dev/course.json";
import { TextbookApp } from "./App";
import { ReaderError, readerProblem } from "./components/ReaderError";
import { messages } from "./i18n";
import { languageInUrl } from "./reader-location";
import { CachedContentProvider } from "./content/cached-content-provider";
import { StaticContentProvider } from "./content/static-content-provider";
import { siteConfigSchema } from "./schemas";
import { BrowserStateStore } from "./state/browser-state-store";
import { IndexedDbContentCache } from "./updates/indexeddb-content-cache";
import { ContentUpdateService } from "./updates/update-service";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element.");
}

const reactRoot = createRoot(root);

async function createReaderServices() {
  const contentRoot = new URL("content/dev/", document.baseURI);
  if (import.meta.env.MODE === "pages") {
    return { contentProvider: new StaticContentProvider(contentRoot, undefined, contentVersion) };
  }

  const configResponse = await fetch(new URL("content/site-config.json", document.baseURI));
  if (!configResponse.ok) {
    throw new Error(`Site configuration request failed (${configResponse.status}).`);
  }
  const siteConfig = siteConfigSchema.parse(await configResponse.json());
  const fallbackProvider = new StaticContentProvider(contentRoot);
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
  return { contentProvider, updateService };
}

async function start() {
  const services = await createReaderServices();
  reactRoot.render(
    <StrictMode>
      <TextbookApp
        {...services}
        stateStore={new BrowserStateStore()}
      />
    </StrictMode>,
  );
}

void start().catch((caught: unknown) => {
  let language = languageInUrl(window.location.search);
  if (!language) {
    try {
      language = new BrowserStateStore().read().language;
    } catch {
      language = "en";
    }
  }
  document.documentElement.lang = language;
  document.title = `Biolearning · ${messages[language].textbook}`;
  reactRoot.render(
    <main className="connection-state" aria-label={messages[language].textbook}>
      <ReaderError problem={readerProblem("courseError", caught)} language={language} />
    </main>,
  );
});
