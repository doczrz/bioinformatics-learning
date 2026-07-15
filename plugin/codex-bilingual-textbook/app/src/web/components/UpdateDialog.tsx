import type { Language, UpdateCheckResult } from "../../shared/contracts";

interface UpdateDialogProps {
  language: Language;
  result: UpdateCheckResult;
  applying: boolean;
  error: string | null;
  onClose: () => void;
  onApply: (targetVersion: string) => Promise<void>;
}

function formatBytes(bytes: number, language: Language): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = units[0];
  for (let index = 1; value >= 1024 && index < units.length; index += 1) {
    value /= 1024;
    unit = units[index];
  }
  return `${new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en", {
    maximumFractionDigits: 1,
  }).format(value)} ${unit}`;
}

export function UpdateDialog({
  language,
  result,
  applying,
  error,
  onClose,
  onApply,
}: UpdateDialogProps) {
  const isChinese = language === "zh";
  const canApply =
    result.configured &&
    result.updateAvailable &&
    result.compatible &&
    Boolean(result.targetVersion);

  return (
    <div className="dialog-backdrop">
      <section
        className="update-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={isChinese ? "教材内容更新" : "Course content update"}
      >
        <div className="update-dialog-heading">
          <div>
            <span className="section-eyebrow">CONTENT RELEASE</span>
            <h2>{isChinese ? "教材内容更新" : "Course content update"}</h2>
          </div>
          <button type="button" className="composer-close" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">{isChinese ? "关闭" : "Close"}</span>
          </button>
        </div>

        {error ? null : !result.configured ? (
          <p>{isChinese ? "尚未配置在线内容仓库。" : "Online course updates are not configured."}</p>
        ) : !result.updateAvailable ? (
          <p>{isChinese ? "当前已经是最新版本。" : "The course is already up to date."}</p>
        ) : (
          <>
            <dl className="release-facts">
              <div>
                <dt>{isChinese ? "目标版本" : "Target version"}</dt>
                <dd>{result.targetVersion}</dd>
              </div>
              <div>
                <dt>{isChinese ? "下载大小" : "Download size"}</dt>
                <dd>{formatBytes(result.downloadBytes ?? 0, language)}</dd>
              </div>
              <div>
                <dt>{isChinese ? "兼容性" : "Compatibility"}</dt>
                <dd>
                  {result.compatible
                    ? isChinese ? "兼容" : "Compatible"
                    : isChinese
                      ? `需要插件 ${result.minimumPluginVersion} 或更高版本`
                      : `Plugin update required (${result.minimumPluginVersion} or newer)`}
                </dd>
              </div>
            </dl>
            <div className="release-summary">
              <h3>{isChinese ? "更新摘要" : "Release summary"}</h3>
              <p lang="zh-CN">{result.summary?.zh}</p>
              <p lang="en">{result.summary?.en}</p>
            </div>
          </>
        )}

        {error ? <p className="composer-error" role="alert">{error}</p> : null}
        <div className="composer-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            {isChinese ? "关闭" : "Close"}
          </button>
          {canApply ? (
            <button
              type="button"
              className="primary-button"
              disabled={applying}
              onClick={() => void onApply(result.targetVersion!)}
            >
              {applying
                ? isChinese ? "正在验证并更新…" : "Verifying and updating…"
                : isChinese
                  ? `更新到 ${result.targetVersion}`
                  : `Update to ${result.targetVersion}`}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
