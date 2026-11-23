import { useEffect, useRef, useState } from "react";
import type { Language } from "../contracts";

export function LessonFigure({ src, alt, language }: { src: string; alt: string; language: Language }) {
  const zh = language === "zh";
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [actualSize, setActualSize] = useState(false);
  const action = zh ? "放大查看" : "Enlarge figure";

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
  }, [open]);

  return (
    <figure className="lesson-figure">
      <button className="lesson-figure-open" type="button" aria-haspopup="dialog"
        onClick={() => { setActualSize(false); setOpen(true); }}>
        <img src={src} alt={alt} />
        <span className="lesson-figure-hint">{action} <span aria-hidden="true">⤢</span></span>
      </button>
      {open && (
        <dialog className="lesson-figure-dialog" ref={dialog} aria-label={zh ? "插图查看器" : "Figure viewer"}
          onClose={() => setOpen(false)}>
          <div className="lesson-figure-tools">
            <button type="button" aria-pressed={actualSize} onClick={() => setActualSize(!actualSize)}>
              {zh ? "原始大小" : "Actual size"} · 100%
            </button>
            <button type="button" onClick={() => dialog.current?.close()} autoFocus>
              {zh ? "关闭" : "Close"}
            </button>
          </div>
          <div className={`lesson-figure-canvas${actualSize ? " is-actual" : ""}`} tabIndex={0}
            role="region" aria-label={zh ? "插图" : "Figure"}>
            <img src={src} alt={alt} />
          </div>
        </dialog>
      )}
    </figure>
  );
}
