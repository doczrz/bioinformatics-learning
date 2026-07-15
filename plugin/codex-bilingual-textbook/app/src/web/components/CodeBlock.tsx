import { useState } from "react";
import type { Language } from "../../shared/contracts";

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
  const [copied, setCopied] = useState(false);
  const isChinese = interfaceLanguage === "zh";

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{languageLabel || "text"}</span>
        <button type="button" onClick={copyCode} aria-label={isChinese ? "复制代码" : "Copy code"}>
          {copied ? (isChinese ? "已复制" : "Copied") : isChinese ? "复制" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
