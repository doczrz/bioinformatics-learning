import type { DatasetEntry, Language } from "../contracts";
import { formatBytes, messages } from "../i18n";

interface DatasetPanelProps {
  datasets: DatasetEntry[];
  language: Language;
}

export function DatasetPanel({ datasets, language }: DatasetPanelProps) {
  if (datasets.length === 0) return null;
  const t = messages[language];

  return (
    <section className="dataset-panel" aria-labelledby="dataset-heading">
      <h2 id="dataset-heading">{t.externalData}</h2>
      <div className="dataset-list">
        {datasets.map((dataset) => (
          <article key={dataset.id}>
            <div>
              <strong>{dataset.title[language] ?? dataset.title.en}</strong>
            </div>
            <dl>
              {dataset.license ? (
                <>
                  <dt>{t.license}</dt>
                  <dd>{dataset.license === "See source" ? t.seeSource : dataset.license}</dd>
                </>
              ) : null}
              {dataset.sizeBytes !== undefined ? (
                <>
                  <dt>{t.size}</dt>
                  <dd>{formatBytes(dataset.sizeBytes, language)}</dd>
                </>
              ) : null}
            </dl>
            <a
              className="dataset-link"
              href={dataset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.originalSource}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
