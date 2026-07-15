# Codex Native Bilingual Textbook UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first content-neutral Codex-native bilingual textbook shell with generated Markdown UI, protected local state, external dataset catalog, safe update checks, and a project-local Codex Skill.

**Architecture:** Keep author-owned course content and templates under Git, while generating user-specific `START_HERE.md` and `COURSE_STATUS.md` from ignored JSON state. A small Python package provides manifest loading, validation, rendering, update checks, and CLI commands; a project-local Skill tells Codex how to open the course, answer from workspace context, and enforce the first-version safety boundaries.

**Tech Stack:** Python 3.11+, PyYAML 6.x, Python standard library (`dataclasses`, `json`, `pathlib`, `string`, `subprocess`, `urllib`), Markdown, YAML, pytest 8.x for external tests.

## Global Constraints

- Use the approved design at `docs/superpowers/specs/2026-07-15-codex-native-bilingual-textbook-ui-design.md` as the source of truth.
- Do not define or reorganize course subject matter; ship only content-neutral templates and empty manifests.
- Use whole-page Chinese/English switching with stable lesson IDs.
- Use Codex native conversation; do not build a custom chat UI or floating “Ask Codex” button.
- Do not run, probe, or configure local R, Python analysis, Linux analysis commands, SSH, HPC schedulers, or remote credentials in version 1.
- Do not bundle or automatically download example datasets.
- Never overwrite `.course-state/`, `my-notes/`, or downloaded user data during updates.
- Require user confirmation before applying any Git update.
- Put all test files, fixtures, logs, and temporary test outputs under `D:\codextest\codex-bilingual-textbook-ui`; do not create tests in the repository.
- Keep runtime dependencies to PyYAML only; use pytest solely for the external test harness.
- Each task ends with a focused commit and a clean test run.

---

## File Map

### Project files

- `pyproject.toml` — package metadata, Python floor, PyYAML dependency, and `course-tool` entry point.
- `course-manifest.yml` — content-neutral course metadata and ordered lesson registry.
- `datasets/catalog.yml` — empty external dataset registry with schema version.
- `datasets/CATALOG.md` — generated default-language dataset entry page.
- `datasets/CATALOG.zh.md` — generated Chinese dataset page.
- `datasets/CATALOG.en.md` — generated English dataset page.
- `OPEN_COURSE.md` — stable first-launch entry when generated views do not yet exist.
- `ui/templates/START_HERE.zh.template.md` — Chinese course-home template.
- `ui/templates/START_HERE.en.template.md` — English course-home template.
- `ui/templates/COURSE_STATUS.zh.template.md` — Chinese status-page template.
- `ui/templates/COURSE_STATUS.en.template.md` — English status-page template.
- `ui/templates/LESSON.zh.template.md` — Chinese authoring template.
- `ui/templates/LESSON.en.template.md` — English authoring template.
- `src/codex_textbook/models.py` — shared immutable dataclasses and validation exception.
- `src/codex_textbook/manifest.py` — YAML loading and strict schema checks.
- `src/codex_textbook/state.py` — protected state load, recovery, and atomic writes.
- `src/codex_textbook/validation.py` — bilingual, navigation, Markdown, and dataset validation.
- `src/codex_textbook/render.py` — Markdown rendering for home, status, and dataset catalog.
- `src/codex_textbook/updater.py` — remote version check, clean-tree gate, confirmed fast-forward update, and user-data verification.
- `src/codex_textbook/cli.py` — `init`, `render`, `validate`, `check-update`, and `apply-update` commands.
- `.codex/skills/bilingual-textbook/SKILL.md` — Codex workflow and first-version safety policy.
- `.codex/skills/bilingual-textbook/agents/openai.yaml` — discoverable UI metadata for the Skill.

### External test files

- `D:\codextest\codex-bilingual-textbook-ui\conftest.py` — repository path and fixture helpers.
- `D:\codextest\codex-bilingual-textbook-ui\test_manifest.py`
- `D:\codextest\codex-bilingual-textbook-ui\test_state.py`
- `D:\codextest\codex-bilingual-textbook-ui\test_validation.py`
- `D:\codextest\codex-bilingual-textbook-ui\test_render.py`
- `D:\codextest\codex-bilingual-textbook-ui\test_updater.py`
- `D:\codextest\codex-bilingual-textbook-ui\test_cli_and_skill.py`
- `D:\codextest\codex-bilingual-textbook-ui\test_acceptance.py`

---

### Task 1: Package Foundation and Strict Manifests

**Files:**
- Create: `pyproject.toml`
- Create: `course-manifest.yml`
- Create: `datasets/catalog.yml`
- Create: `src/codex_textbook/__init__.py`
- Create: `src/codex_textbook/models.py`
- Create: `src/codex_textbook/manifest.py`
- Test: `D:\codextest\codex-bilingual-textbook-ui\conftest.py`
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_manifest.py`

**Interfaces:**
- Produces: `CourseManifest`, `CourseInfo`, `Lesson`, `DatasetCatalog`, `DatasetEntry`, and `ManifestError`.
- Produces: `load_course_manifest(path: Path) -> CourseManifest`.
- Produces: `load_dataset_catalog(path: Path) -> DatasetCatalog`.
- Consumes: no earlier project interfaces.

- [ ] **Step 1: Create the external test directory and failing manifest tests**

Create `D:\codextest\codex-bilingual-textbook-ui\conftest.py`:

```python
from pathlib import Path
import sys

REPO = Path(r"D:\bioinformatics")
SRC = REPO / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))
```

Create `D:\codextest\codex-bilingual-textbook-ui\test_manifest.py`:

```python
from pathlib import Path
import pytest

from codex_textbook.manifest import load_course_manifest, load_dataset_catalog
from codex_textbook.models import ManifestError


def test_loads_content_neutral_manifests():
    root = Path(r"D:\bioinformatics")
    course = load_course_manifest(root / "course-manifest.yml")
    catalog = load_dataset_catalog(root / "datasets" / "catalog.yml")
    assert course.schema_version == 1
    assert course.course.default_language == "zh"
    assert course.lessons == ()
    assert catalog.datasets == ()


def test_rejects_duplicate_lesson_ids(tmp_path):
    path = tmp_path / "course.yml"
    path.write_text(
        """schema_version: 1
course:
  id: demo
  version: 0.1.0
  default_language: zh
  title: {zh: 示例, en: Demo}
  remote_manifest_url: null
lessons:
  - {id: same, order: 1, zh: chapters/zh/a.md, en: chapters/en/a.md}
  - {id: same, order: 2, zh: chapters/zh/b.md, en: chapters/en/b.md}
""",
        encoding="utf-8",
    )
    with pytest.raises(ManifestError, match="duplicate lesson id"):
        load_course_manifest(path)
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run:

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_manifest.py -q
```

Expected: collection fails with `ModuleNotFoundError: No module named 'codex_textbook'`.

- [ ] **Step 3: Add package metadata and content-neutral YAML manifests**

Create `pyproject.toml`:

```toml
[build-system]
requires = ["setuptools>=69"]
build-backend = "setuptools.build_meta"

[project]
name = "codex-bilingual-textbook"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = ["PyYAML>=6.0,<7"]

[project.scripts]
course-tool = "codex_textbook.cli:main"

