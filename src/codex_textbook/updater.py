from collections.abc import Callable
from datetime import datetime, timezone
from pathlib import Path
from subprocess import CompletedProcess
import subprocess
import urllib.error
import urllib.request

import yaml

from .manifest import load_course_manifest
from .render import UpdateViewState


class UpdateError(RuntimeError):
    pass


def _version(value: str) -> tuple[int, int, int]:
    try:
        parts = tuple(int(part) for part in value.split("."))
    except ValueError as exc:
        raise UpdateError(f"invalid version: {value}") from exc
    if len(parts) != 3:
        raise UpdateError(f"invalid version: {value}")
    return parts


def _default_fetch(url: str) -> str:
    with urllib.request.urlopen(url, timeout=15) as response:
        return response.read().decode("utf-8")


def check_update(
    root: Path,
    fetch_text: Callable[[str], str] | None = None,
) -> UpdateViewState:
    manifest = load_course_manifest(root / "course-manifest.yml")
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    url = manifest.course.remote_manifest_url
    if not url:
        return UpdateViewState(
            "unknown", manifest.course.version, None, now, (), (), None
        )
    try:
        raw = (fetch_text or _default_fetch)(url)
        data = yaml.safe_load(raw)
        latest = str(data["course"]["version"])
        raw_changes = data.get("changes", {})
        changes_zh = tuple(str(item) for item in raw_changes.get("zh", []))
        changes_en = tuple(str(item) for item in raw_changes.get("en", []))
    except (OSError, KeyError, TypeError, yaml.YAMLError, urllib.error.URLError) as exc:
        return UpdateViewState(
            "offline", manifest.course.version, None, now, (), (), str(exc)
        )
    kind = (
        "available"
        if _version(latest) > _version(manifest.course.version)
        else "current"
    )
    return UpdateViewState(
        kind,
        manifest.course.version,
        latest,
        now,
        changes_zh,
        changes_en,
        None,
    )


def _snapshot(root: Path) -> dict[str, bytes]:
    snapshot: dict[str, bytes] = {}
    for base in (root / ".course-state", root / "my-notes"):
        if not base.exists():
            continue
        for path in sorted(item for item in base.rglob("*") if item.is_file()):
            snapshot[str(path.relative_to(root))] = path.read_bytes()
    return snapshot


def _restore(root: Path, snapshot: dict[str, bytes]) -> None:
    protected = (root / ".course-state", root / "my-notes")
    expected = {root / relative for relative in snapshot}
    for base in protected:
        if base.exists():
            for path in sorted(
                (item for item in base.rglob("*") if item.is_file()), reverse=True
            ):
                if path not in expected:
                    path.unlink()
    for relative, content in snapshot.items():
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)


def apply_update(
    root: Path,
    confirm_version: str,
    run: Callable[..., CompletedProcess[str]] | None = None,
) -> UpdateViewState:
    runner = run or subprocess.run
    status = runner(
        ["git", "status", "--porcelain", "--untracked-files=no"],
        cwd=root,
        text=True,
        capture_output=True,
        check=True,
    )
    if status.stdout.strip():
        raise UpdateError("tracked files have local changes; review them before updating")

    available = check_update(root)
    if available.kind != "available" or not available.latest_version:
        raise UpdateError("no confirmed update is available")
    if confirm_version != available.latest_version:
        raise UpdateError(
            "confirmation version does not match the available version"
        )

    before = _snapshot(root)
    runner(
        ["git", "pull", "--ff-only"],
        cwd=root,
        text=True,
        capture_output=True,
        check=True,
    )
    installed = load_course_manifest(root / "course-manifest.yml").course.version
    if installed != confirm_version:
        raise UpdateError(
            f"installed version {installed} does not match {confirm_version}"
        )
    after = _snapshot(root)
    if after != before:
        _restore(root, before)
        raise UpdateError("protected user data changed during update and was restored")
    return UpdateViewState(
        "current",
        installed,
        installed,
        datetime.now(timezone.utc).isoformat(timespec="seconds"),
        available.changes_zh,
        available.changes_en,
        None,
    )
