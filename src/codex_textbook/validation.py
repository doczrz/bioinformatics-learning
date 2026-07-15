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
        issues.append(
            ValidationIssue(
                "error", "image-alt-missing", "image alt text is required", path
            )
        )
    if re.search(r"^```\s*$", text, re.MULTILINE):
        issues.append(
            ValidationIssue(
                "error",
                "code-language-missing",
                "code fence language is required",
                path,
            )
        )
    if re.search(r"\[(点击这里|click here)\]", text, re.IGNORECASE):
        issues.append(
            ValidationIssue(
                "error", "vague-link-text", "link text must describe its target", path
            )
        )
    if "START_HERE.md" not in text:
        issues.append(
            ValidationIssue(
                "error", "home-link-missing", "lesson must link to START_HERE.md", path
            )
        )
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
        issues.append(
            ValidationIssue(
                "error", "duplicate-order", "lesson orders must be unique"
            )
        )

    for lesson in manifest.lessons:
        for language, relative in (("zh", lesson.zh), ("en", lesson.en)):
            if relative is None:
                issues.append(
                    ValidationIssue(
                        "warning",
                        "translation-missing",
                        f"{lesson.id} has no {language} page",
                    )
                )
                continue
            path = root / relative
            if not path.is_file():
                issues.append(
                    ValidationIssue(
                        "error",
                        "lesson-file-missing",
                        f"missing {language} lesson {lesson.id}",
                        path,
                    )
                )
                continue
            issues.extend(_markdown_issues(path))

    for dataset in catalog.datasets:
        if not dataset.source_url.startswith(("https://", "http://")):
            issues.append(
                ValidationIssue("error", "dataset-url-invalid", dataset.id)
            )
        if bool(dataset.checksum) != bool(dataset.checksum_algorithm):
            issues.append(
                ValidationIssue("error", "dataset-checksum-incomplete", dataset.id)
            )
        if check_url and not check_url(dataset.source_url):
            issues.append(
                ValidationIssue(
                    "warning", "external-link-unreachable", dataset.source_url
                )
            )
    return tuple(issues)


def validate_release_pairs(
    manifest: CourseManifest,
) -> tuple[ValidationIssue, ...]:
    issues: list[ValidationIssue] = []
    for lesson in manifest.lessons:
        if lesson.zh is None or lesson.en is None:
            issues.append(
                ValidationIssue(
                    "error",
                    "release-translation-pair-missing",
                    f"lesson {lesson.id} requires paired zh and en files for release",
                )
            )
    return tuple(issues)


def default_url_checker(url: str) -> bool:
    try:
        request = urllib.request.Request(
            url,
            method="HEAD",
            headers={"User-Agent": "codex-textbook-validator"},
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            return 200 <= response.status < 400
    except OSError:
        return False
