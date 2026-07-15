import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { TextbookApp } from "./App";
import { StaticContentProvider } from "./content/static-content-provider";
import { siteConfigSchema } from "./schemas";
import { BrowserStateStore } from "./state/browser-state-store";

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
  siteConfigSchema.parse(await configResponse.json());
  const contentProvider = new StaticContentProvider(
    new URL("content/dev/", document.baseURI),
  );

  reactRoot.render(
    <StrictMode>
      <TextbookApp
        contentProvider={contentProvider}
        stateStore={new BrowserStateStore()}
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