[tool.setuptools.packages.find]
where = ["src"]
```

Create `course-manifest.yml`:

```yaml
schema_version: 1
course:
  id: codex-bilingual-textbook
  version: 0.1.0
  default_language: zh
  title:
    zh: 双语交互教材
    en: Bilingual Interactive Textbook
  remote_manifest_url: null
lessons: []
```

Create `datasets/catalog.yml`:

```yaml
schema_version: 1
datasets: []
```

Create `src/codex_textbook/__init__.py`:

```python
"""Codex-native bilingual textbook tooling."""
```

- [ ] **Step 4: Implement strict dataclasses and YAML loaders**

Create `src/codex_textbook/models.py`:

```python
from dataclasses import dataclass
from pathlib import Path
from typing import Literal


class ManifestError(ValueError):
    pass


ProgressStatus = Literal["not_started", "in_progress", "completed"]


@dataclass(frozen=True)
class CourseInfo:
    id: str
    version: str
    default_language: Literal["zh", "en"]
    title_zh: str
    title_en: str
    remote_manifest_url: str | None


@dataclass(frozen=True)
class Lesson:
    id: str
    order: int
    zh: Path | None
    en: Path | None


@dataclass(frozen=True)
class CourseManifest:
    schema_version: int
    course: CourseInfo
    lessons: tuple[Lesson, ...]


@dataclass(frozen=True)
class DatasetEntry:
    id: str
    name_zh: str
    name_en: str
    source: str
    source_url: str
    purpose_zh: str
    purpose_en: str
    file_type: str
    download_size: str
    extracted_size: str
    license: str
    checksum_algorithm: str | None
    checksum: str | None
    download_command: str | None


@dataclass(frozen=True)
class DatasetCatalog:
    schema_version: int
    datasets: tuple[DatasetEntry, ...]
```

Create `src/codex_textbook/manifest.py`:

```python
from pathlib import Path
from typing import Any
import re
import yaml

from .models import (
    CourseInfo, CourseManifest, DatasetCatalog, DatasetEntry,
    Lesson, ManifestError,
)

SEMVER = re.compile(r"^\d+\.\d+\.\d+$")


