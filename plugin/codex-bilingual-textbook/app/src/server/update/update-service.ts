import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  ContentReleaseManifest,
  Language,
  UpdateApplyResult,
  UpdateCheckResult,
} from "../../shared/contracts";
import {
  contentReleaseManifestSchema,
  courseFileSchema,
} from "../../shared/schemas";
import { CacheStore } from "./cache-store";
import {
  assertAllowedGitHubUrl,
  FetchHttpClient,
  type HttpClient,
} from "./http-client";

interface UpdateServiceOptions {
  latestManifestUrl?: string;
  pluginVersion: string;
  httpClient?: HttpClient;
  cacheStore: CacheStore;
}

export interface CourseUpdateService {
  checkCourseUpdate(currentVersion: string, language: Language): Promise<UpdateCheckResult>;
  applyCourseUpdate(
    expectedCurrentVersion: string,
    targetVersion: string,
  ): Promise<UpdateApplyResult>;
}

function versionParts(version: string): [number, number, number] {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) throw new Error(`Unsupported semantic version: ${version}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function versionAtLeast(actual: string, required: string): boolean {
  const left = versionParts(actual);
  const right = versionParts(required);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] > right[index];
  }
  return true;
}

export class UpdateService {
  private readonly latestManifestUrl?: string;
  private readonly pluginVersion: string;
  private readonly httpClient: HttpClient;
  private readonly cacheStore: CacheStore;
  private checked:
    | { currentVersion: string; manifest: ContentReleaseManifest }
    | undefined;

  constructor(options: UpdateServiceOptions) {
    this.latestManifestUrl = options.latestManifestUrl;
    this.pluginVersion = options.pluginVersion;
    this.httpClient = options.httpClient ?? new FetchHttpClient();
    this.cacheStore = options.cacheStore;
  }

  private async fetchManifest(): Promise<ContentReleaseManifest> {
    if (!this.latestManifestUrl) {
      throw new Error("Online course updates are not configured.");
    }
    assertAllowedGitHubUrl(this.latestManifestUrl);
    const result = await this.httpClient.getJson(this.latestManifestUrl);
    assertAllowedGitHubUrl(result.finalUrl);
    const manifest = contentReleaseManifestSchema.parse(result.data);
    for (const asset of manifest.assets) assertAllowedGitHubUrl(asset.url);
    return manifest;
  }

  async checkCourseUpdate(
    currentVersion: string,
    language: Language,
  ): Promise<UpdateCheckResult> {
    void language;
    if (!this.latestManifestUrl) {
      return {
        configured: false,
        updateAvailable: false,
        currentVersion,
        message: "Online course updates are not configured.",
      };
    }
    const manifest = await this.fetchManifest();
    this.checked = { currentVersion, manifest };
    return {
      configured: true,
      updateAvailable: manifest.contentVersion !== currentVersion,
      currentVersion,
      targetVersion: manifest.contentVersion,
      compatible: versionAtLeast(
        this.pluginVersion,
        manifest.minimumPluginVersion,
      ),
      minimumPluginVersion: manifest.minimumPluginVersion,
      downloadBytes: manifest.assets.reduce(
        (total, asset) => total + asset.sizeBytes,
        0,
      ),
      summary: manifest.summary,
    };
  }

  async applyCourseUpdate(
    expectedCurrentVersion: string,
    targetVersion: string,
  ): Promise<UpdateApplyResult> {
    if (
      !this.checked ||
      this.checked.currentVersion !== expectedCurrentVersion ||
      this.checked.manifest.contentVersion !== targetVersion
    ) {
      throw new Error("Apply requires the exact checked target version.");
    }
    if (
      !versionAtLeast(
        this.pluginVersion,
        this.checked.manifest.minimumPluginVersion,
      )
    ) {
      throw new Error(
        `Content ${targetVersion} requires plugin ${this.checked.manifest.minimumPluginVersion} or newer.`,
      );
    }
    if (targetVersion === expectedCurrentVersion) {
      return { applied: false, contentVersion: targetVersion };
    }

    const active = await this.cacheStore.readActive();
    if (active?.activeVersion === targetVersion) {
      return { applied: false, contentVersion: targetVersion };
    }
    if (active && active.activeVersion !== expectedCurrentVersion) {
      throw new Error("Active content changed after the update check.");
    }

    const manifest = await this.fetchManifest();
    if (
      manifest.contentVersion !== targetVersion ||
      manifest.commitSha !== this.checked.manifest.commitSha
    ) {
      throw new Error("The checked content release changed; check again.");
    }
    if (!versionAtLeast(this.pluginVersion, manifest.minimumPluginVersion)) {
      throw new Error(
        `Content ${targetVersion} requires plugin ${manifest.minimumPluginVersion} or newer.`,
      );
    }

    const staging = await this.cacheStore.createStaging();
    let stagedRevision: number;
    try {
      for (const asset of manifest.assets) {
        const response = await this.httpClient.getBytes(asset.url);
        assertAllowedGitHubUrl(response.finalUrl);
        if (response.data.byteLength !== asset.sizeBytes) {
          throw new Error(`Asset size mismatch: ${asset.path}`);
        }
        const digest = createHash("sha256").update(response.data).digest("hex");
        if (digest !== asset.sha256) {
          throw new Error(`Asset checksum mismatch: ${asset.path}`);
        }
        await this.cacheStore.writeAsset(staging, asset.path, response.data);
      }
      const stagedCourse = courseFileSchema.parse(
        JSON.parse(await readFile(path.join(staging, "course.json"), "utf8")),
      );
      if (
        stagedCourse.courseId !== manifest.courseId ||
        stagedCourse.contentVersion !== manifest.contentVersion
      ) {
        throw new Error("Staged course identity does not match the release manifest.");
      }
      stagedRevision = stagedCourse.revision;
      await this.cacheStore.activate(
        staging,
        targetVersion,
        expectedCurrentVersion,
      );
    } catch (error) {
      await this.cacheStore.discardStaging(staging);
      throw error;
    }

    return {
      applied: true,
      contentVersion: targetVersion,
      revision: stagedRevision,
    };
  }
}
