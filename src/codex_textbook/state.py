from dataclasses import dataclass, replace
from datetime import datetime, timezone
import json
import os
from pathlib import Path

from .models import ProgressStatus


VALID = {"not_started", "in_progress", "completed"}


@dataclass(frozen=True)
class CourseState:
    language: str
    last_lesson_id: str | None
    progress: dict[str, ProgressStatus]


def _load_json(path: Path, default: dict) -> dict:
    if not path.exists():
        return default.copy()
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(value, dict):
            raise ValueError("state must be an object")
        return value
    except (OSError, ValueError):
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
        backup = path.with_name(f"{path.stem}.corrupt-{stamp}{path.suffix}")
        path.replace(backup)
        return default.copy()


def load_state(root: Path, default_language: str) -> CourseState:
    state_dir = root / ".course-state"
    progress_raw = _load_json(state_dir / "progress.json", {})
    prefs = _load_json(state_dir / "preferences.json", {})
    progress = {key: value for key, value in progress_raw.items() if value in VALID}
    language = prefs.get("language", default_language)
    if language not in {"zh", "en"}:
        language = default_language
    return CourseState(language, prefs.get("last_lesson_id"), progress)


def _atomic_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    os.replace(temp, path)


def save_state(root: Path, state: CourseState) -> None:
    state_dir = root / ".course-state"
    _atomic_json(state_dir / "progress.json", state.progress)
    _atomic_json(
        state_dir / "preferences.json",
        {
            "language": state.language,
            "last_lesson_id": state.last_lesson_id,
        },
    )
    for name in ("update-cache.json", "download-records.json"):
        path = state_dir / name
        if not path.exists():
            _atomic_json(path, {})


def set_lesson_status(
    state: CourseState, lesson_id: str, status: ProgressStatus
) -> CourseState:
    if status not in VALID:
        raise ValueError(f"invalid progress status: {status}")
    progress = dict(state.progress)
    progress[lesson_id] = status
    return replace(state, last_lesson_id=lesson_id, progress=progress)


def set_language(state: CourseState, language: str) -> CourseState:
    if language not in {"zh", "en"}:
        raise ValueError("language must be zh or en")
    return replace(state, language=language)