def _read_yaml(path: Path) -> dict[str, Any]:
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        raise ManifestError(f"cannot read {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ManifestError(f"{path} must contain a YAML mapping")
    return data


def _required(mapping: dict[str, Any], key: str, where: str) -> Any:
    if key not in mapping:
        raise ManifestError(f"missing {where}.{key}")
    return mapping[key]


def load_course_manifest(path: Path) -> CourseManifest:
    data = _read_yaml(path)
    if data.get("schema_version") != 1:
        raise ManifestError("course schema_version must be 1")
    raw_course = _required(data, "course", "root")
    if not isinstance(raw_course, dict):
        raise ManifestError("course must be a mapping")
    title = _required(raw_course, "title", "course")
    if not isinstance(title, dict) or not title.get("zh") or not title.get("en"):
        raise ManifestError("course.title requires zh and en")
    version = str(_required(raw_course, "version", "course"))
    if not SEMVER.fullmatch(version):
        raise ManifestError("course.version must use major.minor.patch")
    language = _required(raw_course, "default_language", "course")
    if language not in {"zh", "en"}:
        raise ManifestError("course.default_language must be zh or en")
    course = CourseInfo(
        id=str(_required(raw_course, "id", "course")),
        version=version,
        default_language=language,
        title_zh=str(title["zh"]),
        title_en=str(title["en"]),
        remote_manifest_url=raw_course.get("remote_manifest_url"),
    )
    seen: set[str] = set()
    lessons: list[Lesson] = []
    for raw in data.get("lessons", []):
        lesson_id = str(_required(raw, "id", "lesson"))
        if lesson_id in seen:
            raise ManifestError(f"duplicate lesson id: {lesson_id}")
        seen.add(lesson_id)
        lessons.append(Lesson(
            id=lesson_id,
            order=int(_required(raw, "order", f"lesson {lesson_id}")),
            zh=Path(raw["zh"]) if raw.get("zh") else None,
            en=Path(raw["en"]) if raw.get("en") else None,
        ))
    lessons.sort(key=lambda item: item.order)
    return CourseManifest(1, course, tuple(lessons))


def load_dataset_catalog(path: Path) -> DatasetCatalog:
    data = _read_yaml(path)
    if data.get("schema_version") != 1:
        raise ManifestError("dataset schema_version must be 1")
    entries: list[DatasetEntry] = []
    seen: set[str] = set()
    for raw in data.get("datasets", []):
        dataset_id = str(_required(raw, "id", "dataset"))
        if dataset_id in seen:
            raise ManifestError(f"duplicate dataset id: {dataset_id}")
        seen.add(dataset_id)
        names = _required(raw, "name", f"dataset {dataset_id}")
        purposes = _required(raw, "purpose", f"dataset {dataset_id}")
        entries.append(DatasetEntry(
            id=dataset_id,
            name_zh=str(names["zh"]), name_en=str(names["en"]),
            source=str(_required(raw, "source", f"dataset {dataset_id}")),
            source_url=str(_required(raw, "source_url", f"dataset {dataset_id}")),
            purpose_zh=str(purposes["zh"]), purpose_en=str(purposes["en"]),
            file_type=str(_required(raw, "file_type", f"dataset {dataset_id}")),
            download_size=str(_required(raw, "download_size", f"dataset {dataset_id}")),
            extracted_size=str(_required(raw, "extracted_size", f"dataset {dataset_id}")),
            license=str(_required(raw, "license", f"dataset {dataset_id}")),
            checksum_algorithm=raw.get("checksum_algorithm"),
            checksum=raw.get("checksum"),
            download_command=raw.get("download_command"),
        ))
    return DatasetCatalog(1, tuple(entries))
```

- [ ] **Step 5: Install, test, and commit**

Run:

```powershell
python -m pip install -e . pytest
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_manifest.py -q
```

Expected: `2 passed`.

Commit:

```powershell
git add pyproject.toml course-manifest.yml datasets/catalog.yml src/codex_textbook
git commit -m "feat: add textbook manifests"
```

---

### Task 2: Protected Local State and Recovery

**Files:**
- Create: `src/codex_textbook/state.py`
- Modify: `.gitignore`
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_state.py`

**Interfaces:**
- Consumes: `ProgressStatus` from `models.py`.
- Produces: `CourseState`.
- Produces: `load_state(root: Path, default_language: str) -> CourseState`.
- Produces: `save_state(root: Path, state: CourseState) -> None`.
- Produces: `set_lesson_status(state: CourseState, lesson_id: str, status: ProgressStatus) -> CourseState`.
- Produces: `set_language(state: CourseState, language: str) -> CourseState`.

- [ ] **Step 1: Write failing state isolation and corruption tests**

Create `D:\codextest\codex-bilingual-textbook-ui\test_state.py`:

```python
import json
from pathlib import Path

from codex_textbook.state import load_state, save_state, set_language, set_lesson_status


def test_state_round_trip_uses_ignored_directory(tmp_path):
    state = load_state(tmp_path, "zh")
    state = set_lesson_status(state, "lesson-a", "in_progress")
    save_state(tmp_path, state)
    loaded = load_state(tmp_path, "zh")
    assert loaded.language == "zh"
    assert loaded.last_lesson_id == "lesson-a"
    assert loaded.progress == {"lesson-a": "in_progress"}
    assert (tmp_path / ".course-state" / "progress.json").exists()


def test_language_switch_is_explicit():
    state = load_state(Path(r"D:\bioinformatics"), "zh")
    assert set_language(state, "en").language == "en"


def test_corrupt_state_is_backed_up_and_reset(tmp_path):
    state_dir = tmp_path / ".course-state"
    state_dir.mkdir()
    (state_dir / "progress.json").write_text("{broken", encoding="utf-8")
    loaded = load_state(tmp_path, "en")
    assert loaded.progress == {}
    assert list(state_dir.glob("progress.corrupt-*.json"))
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_state.py -q
```

Expected: collection fails because `codex_textbook.state` does not exist.

- [ ] **Step 3: Implement atomic, recoverable local state**

Create `src/codex_textbook/state.py`:

```python
from dataclasses import dataclass, replace
from datetime import datetime, timezone
from pathlib import Path
import json
import os

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
    except (OSError, ValueError, json.JSONDecodeError):
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        backup = path.with_name(f"{path.stem}.corrupt-{stamp}{path.suffix}")
        path.replace(backup)
        return default.copy()


def load_state(root: Path, default_language: str) -> CourseState:
    state_dir = root / ".course-state"
    progress_raw = _load_json(state_dir / "progress.json", {})
    prefs = _load_json(state_dir / "preferences.json", {})
    progress = {k: v for k, v in progress_raw.items() if v in VALID}
    language = prefs.get("language", default_language)
    if language not in {"zh", "en"}:
        language = default_language
    return CourseState(language, prefs.get("last_lesson_id"), progress)


def _atomic_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temp, path)


def save_state(root: Path, state: CourseState) -> None:
    state_dir = root / ".course-state"
    _atomic_json(state_dir / "progress.json", state.progress)
    _atomic_json(state_dir / "preferences.json", {
        "language": state.language,
        "last_lesson_id": state.last_lesson_id,
    })
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
```

- [ ] **Step 4: Extend ignore rules and verify tests**

Ensure `.gitignore` contains exactly these user-owned paths in addition to existing prototype/cache rules:

```gitignore
.course-state/
my-notes/
/START_HERE.md
/COURSE_STATUS.md
/START_HERE.zh.md
/START_HERE.en.md
/COURSE_STATUS.zh.md
/COURSE_STATUS.en.md
```

Run:

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_state.py -q
```

Expected: `3 passed`.

- [ ] **Step 5: Commit**

```powershell
git add .gitignore src/codex_textbook/state.py
git commit -m "feat: protect textbook user state"
```

---

### Task 3: Content-Neutral Templates and Repository Validation

**Files:**
- Create: `ui/templates/LESSON.zh.template.md`
- Create: `ui/templates/LESSON.en.template.md`
- Create: `src/codex_textbook/validation.py`
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_validation.py`

**Interfaces:**
- Consumes: `CourseManifest`, `DatasetCatalog`.
- Produces: `ValidationIssue(level: str, code: str, message: str, path: Path | None)`.
- Produces: `validate_repository(root: Path, manifest: CourseManifest, catalog: DatasetCatalog, check_url: Callable[[str], bool] | None = None) -> tuple[ValidationIssue, ...]`.
- Produces: `default_url_checker(url: str) -> bool` for explicit online validation only.

- [ ] **Step 1: Write failing repository-validation tests**

Create `D:\codextest\codex-bilingual-textbook-ui\test_validation.py`:

```python
from pathlib import Path

from codex_textbook.manifest import load_course_manifest, load_dataset_catalog
from codex_textbook.validation import validate_repository


def test_empty_content_neutral_repository_is_valid():
    root = Path(r"D:\bioinformatics")
    issues = validate_repository(
        root,
        load_course_manifest(root / "course-manifest.yml"),
        load_dataset_catalog(root / "datasets" / "catalog.yml"),
    )
    assert [issue for issue in issues if issue.level == "error"] == []


def test_flags_markdown_without_language_or_alt_text(tmp_path):
    (tmp_path / "chapters" / "zh").mkdir(parents=True)
    (tmp_path / "chapters" / "en").mkdir(parents=True)
    bad = "# Title\n\n![](image.png)\n\n```\nprint('x')\n```\n"
    (tmp_path / "chapters" / "zh" / "a.md").write_text(bad, encoding="utf-8")
    (tmp_path / "chapters" / "en" / "a.md").write_text(bad, encoding="utf-8")
    (tmp_path / "course-manifest.yml").write_text(
        """schema_version: 1
course:
  id: demo
  version: 0.1.0
  default_language: zh
  title: {zh: 示例, en: Demo}
  remote_manifest_url: null
lessons:
  - {id: a, order: 1, zh: chapters/zh/a.md, en: chapters/en/a.md}
""",
        encoding="utf-8",
    )
    (tmp_path / "datasets").mkdir()
    (tmp_path / "datasets" / "catalog.yml").write_text(
        "schema_version: 1\ndatasets: []\n", encoding="utf-8"
    )
    from codex_textbook.manifest import load_course_manifest, load_dataset_catalog
    issues = validate_repository(
        tmp_path,
        load_course_manifest(tmp_path / "course-manifest.yml"),
        load_dataset_catalog(tmp_path / "datasets" / "catalog.yml"),
    )
    codes = {issue.code for issue in issues}
    assert {"image-alt-missing", "code-language-missing"} <= codes


def test_optional_link_check_reports_unreachable_dataset(tmp_path):
    root = Path(r"D:\bioinformatics")
    from codex_textbook.manifest import load_course_manifest, load_dataset_catalog
    manifest = load_course_manifest(root / "course-manifest.yml")
    catalog_path = tmp_path / "catalog.yml"
    catalog_path.write_text(
        """schema_version: 1
datasets:
  - id: example
    name: {zh: 示例, en: Example}
    source: Archive
    source_url: https://example.org/data
    purpose: {zh: 验证, en: Validation}
    file_type: archive
    download_size: 1 MB
    extracted_size: 2 MB
    license: public
    checksum_algorithm: null
    checksum: null
    download_command: null
""",
        encoding="utf-8",
    )
    issues = validate_repository(
        root, manifest, load_dataset_catalog(catalog_path), check_url=lambda url: False
    )
    assert any(issue.code == "external-link-unreachable" for issue in issues)
```

- [ ] **Step 2: Run tests and verify failure**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_validation.py -q
```

Expected: collection fails because `codex_textbook.validation` does not exist.

- [ ] **Step 3: Add language-specific authoring templates**

Create `ui/templates/LESSON.zh.template.md`:

````markdown
<!-- lesson-id: $lesson_id -->
[← 上一章]($previous_path) · [课程首页]($home_path) · [下一章 →]($next_path) · [EN]($other_language_path)

# 章节标题

> 章节摘要、预计阅读时间和更新日期。

## 本章目标

- 学习目标。

## 小节标题

正文。

![可独立理解的图片替代文本](../../figures/example.png)

**图 1.** 图题与完整图注。

```text
content
```

## 来源

- [描述来源目标的链接文字](https://example.org/)

[← 上一章]($previous_path) · [下一章 →]($next_path)
````

Create `ui/templates/LESSON.en.template.md` with the same structure and English labels:

````markdown
<!-- lesson-id: $lesson_id -->
[← Previous]($previous_path) · [Course home]($home_path) · [Next →]($next_path) · [中文]($other_language_path)

# Lesson title

> Lesson summary, estimated reading time, and update date.

## Learning objectives

- Learning objective.

## Section title

Body text.

![Descriptive alternative text](../../figures/example.png)

**Figure 1.** Standalone figure title and caption.

```text
content
```

## Sources

- [Descriptive source link](https://example.org/)

[← Previous]($previous_path) · [Next →]($next_path)
````

- [ ] **Step 4: Implement deterministic repository validation**

Create `src/codex_textbook/validation.py`:

```python
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
import re
import urllib.request

from .models import CourseManifest, DatasetCatalog


@dataclass(frozen=True)
class ValidationIssue:
    level: str
    code: str
    message: str
    path: Path | None = None


def _markdown_issues(path: Path) -> list[ValidationIssue]:
    text = path.read_text(encoding="utf-8")
    issues: list[ValidationIssue] = []
    if re.search(r"!\[\]\(", text):
        issues.append(ValidationIssue("error", "image-alt-missing", "image alt text is required", path))
    if re.search(r"^```\s*$", text, re.MULTILINE):
        issues.append(ValidationIssue("error", "code-language-missing", "code fence language is required", path))
    if re.search(r"\[(点击这里|click here)\]", text, re.IGNORECASE):
        issues.append(ValidationIssue("error", "vague-link-text", "link text must describe its target", path))
    if "START_HERE.md" not in text:
        issues.append(ValidationIssue("error", "home-link-missing", "lesson must link to START_HERE.md", path))
    return issues


def validate_repository(
    root: Path,
    manifest: CourseManifest,
    catalog: DatasetCatalog,
    check_url: Callable[[str], bool] | None = None,
) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []
    orders = [lesson.order for lesson in manifest.lessons]
    if len(orders) != len(set(orders)):
        issues.append(ValidationIssue("error", "duplicate-order", "lesson orders must be unique"))
    for lesson in manifest.lessons:
        for language, relative in (("zh", lesson.zh), ("en", lesson.en)):
            if relative is None:
                issues.append(ValidationIssue("warning", "translation-missing", f"{lesson.id} has no {language} page"))
                continue
            path = root / relative
            if not path.is_file():
                issues.append(ValidationIssue("error", "lesson-file-missing", f"missing {language} lesson {lesson.id}", path))
                continue
            issues.extend(_markdown_issues(path))
    for dataset in catalog.datasets:
        if not dataset.source_url.startswith(("https://", "http://")):
            issues.append(ValidationIssue("error", "dataset-url-invalid", dataset.id))
        if bool(dataset.checksum) != bool(dataset.checksum_algorithm):
            issues.append(ValidationIssue("error", "dataset-checksum-incomplete", dataset.id))
        if check_url and not check_url(dataset.source_url):
            issues.append(ValidationIssue("warning", "external-link-unreachable", dataset.source_url))
    return tuple(issues)


def default_url_checker(url: str) -> bool:
    try:
        request = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "codex-textbook-validator"})
        with urllib.request.urlopen(request, timeout=10) as response:
            return 200 <= response.status < 400
    except OSError:
        return False
