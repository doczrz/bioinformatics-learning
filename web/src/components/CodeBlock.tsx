import { useState } from "react";

import type { Language } from "../contracts";
import { messages } from "../i18n";

interface CodeBlockProps {
  code: string;
  languageLabel: string;
  interfaceLanguage: Language;
}

export function CodeBlock({
  code,
  languageLabel,
  interfaceLanguage,
}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const t = messages[interfaceLanguage];

  async function writeWithClipboardApi() {
    const clipboard = navigator.clipboard;
    if (!clipboard?.writeText) throw new Error("Clipboard API is unavailable.");
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new Error("Clipboard API timed out.")),
        800,
      );
      clipboard.writeText(code).then(
        () => {
          window.clearTimeout(timeout);
          resolve();
        },
        (error: unknown) => {
          window.clearTimeout(timeout);
          reject(error);
        },
      );
    });
  }

  function writeWithSelectionFallback() {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    textarea.readOnly = true;
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.inset = "-9999px auto auto -9999px";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) throw new Error("Browser copy command failed.");
  }

  async function copyCode() {
    try {
      try {
        await writeWithClipboardApi();
      } catch {
        writeWithSelectionFallback();
      }
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 1200);
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{!languageLabel || languageLabel === "text" ? t.text : languageLabel}</span>
        <button
          type="button"
          onClick={() => void copyCode()}
          aria-label={t.copyCode}
        >
          {copyState === "copied"
            ? t.copied
            : copyState === "failed"
              ? t.copyFailed
              : t.copy}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
