import { useMemo } from "react";
import {
  useApp,
  useHostStyles,
  type App as McpApp,
} from "@modelcontextprotocol/ext-apps/react";

import type { ReaderState } from "../state/reader-state";

export interface TextbookBridge {
  callTool<T>(name: string, args: Record<string, unknown>): Promise<T>;
  sendMessage(text: string): Promise<void>;
  openLink(url: string): Promise<void>;
  readWidgetState(): ReaderState | null;
  writeWidgetState(state: ReaderState): Promise<void>;
  getHostTheme(): "light" | "dark";
}

interface OpenAiCompatibilityBridge {
  widgetState?: ReaderState;
  setWidgetState?: (state: ReaderState) => Promise<void>;
}

declare global {
  interface Window {
    openai?: OpenAiCompatibilityBridge;
  }
}

let fallbackWidgetState: ReaderState | null = null;

export function createTextbookBridge(app: McpApp | null): TextbookBridge {
  function requireApp(): McpApp {
    if (!app) {
      throw new Error("The textbook is not connected to the host yet.");
    }
    return app;
  }

  return {
    async callTool<T>(name: string, args: Record<string, unknown>) {
      const result = await requireApp().callServerTool({
        name,
        arguments: args,
      });
      if (result.isError) {
        throw new Error(`Course tool failed: ${name}`);
      }
      return result.structuredContent as T;
    },

    async sendMessage(text) {
      const result = await requireApp().sendMessage({
        role: "user",
        content: [{ type: "text", text }],
      });
      if (result.isError) {
        throw new Error("The host did not accept the message.");
      }
    },

    async openLink(url) {
      await requireApp().openLink({ url });
    },

    readWidgetState() {
      return window.openai?.widgetState ?? fallbackWidgetState;
    },

    async writeWidgetState(state) {
      fallbackWidgetState = state;
      await window.openai?.setWidgetState?.(state);
    },

    getHostTheme() {
      return app?.getHostContext()?.theme === "dark" ? "dark" : "light";
    },
  };
}

export function useTextbookBridge() {
  const { app, isConnected, error } = useApp({
    appInfo: { name: "codex-bilingual-textbook", version: "0.1.0" },
    capabilities: {},
  });
  useHostStyles(app, app?.getHostContext());
  const bridge = useMemo(() => createTextbookBridge(app), [app]);
  return { bridge, isConnected, error };
}