```

- [ ] **Step 5: Test and commit**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_validation.py -q
```

Expected: `3 passed`.

```powershell
git add ui/templates src/codex_textbook/validation.py
git commit -m "feat: validate textbook content structure"
```

---

### Task 4: Paired-Language Markdown Home, Status, and Dataset Pages

**Files:**
- Create: `OPEN_COURSE.md`
- Create: `ui/templates/START_HERE.zh.template.md`
- Create: `ui/templates/START_HERE.en.template.md`
- Create: `ui/templates/COURSE_STATUS.zh.template.md`
- Create: `ui/templates/COURSE_STATUS.en.template.md`
- Create: `src/codex_textbook/render.py`
- Create: `datasets/CATALOG.md`
- Create: `datasets/CATALOG.zh.md`
- Create: `datasets/CATALOG.en.md`
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_render.py`

**Interfaces:**
- Consumes: `CourseManifest`, `DatasetCatalog`, `CourseState`.
- Produces: `UpdateViewState(kind, current_version, latest_version, checked_at, changes_zh, changes_en, error)`.
- Produces: `RenderedViews(home, home_zh, home_en, status, status_zh, status_en)`.
- Produces: `render_user_views(root: Path, update: UpdateViewState) -> RenderedViews`.
- Produces: `render_dataset_catalog(root: Path) -> tuple[Path, Path, Path]` for the default, Chinese, and English pages.

- [ ] **Step 1: Write failing rendering tests**

Create `D:\codextest\codex-bilingual-textbook-ui\test_render.py`:

```python
from pathlib import Path

from codex_textbook.render import UpdateViewState, render_dataset_catalog, render_user_views


def test_renders_content_neutral_paired_home_and_status():
    root = Path(r"D:\bioinformatics")
    views = render_user_views(root, UpdateViewState(
        kind="unknown", current_version="0.1.0", latest_version=None,
        checked_at=None, changes_zh=(), changes_en=(), error=None,
    ))
    zh = views.home_zh.read_text(encoding="utf-8")
    en = views.home_en.read_text(encoding="utf-8")
    assert "尚未发布章节" in zh
    assert "No lessons have been published" in en
    assert "START_HERE.en.md" in zh
    assert "START_HERE.zh.md" in en
    status_text = views.status.read_text(encoding="utf-8")
    assert "本地 R：第一版未开放" in status_text
    assert "SSH/HPC：第一版未开放" in status_text


def test_empty_catalog_does_not_offer_download():
    root = Path(r"D:\bioinformatics")
    default, zh, en = render_dataset_catalog(root)
    assert "尚未发布数据条目" in zh.read_text(encoding="utf-8")
    assert "No datasets have been published" in en.read_text(encoding="utf-8")
    assert default.read_text(encoding="utf-8") == zh.read_text(encoding="utf-8")
```

- [ ] **Step 2: Run tests and verify failure**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_render.py -q
```

Expected: collection fails because `codex_textbook.render` does not exist.

- [ ] **Step 3: Add stable entry and Markdown templates**

Create `OPEN_COURSE.md`:

```markdown
# 打开双语交互教材 / Open the bilingual textbook

请让 Codex 使用项目内的 `bilingual-textbook` Skill 初始化教材视图，然后打开生成的 `START_HERE.md`。

Ask Codex to use the project `bilingual-textbook` Skill to initialize the local views, then open the generated `START_HERE.md`.

如果初始化失败，请让 Codex 运行 `course-tool validate` 并解释错误；不要运行 R 或连接 SSH。
```

Create `ui/templates/START_HERE.zh.template.md`:

```markdown
# $course_title

[English](START_HERE.en.md) · [数据清单](datasets/CATALOG.zh.md) · [更新与环境状态](COURSE_STATUS.zh.md)

> 内容版本：$version

## 继续学习

$continue_block

## 课程目录

$lesson_table

## 执行接口

- 本地 R：第一版未开放
- SSH/HPC：第一版未开放

你可以在 Codex 原生对话中引用章节、代码或粘贴选中文本并自由提问。
```

