from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import shutil
from typing import Any
from urllib.parse import quote, urlparse

from .manifest import load_course_manifest, load_dataset_catalog
from .models import CourseManifest, DatasetCatalog
from .validation import validate_release_pairs, validate_repository


SEMVER = re.compile(r"^\d+\.\d+\.\d+$")
COMMIT_SHA = re.compile(r"^[a-f0-9]{40}$")
SHA256 = re.compile(r"^[a-f0-9]{64}$")
ALLOWED_GITHUB_HOSTS = {
    "github.com",
    "api.github.com",
    "raw.githubusercontent.com",
    "objects.githubusercontent.com",
    "release-assets.githubusercontent.com",
}


def _semantic_revision(version: str) -> int:
    major, minor, patch = (int(part) for part in version.split("."))
    return major * 1_000_000 + minor * 1_000 + patch


def _safe_source_path(root: Path, relative: Path) -> Path:
    candidate = (root / relative).resolve()
    try:
        candidate.relative_to(root.resolve())
    except ValueError as exc:
        raise ValueError(f"source path escapes repository: {relative}") from exc
    if not candidate.is_file():
        raise ValueError(f"missing release source file: {relative}")
    return candidate


def _first_heading(path: Path) -> str:
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^#{1,6}\s+(.+?)\s*#*\s*$", line)
        if match:
            return match.group(1).strip()
    raise ValueError(f"lesson requires a Markdown heading: {path}")


def _dataset_json(catalog: DatasetCatalog) -> list[dict[str, Any]]:
    values: list[dict[str, Any]] = []
    for dataset in catalog.datasets:
        value: dict[str, Any] = {
            "id": dataset.id,
            "title": {"zh": dataset.name_zh, "en": dataset.name_en},
            "sourceUrl": dataset.source_url,
            "license": dataset.license,
        }
        if (
            dataset.checksum_algorithm
            and dataset.checksum_algorithm.lower() == "sha256"
            and dataset.checksum
        ):
            value["sha256"] = dataset.checksum.lower()
        values.append(value)
    return values


def _assert_immutable_asset_base(
    asset_base_url: str,
    release_tag: str,
    commit_sha: str,
) -> str:
    parsed = urlparse(asset_base_url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_GITHUB_HOSTS:
        raise ValueError("asset_base_url must be an HTTPS public GitHub URL")
    lowered_path = parsed.path.lower()
    mutable_markers = ("/refs/heads/", "/raw/main", "/raw/master", "/main/", "/master/")
    if any(marker in lowered_path for marker in mutable_markers):
        raise ValueError("asset_base_url must identify an immutable GitHub release")
    if release_tag not in parsed.path and commit_sha not in parsed.path:
        raise ValueError("asset_base_url must identify an immutable GitHub release")
    return asset_base_url.rstrip("/")


def validate_release_manifest(manifest: dict[str, object]) -> None:
    if manifest.get("schemaVersion") != 1:
        raise ValueError("release schemaVersion must be 1")
    for field in (
        "courseId",
        "contentVersion",
        "releaseTag",
        "commitSha",
        "minimumUiVersion",
    ):
        if not isinstance(manifest.get(field), str) or not manifest[field]:
            raise ValueError(f"release {field} is required")
    if not SEMVER.fullmatch(str(manifest["contentVersion"])):
        raise ValueError("contentVersion must use major.minor.patch")
    if not SEMVER.fullmatch(str(manifest["minimumUiVersion"])):
        raise ValueError("minimumUiVersion must use major.minor.patch")
    if not COMMIT_SHA.fullmatch(str(manifest["commitSha"])):
        raise ValueError("commitSha must contain 40 lowercase hexadecimal characters")
    summary = manifest.get("summary")
    if not isinstance(summary, dict) or not summary.get("zh") or not summary.get("en"):
        raise ValueError("release summary requires zh and en")
    assets = manifest.get("assets")
    if not isinstance(assets, list) or not assets:
        raise ValueError("release assets must not be empty")
    paths: list[str] = []
    for asset in assets:
        if not isinstance(asset, dict):
            raise ValueError("each release asset must be a mapping")
        asset_path = asset.get("path")
        if not isinstance(asset_path, str) or not asset_path:
            raise ValueError("asset path is required")
        if not SHA256.fullmatch(str(asset.get("sha256", ""))):
            raise ValueError(f"asset sha256 is invalid: {asset_path}")
        if not isinstance(asset.get("sizeBytes"), int) or asset["sizeBytes"] < 0:
            raise ValueError(f"asset sizeBytes is invalid: {asset_path}")
        parsed = urlparse(str(asset.get("url", "")))
        if parsed.scheme != "https" or parsed.hostname not in ALLOWED_GITHUB_HOSTS:
            raise ValueError(f"asset URL is not an allowed GitHub URL: {asset_path}")
        paths.append(asset_path)
    if paths != sorted(paths) or len(paths) != len(set(paths)):
        raise ValueError("release assets must be uniquely sorted by path")


def _copy_file(source: Path, output_root: Path, relative: str) -> None:
    target = output_root.joinpath(*relative.split("/"))
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)


