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
