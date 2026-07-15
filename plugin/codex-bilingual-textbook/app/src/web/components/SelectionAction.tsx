import type { CSSProperties } from "react";

import type { Language } from "../../shared/contracts";
import type { LessonSelection } from "../selection/extract-selection";

interface SelectionActionProps {
  language: Language;
  selection: LessonSelection;
  onAsk: () => void;
}

export function SelectionAction({
  language,
  selection,
  onAsk,
}: SelectionActionProps) {
  const style = {
    "--selection-center": `${selection.rect.left + selection.rect.width / 2}px`,
    "--selection-bottom": `${selection.rect.bottom}px`,
  } as CSSProperties;

  return (
    <button
      className="selection-action"
      type="button"
      style={style}
      onClick={onAsk}
    >
      {language === "zh" ? "问 Codex" : "Ask Codex"}
    </button>
  );
}
