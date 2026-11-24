import { useEffect, useRef, useState } from "react";
import type { Language } from "../contracts";
import { messages } from "../i18n";

export function LessonFigure({ src, alt, language }: { src: string; alt: string; language: Language }) {
  const t = messages[language];
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [actualSize, setActualSize] = useState(false);

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

  return (
    <figure className="lesson-figure">
      <button className="lesson-figure-open" type="button" aria-haspopup="dialog"
        onClick={() => { setActualSize(false); setOpen(true); }}>
        <img src={src} alt={alt} />
        <span className="lesson-figure-hint">{t.enlarge} <span aria-hidden="true">⤢</span></span>
      </button>
      {open && (
        <dialog className="lesson-figure-dialog" ref={dialog} aria-label={t.figureViewer}
          onClose={() => setOpen(false)}>
          <div className="lesson-figure-tools">
            <button type="button" aria-pressed={actualSize} onClick={() => setActualSize(!actualSize)}>
              {t.actualSize} · 100%
            </button>
            <button type="button" onClick={() => dialog.current?.close()} autoFocus>
              {t.close}
            </button>
          </div>
          <div className={`lesson-figure-canvas${actualSize ? " is-actual" : ""}`} tabIndex={0}
            role="region" aria-label={t.figure}>
            <img src={src} alt={alt} />
          </div>
        </dialog>
      )}
    </figure>
  );
}