Create `ui/templates/START_HERE.en.template.md`:

```markdown
# $course_title

[中文](START_HERE.zh.md) · [Datasets](datasets/CATALOG.en.md) · [Updates and environment](COURSE_STATUS.en.md)

> Content version: $version

## Continue learning

$continue_block

## Course outline

$lesson_table

## Execution interfaces

- Local R: unavailable in version 1
- SSH/HPC: unavailable in version 1

Use Codex native conversation to cite a lesson or code block, paste selected text, and ask freely.
```

Create `ui/templates/COURSE_STATUS.zh.template.md`:

```markdown
# 更新与环境状态

[← 返回课程首页](START_HERE.zh.md)

## 教材更新

- 当前版本：$current_version
- 最新版本：$latest_version
- 最近检查：$checked_at
- 状态：$update_kind
- 说明：$update_detail

### 变化摘要

$changes

更新只能在用户确认后执行。`.course-state/`、`my-notes/` 和已下载数据不得被覆盖。

## 环境能力

- 本地 R：第一版未开放
- SSH/HPC：第一版未开放
```

Create `ui/templates/COURSE_STATUS.en.template.md`:

```markdown
# Updates and environment

[← Course home](START_HERE.en.md)

## Textbook update

- Current version: $current_version
- Latest version: $latest_version
- Last checked: $checked_at
- Status: $update_kind
- Detail: $update_detail

### Change summary

$changes

An update runs only after user confirmation. `.course-state/`, `my-notes/`, and downloaded data must not be overwritten.

## Environment capabilities

- Local R: unavailable in version 1
- SSH/HPC: unavailable in version 1
```

- [ ] **Step 4: Implement rendering without custom web controls**

Create `src/codex_textbook/render.py`:

```python
from dataclasses import dataclass
from datetime import datetime, timezone
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
        return "尚未发布章节。" if language == "zh" else "No lessons have been published."
    header = "| 状态 | 章节 | 打开 |" if language == "zh" else "| Status | Lesson | Open |"
    rows = [header, "|---|---|---|"]
    for lesson in manifest.lessons:
        progress = state.progress.get(lesson.id, "not_started")
        path = lesson.zh if language == "zh" else lesson.en
        link = f"[打开]({path.as_posix()})" if path and language == "zh" else f"[Open]({path.as_posix()})" if path else "尚未发布" if language == "zh" else "Not published"
        rows.append(f"| {progress} | `{lesson.id}` | {link} |")
    return "\n".join(rows)


def _render_home(root: Path, manifest, state, language: str) -> str:
    title = manifest.course.title_zh if language == "zh" else manifest.course.title_en
    lesson = next((x for x in manifest.lessons if x.id == state.last_lesson_id), None)
    path = lesson.zh if lesson and language == "zh" else lesson.en if lesson else None
    if path:
        label = "继续" if language == "zh" else "Continue"
        continue_block = f"[{label} `{state.last_lesson_id}`]({path.as_posix()})"
    else:
        continue_block = "尚未记录学习进度。" if language == "zh" else "No learning progress has been recorded."
    template = Template((root / f"ui/templates/START_HERE.{language}.template.md").read_text(encoding="utf-8"))
    return template.substitute(
        course_title=title,
        version=manifest.course.version,
        continue_block=continue_block,
        lesson_table=_lesson_table(manifest, state, language),
    )


def _render_status(root: Path, update: UpdateViewState, language: str) -> str:
    template = Template((root / f"ui/templates/COURSE_STATUS.{language}.template.md").read_text(encoding="utf-8"))
    empty = "无可显示的变化。" if language == "zh" else "No changes to display."
    detail_by_kind = {
        "zh": {"unknown": "尚未检查更新", "offline": "无法检查更新", "available": "发现新版本", "current": "当前已是最新版"},
        "en": {"unknown": "Updates have not been checked", "offline": "Unable to check for updates", "available": "A new version is available", "current": "The textbook is current"},
    }
    changes = update.changes_zh if language == "zh" else update.changes_en
    detail = detail_by_kind[language].get(update.kind, update.kind)
    if update.error:
        detail = f"{detail}: {update.error}"
    return template.substitute(
        current_version=update.current_version,
        latest_version=update.latest_version or ("未知" if language == "zh" else "Unknown"),
        checked_at=update.checked_at or ("尚未检查" if language == "zh" else "Not checked"),
        update_kind=update.kind,
        update_detail=detail,
        changes="\n".join(f"- {item}" for item in changes) or empty,
    )


def render_user_views(root: Path, update: UpdateViewState) -> RenderedViews:
    manifest = load_course_manifest(root / "course-manifest.yml")
    state = load_state(root, manifest.course.default_language)
    save_state(root, state)
    home_zh, home_en = root / "START_HERE.zh.md", root / "START_HERE.en.md"
    status_zh, status_en = root / "COURSE_STATUS.zh.md", root / "COURSE_STATUS.en.md"
    home_zh.write_text(_render_home(root, manifest, state, "zh"), encoding="utf-8")
    home_en.write_text(_render_home(root, manifest, state, "en"), encoding="utf-8")
    status_zh.write_text(_render_status(root, update, "zh"), encoding="utf-8")
    status_en.write_text(_render_status(root, update, "en"), encoding="utf-8")
    home, status = root / "START_HERE.md", root / "COURSE_STATUS.md"
    home.write_text((home_zh if state.language == "zh" else home_en).read_text(encoding="utf-8"), encoding="utf-8")
    status.write_text((status_zh if state.language == "zh" else status_en).read_text(encoding="utf-8"), encoding="utf-8")
    return RenderedViews(home, home_zh, home_en, status, status_zh, status_en)


def _catalog_text(catalog, language: str) -> str:
    home = "../START_HERE.zh.md" if language == "zh" else "../START_HERE.en.md"
    other = "CATALOG.en.md" if language == "zh" else "CATALOG.zh.md"
    lines = ["# 数据与实例文件" if language == "zh" else "# Datasets and example files", "", f"[← {'返回课程首页' if language == 'zh' else 'Course home'}]({home}) · [{'English' if language == 'zh' else '中文'}]({other})", ""]
    if not catalog.datasets:
        lines.append("尚未发布数据条目。" if language == "zh" else "No datasets have been published.")
    for item in catalog.datasets:
        name = item.name_zh if language == "zh" else item.name_en
        purpose = item.purpose_zh if language == "zh" else item.purpose_en
        lines.extend([f"## {name}", "", f"- ID: `{item.id}`", f"- Source: [{item.source}]({item.source_url})", f"- Purpose: {purpose}", f"- File type: {item.file_type}", f"- Download size: {item.download_size}", f"- Extracted size: {item.extracted_size}", f"- License: {item.license}", ""])
        if item.download_command:
            lines.extend(["```text", item.download_command, "```", ""])
    return "\n".join(lines) + "\n"


def render_dataset_catalog(root: Path) -> tuple[Path, Path, Path]:
    manifest = load_course_manifest(root / "course-manifest.yml")
    catalog = load_dataset_catalog(root / "datasets/catalog.yml")
    zh, en = root / "datasets/CATALOG.zh.md", root / "datasets/CATALOG.en.md"
    zh.write_text(_catalog_text(catalog, "zh"), encoding="utf-8")
    en.write_text(_catalog_text(catalog, "en"), encoding="utf-8")
    default = root / "datasets/CATALOG.md"
    default.write_text((zh if manifest.course.default_language == "zh" else en).read_text(encoding="utf-8"), encoding="utf-8")
    return default, zh, en
```

