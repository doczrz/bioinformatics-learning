#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPOSITORY = "doczrz/bioinformatics-learning";
const CONTENT_ROOT = "web/public/content/dev";
const OUTPUT_PATH = "web/public/content/release-manifest.json";
const MAX_BUFFER = 64 * 1024 * 1024;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function gitText(args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: MAX_BUFFER,
  }).trim();
}

function gitBytes(path, commitSha) {
  return execFileSync("git", ["show", `${commitSha}:${path}`], {
    cwd: repoRoot,
    encoding: "buffer",
    maxBuffer: MAX_BUFFER,
  });
}

function safeAssetPath(path) {
  const parts = path.split("/");
  return (
    path.length > 0 &&
    !path.includes("\\") &&
    !path.startsWith("/") &&
    !/^[a-z][a-z0-9+.-]*:/i.test(path) &&
    parts.every((part) => part !== "" && part !== "." && part !== "..")
  );
}

function rawUrl(commitSha, path) {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `https://raw.githubusercontent.com/${REPOSITORY}/${commitSha}/${encoded}`;
}

const [commitRef = "HEAD", summaryZh, summaryEn] = process.argv.slice(2);
const commitSha = gitText(["rev-parse", `${commitRef}^{commit}`]);
if (!/^[a-f0-9]{40}$/.test(commitSha)) {
  throw new Error(`Expected a full commit SHA, received: ${commitSha}`);
}

const trackedPaths = gitText([
  "ls-tree",
  "-r",
  "--name-only",
  commitSha,
  "--",
  CONTENT_ROOT,
])
  .split(/\r?\n/)
  .filter(Boolean)
  .sort();

const assetPaths = trackedPaths.map((path) => path.slice(`${CONTENT_ROOT}/`.length));
if (!assetPaths.includes("course.json")) throw new Error("Missing course.json.");
if (assetPaths.some((path) => !safeAssetPath(path))) {
  throw new Error("The content tree contains an unsafe asset path.");
}
if (new Set(assetPaths).size !== assetPaths.length) {
  throw new Error("The content tree contains duplicate asset paths.");
}

const courseBytes = gitBytes(`${CONTENT_ROOT}/course.json`, commitSha);
const course = JSON.parse(courseBytes.toString("utf8"));
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.courseId ?? "")) {
  throw new Error("course.json has an invalid courseId.");
}
if (!/^\d+\.\d+\.\d+$/.test(course.contentVersion ?? "")) {
  throw new Error("course.json has an invalid contentVersion.");
}
if (!Array.isArray(course.lessons) || course.lessons.length === 0) {
  throw new Error("course.json must contain at least one lesson.");
}
for (const lesson of course.lessons) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lesson.id ?? "")) {
    throw new Error("course.json contains an invalid lesson id.");
  }
  for (const language of ["zh", "en"]) {
    const path = `lessons/${lesson.id}.${language}.md`;
    if (!assetPaths.includes(path)) throw new Error(`Missing paired lesson asset: ${path}`);
  }
}

const siteConfig = JSON.parse(
  gitBytes("web/public/content/site-config.json", commitSha).toString("utf8"),
);
if (!/^\d+\.\d+\.\d+$/.test(siteConfig.uiVersion ?? "")) {
  throw new Error("site-config.json has an invalid uiVersion.");
}

const assets = trackedPaths.map((repositoryPath, index) => {
  const bytes = gitBytes(repositoryPath, commitSha);
  return {
    path: assetPaths[index],
    url: rawUrl(commitSha, repositoryPath),
    sizeBytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
});

const manifest = {
  schemaVersion: 1,
  courseId: course.courseId,
  contentVersion: course.contentVersion,
  releaseTag: `content-v${course.contentVersion}`,
  commitSha,
  minimumUiVersion: siteConfig.uiVersion,
  summary: {
    zh: summaryZh ?? `课程内容 ${course.contentVersion}`,
    en: summaryEn ?? `Course content ${course.contentVersion}`,
  },
  assets,
};

const output = resolve(repoRoot, OUTPUT_PATH);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUTPUT_PATH} with ${assets.length} assets from ${commitSha}.`);
