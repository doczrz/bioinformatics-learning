import type { Language, UpdateCheckResult } from "../contracts";
import { formatBytes, messages } from "../i18n";

import { ReaderError, type ReaderProblem } from "./ReaderError";

interface UpdateDialogProps {
  language: Language;
  result: UpdateCheckResult;
  applying?: boolean;
  error?: ReaderProblem | null;
  onClose: () => void;
  onApply?: (targetVersion: string) => Promise<void>;
}

export function UpdateDialog({
  language,
  result,
  applying = false,
  error = null,
  onClose,
  onApply,
}: UpdateDialogProps) {
  const t = messages[language];
  const canApply =
    result.configured &&
    result.updateAvailable &&
    result.compatible &&
    Boolean(result.targetVersion) &&
    Boolean(onApply);

  return (
    <div className="dialog-backdrop">
      <section
        className="update-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t.contentUpdate}
      >
        <div className="update-dialog-heading">
          <div>
            <h2>{t.contentUpdate}</h2>
          </div>
          <button type="button" className="dialog-close" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">{t.close}</span>
          </button>
        </div>

        {error ? null : !result.configured ? (
          <p>{t.updatesNotConfigured}</p>
        ) : !result.updateAvailable ? (
          <p>{t.upToDate}</p>
        ) : (
          <>
            <dl className="release-facts">
              <div>
                <dt>{t.targetVersion}</dt>
                <dd>{result.targetVersion}</dd>
              </div>
              <div>
                <dt>{t.downloadSize}</dt>
                <dd>{formatBytes(result.downloadBytes ?? 0, language)}</dd>
              </div>
              <div>
                <dt>{t.compatibility}</dt>
                <dd>
                  {result.compatible
                    ? t.compatible
                    : t.needsVersion.replace("{n}", result.minimumUiVersion ?? "")}
                </dd>
              </div>
            </dl>
            <div className="release-summary">
              <h3>{t.releaseSummary}</h3>
              <p lang={result.summary?.[language] ? language : "en"}>{result.summary?.[language] ?? result.summary?.en}</p>
            </div>
          </>
        )}

        {error ? <ReaderError problem={error} language={language} /> : null}
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            {t.close}
          </button>
          {canApply ? (
            <button
              type="button"
              className="primary-button"
              disabled={applying}
              onClick={() => void onApply?.(result.targetVersion!)}
            >
              {applying
                ? t.updating
                : t.updateTo.replace("{n}", result.targetVersion!)}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
