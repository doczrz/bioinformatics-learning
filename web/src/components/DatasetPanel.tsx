import type { DatasetEntry, Language } from "../contracts";

interface DatasetPanelProps {
  datasets: DatasetEntry[];
  language: Language;
}

function formatBytes(value?: number) {
  if (value === undefined) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function DatasetPanel({ datasets, language }: DatasetPanelProps) {
  if (datasets.length === 0) return null;
  const isChinese = language === "zh";

  return (
    <section className="dataset-panel" aria-labelledby="dataset-heading">
      <div>
        <span className="section-eyebrow">DATA</span>
        <h2 id="dataset-heading">{isChinese ? "外部数据" : "External data"}</h2>
      </div>
      <div className="dataset-list">
        {datasets.map((dataset) => (
          <article key={dataset.id}>
            <div>
              <strong>{dataset.title[language]}</strong>
              <code>{dataset.id}</code>
            </div>
            <dl>
              {dataset.license ? (
                <>
                  <dt>{isChinese ? "许可" : "License"}</dt>
                  <dd>{dataset.license}</dd>
                </>
              ) : null}
              {dataset.sizeBytes !== undefined ? (
                <>
                  <dt>{isChinese ? "大小" : "Size"}</dt>
                  <dd>{formatBytes(dataset.sizeBytes)}</dd>
                </>
              ) : null}
            </dl>
            <a
              className="dataset-link"
              href={dataset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isChinese ? "前往原始来源" : "Open original source"}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
