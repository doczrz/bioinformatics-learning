from argparse import ArgumentParser
from pathlib import Path
import subprocess
import sys

from .manifest import load_course_manifest, load_dataset_catalog
from .render import UpdateViewState, render_dataset_catalog, render_user_views
from .release import build_release_manifest
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
    progress.add_argument(
        "status", choices=("not_started", "in_progress", "completed")
    )

    commands.add_parser("check-update")
    update = commands.add_parser("apply-update")
    update.add_argument("--confirm-version", required=True)

    release = commands.add_parser("build-release")
    release.add_argument("--output", type=Path, required=True)
    release.add_argument("--version", required=True)
    release.add_argument("--release-tag", required=True)
    release.add_argument("--commit-sha", required=True)
    release.add_argument("--minimum-ui-version", required=True)
    release.add_argument("--summary-zh", required=True)
    release.add_argument("--summary-en", required=True)
    release.add_argument("--asset-base-url", required=True)
    return value


def _unknown_update(version: str) -> UpdateViewState:
    return UpdateViewState("unknown", version, None, None, (), (), None)


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    root = args.root.resolve()
    try:
        if args.command in {"init", "render"}:
            manifest = load_course_manifest(root / "course-manifest.yml")
            render_dataset_catalog(root)
            render_user_views(root, _unknown_update(manifest.course.version))
            return 0

        if args.command == "validate":
            issues = validate_repository(
                root,
                load_course_manifest(root / "course-manifest.yml"),
                load_dataset_catalog(root / "datasets/catalog.yml"),
                check_url=default_url_checker if args.check_links else None,
            )
            for issue in issues:
                location = f" ({issue.path})" if issue.path else ""
                print(
                    f"{issue.level}: {issue.code}: {issue.message}{location}"
                )
            return 1 if any(issue.level == "error" for issue in issues) else 0

        if args.command == "set-language":
            manifest = load_course_manifest(root / "course-manifest.yml")
            state = set_language(
                load_state(root, manifest.course.default_language), args.language
            )
            save_state(root, state)
            render_user_views(root, _unknown_update(manifest.course.version))
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
            render_user_views(root, _unknown_update(manifest.course.version))
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

        if args.command == "build-release":
            release = build_release_manifest(
                root,
                args.output,
                version=args.version,
                release_tag=args.release_tag,
                commit_sha=args.commit_sha,
                minimum_ui_version=args.minimum_ui_version,
                summary_zh=args.summary_zh,
                summary_en=args.summary_en,
                asset_base_url=args.asset_base_url,
            )
            print(args.output / "release-manifest.json")
            print(f"{len(release['assets'])} assets")
            return 0
    except (OSError, ValueError, UpdateError, subprocess.SubprocessError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