- [ ] **Step 5: Test and commit**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_render.py -q
```

Expected: `2 passed`.

```powershell
git add OPEN_COURSE.md ui/templates/START_HERE.*.template.md ui/templates/COURSE_STATUS.*.template.md datasets/CATALOG*.md src/codex_textbook/render.py
git commit -m "feat: render Codex textbook views"
```

---

### Task 5: Safe Update Check and Confirmed Fast-Forward Update

**Files:**
- Create: `src/codex_textbook/updater.py`
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_updater.py`

**Interfaces:**
- Consumes: `CourseManifest`, `UpdateViewState`, and `render_user_views`.
- Produces: `check_update(root: Path, fetch_text: Callable[[str], str] | None = None) -> UpdateViewState`.
- Produces: `apply_update(root: Path, confirm_version: str, run: Callable[..., CompletedProcess] | None = None) -> UpdateViewState`.

- [ ] **Step 1: Write failing offline, dirty-tree, confirmation, and preservation tests**

Create `D:\codextest\codex-bilingual-textbook-ui\test_updater.py`:

```python
from pathlib import Path
from subprocess import CompletedProcess
import shutil
import pytest

from codex_textbook.updater import UpdateError, apply_update, check_update


def test_no_remote_url_returns_unknown(tmp_path):
    shutil.copy(Path(r"D:\bioinformatics\course-manifest.yml"), tmp_path / "course-manifest.yml")
    state = check_update(tmp_path)
    assert state.kind == "unknown"


def test_dirty_tree_blocks_update(tmp_path):
    root = Path(r"D:\bioinformatics")
    def dirty_run(args, **kwargs):
        if args[1:3] == ["status", "--porcelain"]:
            return CompletedProcess(args, 0, stdout=" M tracked.md\n", stderr="")
        raise AssertionError(args)
    with pytest.raises(UpdateError, match="tracked files have local changes"):
        apply_update(root, "0.1.1", run=dirty_run)


def test_confirmation_must_match_remote_version(monkeypatch, tmp_path):
    root = Path(r"D:\bioinformatics")
    monkeypatch.setattr(
        "codex_textbook.updater.check_update",
        lambda root: __import__("codex_textbook.render", fromlist=["UpdateViewState"]).UpdateViewState(
            "available", "0.1.0", "0.1.1", "now", ("变化",), ("Change",), None
        ),
    )
    with pytest.raises(UpdateError, match="confirmation version"):
        apply_update(root, "0.2.0")


def test_unexpected_user_state_change_is_restored(monkeypatch, tmp_path):
    (tmp_path / ".course-state").mkdir()
    progress = tmp_path / ".course-state/progress.json"
    progress.write_bytes(b'{"lesson-a": "in_progress"}\n')
    (tmp_path / "course-manifest.yml").write_text(
        """schema_version: 1
course:
  id: demo
  version: 0.1.0
  default_language: zh
  title: {zh: 示例, en: Demo}
  remote_manifest_url: https://example.org/course.yml
lessons: []
""",
        encoding="utf-8",
    )
    monkeypatch.setattr(
        "codex_textbook.updater.check_update",
        lambda root: __import__("codex_textbook.render", fromlist=["UpdateViewState"]).UpdateViewState(
            "available", "0.1.0", "0.1.1", "now", ("变化",), ("Change",), None
        ),
    )
    def changing_run(args, **kwargs):
        if args[1] == "status":
            return CompletedProcess(args, 0, stdout="", stderr="")
        if args[1] == "pull":
            text = (tmp_path / "course-manifest.yml").read_text(encoding="utf-8")
            (tmp_path / "course-manifest.yml").write_text(text.replace("0.1.0", "0.1.1"), encoding="utf-8")
            progress.write_bytes(b'{}\n')
            return CompletedProcess(args, 0, stdout="updated", stderr="")
        raise AssertionError(args)
    with pytest.raises(UpdateError, match="restored"):
        apply_update(tmp_path, "0.1.1", run=changing_run)
    assert progress.read_bytes() == b'{"lesson-a": "in_progress"}\n'
```

- [ ] **Step 2: Run tests and verify failure**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_updater.py -q
```

Expected: collection fails because `codex_textbook.updater` does not exist.

- [ ] **Step 3: Implement remote checks with bounded offline behavior**

Create `src/codex_textbook/updater.py`:

```python
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
    root: Path, fetch_text: Callable[[str], str] | None = None
) -> UpdateViewState:
    manifest = load_course_manifest(root / "course-manifest.yml")
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    url = manifest.course.remote_manifest_url
    if not url:
        return UpdateViewState("unknown", manifest.course.version, None, now, (), (), None)
    try:
        raw = (fetch_text or _default_fetch)(url)
        data = yaml.safe_load(raw)
        latest = str(data["course"]["version"])
        raw_changes = data.get("changes", {})
        changes_zh = tuple(str(item) for item in raw_changes.get("zh", []))
        changes_en = tuple(str(item) for item in raw_changes.get("en", []))
    except (OSError, KeyError, TypeError, yaml.YAMLError, urllib.error.URLError) as exc:
        return UpdateViewState("offline", manifest.course.version, None, now, (), (), str(exc))
    kind = "available" if _version(latest) > _version(manifest.course.version) else "current"
    return UpdateViewState(kind, manifest.course.version, latest, now, changes_zh, changes_en, None)


def _snapshot(root: Path) -> dict[str, bytes]:
    snapshot: dict[str, bytes] = {}
    for base in (root / ".course-state", root / "my-notes"):
        if not base.exists():
            continue
        for path in sorted(p for p in base.rglob("*") if p.is_file()):
            snapshot[str(path.relative_to(root))] = path.read_bytes()
    return snapshot


def _restore(root: Path, snapshot: dict[str, bytes]) -> None:
    protected = (root / ".course-state", root / "my-notes")
    expected = {root / relative for relative in snapshot}
    for base in protected:
        if base.exists():
            for path in sorted((p for p in base.rglob("*") if p.is_file()), reverse=True):
                if path not in expected:
                    path.unlink()
    for relative, content in snapshot.items():
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
```

- [ ] **Step 4: Add the clean-tree gate, exact confirmation, and preservation verification**

Append to `src/codex_textbook/updater.py`:

```python
def apply_update(
    root: Path,
    confirm_version: str,
    run: Callable[..., CompletedProcess[str]] | None = None,
) -> UpdateViewState:
    runner = run or subprocess.run
    status = runner(
        ["git", "status", "--porcelain", "--untracked-files=no"],
        cwd=root, text=True, capture_output=True, check=True,
    )
    if status.stdout.strip():
        raise UpdateError("tracked files have local changes; review them before updating")
    available = check_update(root)
    if available.kind != "available" or not available.latest_version:
        raise UpdateError("no confirmed update is available")
    if confirm_version != available.latest_version:
        raise UpdateError("confirmation version does not match the available version")
    before = _snapshot(root)
    runner(["git", "pull", "--ff-only"], cwd=root, text=True, capture_output=True, check=True)
    installed = load_course_manifest(root / "course-manifest.yml").course.version
    if installed != confirm_version:
        raise UpdateError(f"installed version {installed} does not match {confirm_version}")
    after = _snapshot(root)
    if after != before:
        _restore(root, before)
        raise UpdateError("protected user data changed during update and was restored")
    return UpdateViewState(
        "current", installed, installed,
        datetime.now(timezone.utc).isoformat(timespec="seconds"),
        available.changes_zh, available.changes_en, None,
    )
