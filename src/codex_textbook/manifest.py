from pathlib import Path
from typing import Any
import re

import yaml

from .models import (
    CourseInfo,
    CourseManifest,
    DatasetCatalog,
    DatasetEntry,
    Lesson,
    ManifestError,
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

    raw_lessons = data.get("lessons", [])
    if not isinstance(raw_lessons, list):
        raise ManifestError("lessons must be a list")
    seen: set[str] = set()
    lessons: list[Lesson] = []
    for raw in raw_lessons:
        if not isinstance(raw, dict):
            raise ManifestError("each lesson must be a mapping")
        lesson_id = str(_required(raw, "id", "lesson"))
        if lesson_id in seen:
            raise ManifestError(f"duplicate lesson id: {lesson_id}")
        seen.add(lesson_id)
        lessons.append(
            Lesson(
                id=lesson_id,
                order=int(_required(raw, "order", f"lesson {lesson_id}")),
                zh=Path(raw["zh"]) if raw.get("zh") else None,
                en=Path(raw["en"]) if raw.get("en") else None,
            )
        )
    lessons.sort(key=lambda item: item.order)
    return CourseManifest(1, course, tuple(lessons))


def load_dataset_catalog(path: Path) -> DatasetCatalog:
    data = _read_yaml(path)
    if data.get("schema_version") != 1:
        raise ManifestError("dataset schema_version must be 1")

    raw_datasets = data.get("datasets", [])
    if not isinstance(raw_datasets, list):
        raise ManifestError("datasets must be a list")
    entries: list[DatasetEntry] = []
    seen: set[str] = set()
    for raw in raw_datasets:
        if not isinstance(raw, dict):
            raise ManifestError("each dataset must be a mapping")
        dataset_id = str(_required(raw, "id", "dataset"))
        if dataset_id in seen:
            raise ManifestError(f"duplicate dataset id: {dataset_id}")
        seen.add(dataset_id)

        names = _required(raw, "name", f"dataset {dataset_id}")
        purposes = _required(raw, "purpose", f"dataset {dataset_id}")
        if not isinstance(names, dict) or not names.get("zh") or not names.get("en"):
            raise ManifestError(f"dataset {dataset_id}.name requires zh and en")
        if (
            not isinstance(purposes, dict)
            or not purposes.get("zh")
            or not purposes.get("en")
        ):
            raise ManifestError(f"dataset {dataset_id}.purpose requires zh and en")

        entries.append(
            DatasetEntry(
                id=dataset_id,
                name_zh=str(names["zh"]),
                name_en=str(names["en"]),
                source=str(_required(raw, "source", f"dataset {dataset_id}")),
                source_url=str(_required(raw, "source_url", f"dataset {dataset_id}")),
                purpose_zh=str(purposes["zh"]),
                purpose_en=str(purposes["en"]),
                file_type=str(_required(raw, "file_type", f"dataset {dataset_id}")),
                download_size=str(
                    _required(raw, "download_size", f"dataset {dataset_id}")
                ),
                extracted_size=str(
                    _required(raw, "extracted_size", f"dataset {dataset_id}")
                ),
                license=str(_required(raw, "license", f"dataset {dataset_id}")),
                checksum_algorithm=raw.get("checksum_algorithm"),
                checksum=raw.get("checksum"),
                download_command=raw.get("download_command"),
            )
        )
    return DatasetCatalog(1, tuple(entries))
