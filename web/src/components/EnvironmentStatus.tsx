import type { Language } from "../contracts";

export function EnvironmentStatus({ language }: { language: Language }) {
  const isChinese = language === "zh";
  const reserved = isChinese ? "待接入" : "Reserved";
  const localR = isChinese ? "本地 R" : "Local R";
  const localPython = isChinese ? "本地 Python" : "Local Python";

  return (
    <section className="environment-status" aria-labelledby="environment-title">
      <h2 id="environment-title">{isChinese ? "环境" : "Environments"}</h2>
      <button type="button" disabled aria-label={`${localR} — ${reserved}`}>
        <span>{localR}</span>
        <small>{reserved}</small>
      </button>
      <button type="button" disabled aria-label={`${localPython} — ${reserved}`}>
        <span>{localPython}</span>
        <small>{reserved}</small>
      </button>
      <button type="button" disabled aria-label={`SSH/HPC — ${reserved}`}>
        <span>SSH/HPC</span>
        <small>{reserved}</small>
      </button>
    </section>
  );
}
