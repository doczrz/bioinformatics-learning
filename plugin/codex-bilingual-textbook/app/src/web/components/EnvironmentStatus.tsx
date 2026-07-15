import type { Language } from "../../shared/contracts";

export function EnvironmentStatus({ language }: { language: Language }) {
  const isChinese = language === "zh";
  const later = isChinese ? "后续开放" : "Later";
  const localR = isChinese ? "本地 R" : "Local R";
  const localPython = isChinese ? "本地 Python" : "Local Python";
  return (
    <section className="environment-status" aria-labelledby="environment-title">
      <h2 id="environment-title">{isChinese ? "环境" : "Environments"}</h2>
      <button type="button" disabled aria-label={`${localR} — ${later}`}>
        <span>{localR}</span>
        <small>{later}</small>
      </button>
      <button type="button" disabled aria-label={`${localPython} — ${later}`}>
        <span>{localPython}</span>
        <small>{later}</small>
      </button>
      <button type="button" disabled aria-label={`SSH/HPC — ${later}`}>
        <span>SSH/HPC</span>
        <small>{later}</small>
      </button>
    </section>
  );
}
