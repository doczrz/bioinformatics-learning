import type {
  ContentReleaseManifest,
  UpdateCheckResult,
} from "../contracts";
import {
  contentReleaseManifestSchema,
  courseFileSchema,
} from "../schemas";
import type { CachedRelease, ContentCache } from "./content-cache";

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const ALLOWED_GITHUB_HOSTS = new Set([
  "github.com",
  "raw.githubusercontent.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
]);

const SAFE_ASSET_PATH = /^[^\\]+$/;

function compareVersions(left: string, right: string): number {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function assertGithubUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:" || !ALLOWED_GITHUB_HOSTS.has(url.hostname)) {
    throw new Error("Content URLs must use HTTPS on an allowed GitHub host.");
  }
  return url;
}

function assertSafeAssetPath(path: string): void {
  const parts = path.split("/");
  if (
    !SAFE_ASSET_PATH.test(path) ||
    path.startsWith("/") ||
    parts.some((part) => part === "" || part === "." || part === "..") ||
    /^[a-z][a-z0-9+.-]*:/i.test(path)
  ) {
    throw new Error(`Unsafe asset path: ${path}`);
  }
}

function assertImmutableAssetUrl(
  assetUrl: string,
  manifest: ContentReleaseManifest,
): void {
  const url = assertGithubUrl(assetUrl);
  const path = decodeURIComponent(url.pathname);
  const lowered = path.toLowerCase();
  if (
    lowered.includes("/refs/heads/") ||
    lowered.includes("/raw/main") ||
    lowered.includes("/raw/master") ||
    (!path.includes(manifest.releaseTag) && !path.includes(manifest.commitSha))
  ) {
    throw new Error("Content asset URL must identify an immutable GitHub release.");
  }
}

function checkedManifest(value: unknown): ContentReleaseManifest {
  const manifest = contentReleaseManifestSchema.parse(value);
  const paths = new Set<string>();
  for (const asset of manifest.assets) {
    assertSafeAssetPath(asset.path);
    if (paths.has(asset.path)) {
      throw new Error(`Duplicate release asset path: ${asset.path}`);
    }
    paths.add(asset.path);
    assertImmutableAssetUrl(asset.url, manifest);
  }
  return manifest;
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function decodeCourse(bytes: ArrayBuffer) {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return courseFileSchema.parse(JSON.parse(text));
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "invalid content";
    throw new Error(`Invalid course.json: ${message}`);
  }
}

export interface ContentUpdateClient {
  check(currentVersion: string): Promise<UpdateCheckResult>;
  apply(
    expectedCurrentVersion: string,
    targetVersion: string,
  ): Promise<ContentReleaseManifest>;
}

interface ContentUpdateServiceOptions {
  manifestUrl: string | null;
  uiVersion: string;
  courseId: string;
  cache: ContentCache;
  fetcher?: Fetcher;
  crypto?: Crypto;
}

interface CheckedRelease {
  currentVersion: string;
  targetVersion: string;
  commitSha: string;
  compatible: boolean;
}

export class ContentUpdateService implements ContentUpdateClient {
  private readonly manifestUrl: string | null;
  private readonly uiVersion: string;
  private readonly courseId: string;
  private readonly cache: ContentCache;
  private readonly fetcher: Fetcher;
  private readonly crypto: Crypto;
  private checked: CheckedRelease | null = null;

  constructor(options: ContentUpdateServiceOptions) {
    this.manifestUrl = options.manifestUrl;
    this.uiVersion = options.uiVersion;
    this.courseId = options.courseId;
    this.cache = options.cache;
    this.fetcher =
      options.fetcher ?? ((input, init) => globalThis.fetch(input, init));
    this.crypto = options.crypto ?? globalThis.crypto;
  }

  private async fetchManifest(): Promise<ContentReleaseManifest> {
    if (!this.manifestUrl) throw new Error("Online course updates are not configured.");
    const url = assertGithubUrl(this.manifestUrl);
    const response = await this.fetcher(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Content manifest request failed (${response.status}).`);
    }
    const manifest = checkedManifest(await response.json());
    if (manifest.courseId !== this.courseId) {
      throw new Error("The content manifest belongs to a different course.");
    }
    return manifest;
  }

  async check(currentVersion: string): Promise<UpdateCheckResult> {
    this.checked = null;
    if (!this.manifestUrl) {
      return {
        configured: false,
        updateAvailable: false,
        currentVersion,
      };
    }
    const manifest = await this.fetchManifest();
    const updateAvailable = compareVersions(manifest.contentVersion, currentVersion) > 0;
    const compatible = compareVersions(this.uiVersion, manifest.minimumUiVersion) >= 0;
    if (updateAvailable) {
      this.checked = {
        currentVersion,
        targetVersion: manifest.contentVersion,
        commitSha: manifest.commitSha,
        compatible,
      };
    }
    return {
      configured: true,
      updateAvailable,
      currentVersion,
      targetVersion: manifest.contentVersion,
      compatible,
      minimumUiVersion: manifest.minimumUiVersion,
      downloadBytes: manifest.assets.reduce((total, asset) => total + asset.sizeBytes, 0),
      summary: manifest.summary,
    };
  }

  async apply(
    expectedCurrentVersion: string,
    targetVersion: string,
  ): Promise<ContentReleaseManifest> {
    if (!this.checked || expectedCurrentVersion !== this.checked.currentVersion) {
      throw new Error("The checked current version no longer matches the open course.");
    }
    if (targetVersion !== this.checked.targetVersion) {
      throw new Error("The checked target version does not match the requested update.");
    }
    if (!this.checked.compatible) {
      throw new Error("The checked release requires a newer textbook UI.");
    }

    const manifest = await this.fetchManifest();
    if (
      manifest.contentVersion !== this.checked.targetVersion ||
      manifest.commitSha !== this.checked.commitSha
    ) {
      throw new Error("The content release changed since it was checked. Check again.");
    }

    const assets: Record<string, ArrayBuffer> = {};
    for (const asset of manifest.assets) {
      const response = await this.fetcher(asset.url);
      if (!response.ok) {
        throw new Error(`Content asset request failed (${response.status}): ${asset.path}`);
      }
      const bytes = await response.arrayBuffer();
      if (bytes.byteLength !== asset.sizeBytes) {
        throw new Error(`Content asset size mismatch: ${asset.path}`);
      }
      const digest = hex(await this.crypto.subtle.digest("SHA-256", bytes));
      if (digest !== asset.sha256) {
        throw new Error(`Content asset SHA-256 mismatch: ${asset.path}`);
      }
      assets[asset.path] = bytes;
    }

    const courseBytes = assets["course.json"];
    if (!courseBytes) throw new Error("The release does not contain course.json.");
    const course = decodeCourse(courseBytes);
    if (
      course.courseId !== manifest.courseId ||
      course.contentVersion !== manifest.contentVersion
    ) {
      throw new Error("course.json does not match the checked content release.");
    }
    for (const lesson of course.lessons) {
      if (
        !assets[`lessons/${lesson.id}.zh.md`] ||
        !assets[`lessons/${lesson.id}.en.md`]
      ) {
        throw new Error(`Missing paired lesson asset: ${lesson.id}`);
      }
    }

    const release: CachedRelease = { manifest, assets };
    await this.cache.activate(release);
    this.checked = null;
    return manifest;
  }
}