```

- [ ] **Step 5: Run updater tests and commit**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_updater.py -q
```

Expected: `4 passed`.

```powershell
git add src/codex_textbook/updater.py
git commit -m "feat: add confirmed safe textbook updates"
```

---

### Task 6: CLI and Project-Local Codex Skill

**Files:**
- Create: `src/codex_textbook/cli.py`
- Create: `.codex/skills/bilingual-textbook/SKILL.md`
- Create: `.codex/skills/bilingual-textbook/agents/openai.yaml`
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_cli_and_skill.py`

**Interfaces:**
- Consumes: manifest, state, validation, rendering, and updater interfaces from Tasks 1–5.
- Produces CLI commands: `init`, `render`, `validate`, `set-language`, `set-progress`, `check-update`, `apply-update --confirm-version VERSION`.
- Produces the `bilingual-textbook` Skill with no R or SSH execution path.

- [ ] **Step 1: Write failing CLI and Skill-policy tests**

Create `D:\codextest\codex-bilingual-textbook-ui\test_cli_and_skill.py`:

```python
from pathlib import Path
import subprocess
import sys


ROOT = Path(r"D:\bioinformatics")


def test_cli_init_generates_views():
    result = subprocess.run(
        [sys.executable, "-m", "codex_textbook.cli", "--root", str(ROOT), "init"],
        text=True, capture_output=True,
    )
    assert result.returncode == 0, result.stderr
    assert (ROOT / "START_HERE.md").exists()
    assert (ROOT / "COURSE_STATUS.md").exists()


def test_skill_forbids_v1_execution_and_custom_chat():
    text = (ROOT / ".codex/skills/bilingual-textbook/SKILL.md").read_text(encoding="utf-8")
    assert "Do not run R" in text
    assert "Do not connect to SSH" in text
    assert "Use Codex native conversation" in text


def test_cli_switches_language_and_rejects_unknown_lesson():
    try:
        switched = subprocess.run(
            [sys.executable, "-m", "codex_textbook.cli", "--root", str(ROOT), "set-language", "en"],
            text=True, capture_output=True,
        )
        assert switched.returncode == 0, switched.stderr
        assert "No lessons have been published" in (ROOT / "START_HERE.md").read_text(encoding="utf-8")
        rejected = subprocess.run(
            [sys.executable, "-m", "codex_textbook.cli", "--root", str(ROOT), "set-progress", "missing", "completed"],
            text=True, capture_output=True,
        )
        assert rejected.returncode == 2
        assert "unknown lesson id" in rejected.stderr
    finally:
        subprocess.run(
            [sys.executable, "-m", "codex_textbook.cli", "--root", str(ROOT), "set-language", "zh"],
            text=True, capture_output=True,
        )
```

- [ ] **Step 2: Run tests and verify failure**

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_cli_and_skill.py -q
```

Expected: CLI import or Skill-file assertions fail.

- [ ] **Step 3: Implement the CLI with explicit update confirmation**

Create `src/codex_textbook/cli.py`:

```python
from argparse import ArgumentParser
from pathlib import Path
import sys

from .manifest import load_course_manifest, load_dataset_catalog
from .render import UpdateViewState, render_dataset_catalog, render_user_views
from .state import load_state, save_state, set_language, set_lesson_status
from .updater import UpdateError, apply_update, check_update
from .validation import default_url_checker, validate_repository


def parser() -> ArgumentParser:
    value = ArgumentParser(prog="course-tool")
    value.add_argument("--root", type=Path, default=Path.cwd())
    commands = value.add_subparsers(dest="command", required=True)
    commands.add_parser("init")
    commands.add_parser("render")
    validate = commands.add_parser("validate")
    validate.add_argument("--check-links", action="store_true")
    language = commands.add_parser("set-language")
    language.add_argument("language", choices=("zh", "en"))
    progress = commands.add_parser("set-progress")
    progress.add_argument("lesson_id")
    progress.add_argument("status", choices=("not_started", "in_progress", "completed"))
    commands.add_parser("check-update")
    update = commands.add_parser("apply-update")
    update.add_argument("--confirm-version", required=True)
    return value


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    root = args.root.resolve()
    try:
        if args.command in {"init", "render"}:
            manifest = load_course_manifest(root / "course-manifest.yml")
            update = UpdateViewState("unknown", manifest.course.version, None, None, (), (), None)
            render_dataset_catalog(root)
            render_user_views(root, update)
            return 0
        if args.command == "validate":
            issues = validate_repository(
                root,
                load_course_manifest(root / "course-manifest.yml"),
                load_dataset_catalog(root / "datasets/catalog.yml"),
                check_url=default_url_checker if args.check_links else None,
            )
            for issue in issues:
                print(f"{issue.level}: {issue.code}: {issue.message}")
            return 1 if any(issue.level == "error" for issue in issues) else 0
        if args.command == "set-language":
            manifest = load_course_manifest(root / "course-manifest.yml")
            state = set_language(load_state(root, manifest.course.default_language), args.language)
            save_state(root, state)
            update = UpdateViewState("unknown", manifest.course.version, None, None, (), (), None)
            render_user_views(root, update)
            return 0
        if args.command == "set-progress":
            manifest = load_course_manifest(root / "course-manifest.yml")
            if args.lesson_id not in {lesson.id for lesson in manifest.lessons}:
                raise ValueError(f"unknown lesson id: {args.lesson_id}")
            state = set_lesson_status(
                load_state(root, manifest.course.default_language),
                args.lesson_id,
                args.status,
            )
            save_state(root, state)
            update = UpdateViewState("unknown", manifest.course.version, None, None, (), (), None)
            render_user_views(root, update)
            return 0
        if args.command == "check-update":
            state = check_update(root)
            render_user_views(root, state)
            print(state.kind)
            return 0
        if args.command == "apply-update":
            state = apply_update(root, args.confirm_version)
            render_dataset_catalog(root)
            render_user_views(root, state)
            print(state.kind)
            return 0
    except (OSError, ValueError, UpdateError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Initialize and write the project-local Skill**

Run the Skill Creator initializer from its installed directory, targeting `.codex/skills`, with the interface values below; remove any generated placeholder resource not listed in the file map:

```powershell
python C:\Users\aaa\.codex\skills\.system\skill-creator\scripts\init_skill.py bilingual-textbook --path D:\bioinformatics\.codex\skills --interface "display_name=Bilingual Textbook" --interface "short_description=Open and study this bilingual Codex-native textbook" --interface "default_prompt=Open the course, continue from my saved position, and answer questions from the current lesson."
```

Replace `.codex/skills/bilingual-textbook/SKILL.md` with:

```markdown
---
name: bilingual-textbook
description: Open, navigate, validate, update, and study this project-local bilingual Codex-native textbook. Use when the user asks to open the course, continue learning, switch Chinese or English, inspect a lesson, understand textbook code or figures, view external datasets, check course updates, or manage local learning progress.
---

