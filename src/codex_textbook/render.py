from dataclasses import dataclass
from pathlib import Path
from string import Template

from .manifest import load_course_manifest, load_dataset_catalog
from .state import load_state, save_state


@dataclass(frozen=True)
class UpdateViewState:
    kind: str
    current_version: str
    latest_version: str | None
    checked_at: str | None
    changes_zh: tuple[str, ...]
    changes_en: tuple[str, ...]
    error: str | None


@dataclass(frozen=True)
class RenderedViews:
    home: Path
    home_zh: Path
    home_en: Path
    status: Path
    status_zh: Path
    status_en: Path


def _lesson_table(manifest, state, language: str) -> str:
    if not manifest.lessons:
        return (
            "尚未发布章节。"
            if language == "zh"
            else "No lessons have been published."
        )
    header = (
        "| 状态 | 章节 | 打开 |"
        if language == "zh"
        else "| Status | Lesson | Open |"
    )
    rows = [header, "|---|---|---|"]
    for lesson in manifest.lessons:
        progress = state.progress.get(lesson.id, "not_started")
        path = lesson.zh if language == "zh" else lesson.en
        if path:
            label = "打开" if language == "zh" else "Open"
            link = f"[{label}]({path.as_posix()})"
        else:
            link = "尚未发布" if language == "zh" else "Not published"
        rows.append(f"| {progress} | `{lesson.id}` | {link} |")
    return "\n".join(rows)


def _render_home(root: Path, manifest, state, language: str) -> str:
    title = manifest.course.title_zh if language == "zh" else manifest.course.title_en
    lesson = next(
        (item for item in manifest.lessons if item.id == state.last_lesson_id),
        None,
    )
    path = None
    if lesson:
        path = lesson.zh if language == "zh" else lesson.en
    if path:
        label = "继续" if language == "zh" else "Continue"
        continue_block = f"[{label} `{state.last_lesson_id}`]({path.as_posix()})"
    else:
        continue_block = (
            "尚未记录学习进度。"
            if language == "zh"
            else "No learning progress has been recorded."
        )
    template = Template(
        (root / f"ui/templates/START_HERE.{language}.template.md").read_text(
            encoding="utf-8"
        )
    )
    return template.substitute(
        course_title=title,
        version=manifest.course.version,
        continue_block=continue_block,
        lesson_table=_lesson_table(manifest, state, language),
    )


def _render_status(root: Path, update: UpdateViewState, language: str) -> str:
    template = Template(
        (root / f"ui/templates/COURSE_STATUS.{language}.template.md").read_text(
            encoding="utf-8"
        )
    )
    empty = "无可显示的变化。" if language == "zh" else "No changes to display."
    detail_by_kind = {
        "zh": {
            "unknown": "尚未检查更新",
            "offline": "无法检查更新",
            "available": "发现新版本",
            "current": "当前已是最新版",
        },
        "en": {
            "unknown": "Updates have not been checked",
            "offline": "Unable to check for updates",
            "available": "A new version is available",
            "current": "The textbook is current",
        },
    }
    changes = update.changes_zh if language == "zh" else update.changes_en
    detail = detail_by_kind[language].get(update.kind, update.kind)
    if update.error:
        detail = f"{detail}: {update.error}"
    return template.substitute(
        current_version=update.current_version,
        latest_version=update.latest_version
        or ("未知" if language == "zh" else "Unknown"),
        checked_at=update.checked_at
        or ("尚未检查" if language == "zh" else "Not checked"),
        update_kind=update.kind,
        update_detail=detail,
        changes="\n".join(f"- {item}" for item in changes) or empty,
    )


def render_user_views(root: Path, update: UpdateViewState) -> RenderedViews:
    manifest = load_course_manifest(root / "course-manifest.yml")
    state = load_state(root, manifest.course.default_language)
    save_state(root, state)

    home_zh = root / "START_HERE.zh.md"
    home_en = root / "START_HERE.en.md"
    status_zh = root / "COURSE_STATUS.zh.md"
    status_en = root / "COURSE_STATUS.en.md"
    home_zh.write_text(_render_home(root, manifest, state, "zh"), encoding="utf-8")
    home_en.write_text(_render_home(root, manifest, state, "en"), encoding="utf-8")
    status_zh.write_text(_render_status(root, update, "zh"), encoding="utf-8")
    status_en.write_text(_render_status(root, update, "en"), encoding="utf-8")

    home = root / "START_HERE.md"
    status = root / "COURSE_STATUS.md"
    selected_home = home_zh if state.language == "zh" else home_en
    selected_status = status_zh if state.language == "zh" else status_en
    home.write_text(selected_home.read_text(encoding="utf-8"), encoding="utf-8")
    status.write_text(selected_status.read_text(encoding="utf-8"), encoding="utf-8")
    return RenderedViews(home, home_zh, home_en, status, status_zh, status_en)


def _catalog_text(catalog, language: str) -> str:
    home = "../START_HERE.zh.md" if language == "zh" else "../START_HERE.en.md"
    other = "CATALOG.en.md" if language == "zh" else "CATALOG.zh.md"
    title = "# 数据与实例文件" if language == "zh" else "# Datasets and example files"
    home_label = "返回课程首页" if language == "zh" else "Course home"
    other_label = "English" if language == "zh" else "中文"
    lines = [
        title,
        "",
        f"[← {home_label}]({home}) · [{other_label}]({other})",
        "",
    ]
    if not catalog.datasets:
        lines.append(
            "尚未发布数据条目。"
            if language == "zh"
            else "No datasets have been published."
        )
    for item in catalog.datasets:
        name = item.name_zh if language == "zh" else item.name_en
        purpose = item.purpose_zh if language == "zh" else item.purpose_en
        lines.extend(
            [
                f"## {name}",
                "",
                f"- ID: `{item.id}`",
                f"- Source: [{item.source}]({item.source_url})",
                f"- Purpose: {purpose}",
                f"- File type: {item.file_type}",
                f"- Download size: {item.download_size}",
                f"- Extracted size: {item.extracted_size}",
                f"- License: {item.license}",
                "",
            ]
        )
        if item.download_command:
            lines.extend(["```text", item.download_command, "```", ""])
    return "\n".join(lines) + "\n"


def render_dataset_catalog(root: Path) -> tuple[Path, Path, Path]:
    manifest = load_course_manifest(root / "course-manifest.yml")
    catalog = load_dataset_catalog(root / "datasets/catalog.yml")
    zh = root / "datasets/CATALOG.zh.md"
    en = root / "datasets/CATALOG.en.md"
    zh.write_text(_catalog_text(catalog, "zh"), encoding="utf-8")
    en.write_text(_catalog_text(catalog, "en"), encoding="utf-8")
    default = root / "datasets/CATALOG.md"
    selected = zh if manifest.course.default_language == "zh" else en
    default.write_text(selected.read_text(encoding="utf-8"), encoding="utf-8")
    return default, zh, en