def _write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def _prepare_content(
    source_root: Path,
    output_root: Path,
    manifest: CourseManifest,
    catalog: DatasetCatalog,
    version: str,
) -> None:
    lessons: list[dict[str, object]] = []
    for lesson in manifest.lessons:
        assert lesson.zh is not None and lesson.en is not None
        zh_source = _safe_source_path(source_root, lesson.zh)
        en_source = _safe_source_path(source_root, lesson.en)
        _copy_file(zh_source, output_root, f"lessons/{lesson.id}.zh.md")
        _copy_file(en_source, output_root, f"lessons/{lesson.id}.en.md")
        lessons.append(
            {
                "id": lesson.id,
                "order": lesson.order,
                "title": {
                    "zh": _first_heading(zh_source),
                    "en": _first_heading(en_source),
                },
            }
        )

    _copy_file(source_root / "course-manifest.yml", output_root, "course-manifest.yml")
    _copy_file(source_root / "datasets" / "catalog.yml", output_root, "datasets/catalog.yml")

    figures_root = source_root / "figures"
    if figures_root.is_dir():
        for source in sorted(path for path in figures_root.rglob("*") if path.is_file()):
            relative = source.relative_to(figures_root).as_posix()
            _copy_file(source, output_root, f"figures/{relative}")

    _write_json(
        output_root / "course.json",
        {
            "schemaVersion": 1,
            "courseId": manifest.course.id,
            "contentVersion": version,
            "revision": _semantic_revision(version),
            "defaultLanguage": manifest.course.default_language,
            "title": {
                "zh": manifest.course.title_zh,
                "en": manifest.course.title_en,
            },
            "lessons": lessons,
            "datasets": _dataset_json(catalog),
        },
    )


def build_release_manifest(
    source_root: Path,
    output_root: Path,
    *,
    version: str,
    release_tag: str,
    commit_sha: str,
    minimum_ui_version: str,
    summary_zh: str,
    summary_en: str,
    asset_base_url: str,
) -> dict[str, object]:
    source_root = source_root.resolve()
    output_root = output_root.resolve()
    if not SEMVER.fullmatch(version) or not SEMVER.fullmatch(minimum_ui_version):
        raise ValueError("content and UI versions must use major.minor.patch")
    if not COMMIT_SHA.fullmatch(commit_sha):
        raise ValueError("commit_sha must contain 40 lowercase hexadecimal characters")
    if not summary_zh.strip() or not summary_en.strip():
        raise ValueError("release summary requires zh and en")
    base_url = _assert_immutable_asset_base(asset_base_url, release_tag, commit_sha)

    course = load_course_manifest(source_root / "course-manifest.yml")
    catalog = load_dataset_catalog(source_root / "datasets" / "catalog.yml")
    if course.course.version != version:
        raise ValueError("release version must match course-manifest.yml")
    pair_issues = validate_release_pairs(course)
    if pair_issues:
        raise ValueError(pair_issues[0].message)
    issues = validate_repository(source_root, course, catalog)
    errors = [issue for issue in issues if issue.level == "error"]
    if errors:
        raise ValueError(f"release source validation failed: {errors[0].message}")

    if output_root.exists() and any(output_root.iterdir()):
        raise ValueError("release output directory must be empty")
    output_root.mkdir(parents=True, exist_ok=True)
    _prepare_content(source_root, output_root, course, catalog, version)

    assets: list[dict[str, object]] = []
    for path in sorted(item for item in output_root.rglob("*") if item.is_file()):
        relative = path.relative_to(output_root).as_posix()
        payload = path.read_bytes()
        encoded_path = "/".join(quote(part) for part in relative.split("/"))
        assets.append(
            {
                "path": relative,
                "url": f"{base_url}/{encoded_path}",
                "sizeBytes": len(payload),
                "sha256": hashlib.sha256(payload).hexdigest(),
            }
        )

    release: dict[str, object] = {
        "schemaVersion": 1,
        "courseId": course.course.id,
        "contentVersion": version,
        "releaseTag": release_tag,
        "commitSha": commit_sha,
        "minimumUiVersion": minimum_ui_version,
        "summary": {"zh": summary_zh.strip(), "en": summary_en.strip()},
        "assets": assets,
    }
    validate_release_manifest(release)
    _write_json(output_root / "release-manifest.json", release)
    return release