# Bilingual Textbook

## Open the course

1. Read `course-manifest.yml` and `OPEN_COURSE.md`.
2. If `START_HERE.md` or `COURSE_STATUS.md` is missing, run `course-tool --root <project-root> init`.
3. Open `START_HERE.md` and follow the user's language preference from `.course-state/preferences.json` when available.

## Language and progress

Run `course-tool --root <project-root> set-language zh|en` only when the user asks to switch the whole textbook language. Run `set-progress <lesson-id> not_started|in_progress|completed` only when the user explicitly asks to record that state; never infer completion from merely opening a page.

## Answer questions

Use Codex native conversation. Read the cited lesson, adjacent code, figure caption, dataset entry, and linked source context needed for the answer. Let the user ask freely; do not replace their question with preset actions.

## Handle datasets

Read `datasets/CATALOG.md` and `datasets/catalog.yml`. Explain source, size, license, checksum, and download commands. Version 1 never downloads a dataset.

## Check updates

Run `course-tool --root <project-root> check-update`. Explain the reported changes. Run `apply-update --confirm-version <exact-version>` only after the user explicitly approves that exact version.

## Version 1 safety boundary

- Do not run R, Python analysis, Linux analysis commands, Cell Ranger, or schedulers.
- Do not connect to SSH or request server credentials.
- Do not create a custom chat UI; use Codex native conversation.
- Do not overwrite `.course-state/`, `my-notes/`, or downloaded data.
```

Regenerate `agents/openai.yaml` if the initializer output does not match the three interface values.

- [ ] **Step 5: Validate the Skill, run tests, and commit**

Run:

```powershell
python C:\Users\aaa\.codex\skills\.system\skill-creator\scripts\quick_validate.py D:\bioinformatics\.codex\skills\bilingual-textbook
python -m pytest D:\codextest\codex-bilingual-textbook-ui\test_cli_and_skill.py -q
```

Expected: Skill validation succeeds and `3 passed`.

Commit:

```powershell
git add src/codex_textbook/cli.py .codex/skills/bilingual-textbook
git commit -m "feat: add bilingual textbook Codex skill"
```

---

### Task 7: End-to-End Acceptance and First-Version Safety Audit

**Files:**
- Modify only if acceptance reveals a defect: files created in Tasks 1–6.
- Test: `D:\codextest\codex-bilingual-textbook-ui\test_acceptance.py`
- Test output: `D:\codextest\codex-bilingual-textbook-ui\acceptance.log`

**Interfaces:**
- Consumes all public interfaces and CLI commands from Tasks 1–6.
- Produces a verified, content-neutral first-version textbook shell.

- [ ] **Step 1: Write the end-to-end acceptance test**

Create `D:\codextest\codex-bilingual-textbook-ui\test_acceptance.py`:

```python
from pathlib import Path
import subprocess
import sys


ROOT = Path(r"D:\bioinformatics")


def run(*args):
    return subprocess.run(
        [sys.executable, "-m", "codex_textbook.cli", "--root", str(ROOT), *args],
        text=True, capture_output=True,
    )


def test_first_version_acceptance():
    assert run("init").returncode == 0
    validation = run("validate")
    assert validation.returncode == 0, validation.stdout + validation.stderr
    home = (ROOT / "START_HERE.md").read_text(encoding="utf-8")
    status = (ROOT / "COURSE_STATUS.md").read_text(encoding="utf-8")
    catalog = (ROOT / "datasets/CATALOG.md").read_text(encoding="utf-8")
    assert "尚未发布章节" in home
    assert "本地 R：第一版未开放" in home + status
    assert "SSH/HPC：第一版未开放" in home + status
    assert "尚未发布数据条目" in catalog
    assert (ROOT / "START_HERE.zh.md").exists()
    assert (ROOT / "START_HERE.en.md").exists()
    assert (ROOT / "COURSE_STATUS.zh.md").exists()
    assert (ROOT / "COURSE_STATUS.en.md").exists()
    assert (ROOT / "datasets/CATALOG.zh.md").exists()
    assert (ROOT / "datasets/CATALOG.en.md").exists()
    assert (ROOT / ".course-state/progress.json").exists()
    assert (ROOT / ".course-state/preferences.json").exists()


def test_no_first_version_execution_surface():
    forbidden = ("paramiko", "ssh ", "Rscript", "cellranger", "sbatch", "qsub")
    source = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "src").rglob("*.py")
    )
    assert all(token not in source for token in forbidden)
```

- [ ] **Step 2: Run the full suite and capture evidence outside the repository**

Run:

```powershell
python -m pytest D:\codextest\codex-bilingual-textbook-ui -q 2>&1 | Tee-Object -FilePath D:\codextest\codex-bilingual-textbook-ui\acceptance.log
```

Expected: all tests pass; the log contains no failures or errors.

- [ ] **Step 3: Run direct CLI and repository checks**

Run:

```powershell
course-tool --root D:\bioinformatics init
course-tool --root D:\bioinformatics validate
git status --short
git check-ignore START_HERE.md COURSE_STATUS.md .course-state/progress.json my-notes/example.md
```

Expected:

- `init` and `validate` exit `0`.
- `git status --short` shows only any intentional tracked changes awaiting the final commit; generated views and state do not appear.
- `git check-ignore` prints all four ignored paths.

- [ ] **Step 4: Inspect the rendered Markdown and repair only acceptance defects**

Open these files in Codex and verify readable Markdown hierarchy, links, disabled interfaces, and no subject-matter content:

```text
D:\bioinformatics\OPEN_COURSE.md
D:\bioinformatics\START_HERE.md
D:\bioinformatics\START_HERE.zh.md
D:\bioinformatics\START_HERE.en.md
D:\bioinformatics\datasets\CATALOG.zh.md
D:\bioinformatics\datasets\CATALOG.en.md
D:\bioinformatics\COURSE_STATUS.md
```

If a defect is found, add a focused regression assertion to the relevant external test file, run it to observe failure, patch the smallest responsible source file, and rerun the full suite.

- [ ] **Step 5: Final implementation commit**

```powershell
git add pyproject.toml course-manifest.yml datasets OPEN_COURSE.md ui src .codex/skills/bilingual-textbook .gitignore
git commit -m "feat: complete Codex textbook UI shell"
git status --short
```

Expected: commit succeeds and the final status is clean.

---

## Plan Self-Review Checklist

- Every approved UI page maps to a rendering or tracked Markdown artifact.
- Whole-page language switching is represented by paired manifest paths and lesson templates.
- Codex native conversation is enforced in the Skill; no custom chat component exists.
- External dataset metadata is present without storage or automatic download behavior.
- `.course-state/`, `my-notes/`, generated home, and generated status are ignored and verified.
- Offline update checks remain readable and do not claim the course is current.
- Dirty tracked files block updates.
- Exact-version confirmation is required before `git pull --ff-only`.
- R and SSH are visible only as disabled text and absent from runtime code.
- All tests and logs live under `D:\codextest\codex-bilingual-textbook-ui`.
