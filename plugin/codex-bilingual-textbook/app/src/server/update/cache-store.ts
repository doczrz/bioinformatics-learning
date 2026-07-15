import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import type { ContentStore, Language } from "../../shared/contracts";
import { FileContentStore } from "../content-store";

export interface ActiveContentPointer {
  activeVersion: string;
  previousVersion: string | null;
  activatedAt?: string;
}

function safeRelativePath(value: string): string {
  const normalized = value.replace(/\\/g, "/");
  if (
    normalized.startsWith("/") ||
    normalized.split("/").some((part) => part === ".." || part === "")
  ) {
    throw new Error(`Unsafe content asset path: ${value}`);
  }
  return normalized;
}

export class CacheStore {
  readonly root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  private get stagingRoot() {
    return path.join(this.root, "staging");
  }

  private get versionsRoot() {
    return path.join(this.root, "versions");
  }

  async initialize(): Promise<void> {
    await Promise.all([
      mkdir(this.stagingRoot, { recursive: true }),
      mkdir(this.versionsRoot, { recursive: true }),
    ]);
  }

  async readActive(): Promise<ActiveContentPointer | null> {
    try {
      const parsed = JSON.parse(
        await readFile(path.join(this.root, "active.json"), "utf8"),
      ) as ActiveContentPointer;
      if (typeof parsed.activeVersion !== "string") {
        throw new Error("Invalid active content pointer.");
      }
      return parsed;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async activeContentRoot(): Promise<string | null> {
    const active = await this.readActive();
    return active ? path.join(this.versionsRoot, active.activeVersion) : null;
  }

  async createStaging(): Promise<string> {
    await this.initialize();
    const directory = path.join(this.stagingRoot, randomUUID());
    await mkdir(directory);
    return directory;
  }

  async writeAsset(
    stagingDirectory: string,
    assetPath: string,
    bytes: Uint8Array,
  ): Promise<void> {
    const relativePath = safeRelativePath(assetPath);
    const target = path.join(stagingDirectory, ...relativePath.split("/"));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, bytes);
  }

  async discardStaging(stagingDirectory: string): Promise<void> {
    await rm(stagingDirectory, { recursive: true, force: true });
  }

  async activate(
    stagingDirectory: string,
    targetVersion: string,
    knownPreviousVersion?: string,
  ): Promise<void> {
    await this.initialize();
    const current = await this.readActive();
    const target = path.join(this.versionsRoot, targetVersion);
    try {
      await rename(stagingDirectory, target);
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) {
        throw error;
      }
      await this.discardStaging(stagingDirectory);
    }

    const pointer: ActiveContentPointer = {
      activeVersion: targetVersion,
      previousVersion:
        current?.activeVersion && current.activeVersion !== targetVersion
          ? current.activeVersion
          : current?.previousVersion ??
            (knownPreviousVersion && knownPreviousVersion !== targetVersion
              ? knownPreviousVersion
              : null),
      activatedAt: new Date().toISOString(),
    };
    const temporaryPointer = path.join(this.root, `active-${randomUUID()}.json`);
    await writeFile(temporaryPointer, JSON.stringify(pointer, null, 2), "utf8");
    const activePath = path.join(this.root, "active.json");
    try {
      await rename(temporaryPointer, activePath);
    } catch (error) {
      if (!(error instanceof Error && "code" in error && ["EEXIST", "EPERM"].includes(String(error.code)))) {
        throw error;
      }
      await rm(activePath, { force: true });
      await rename(temporaryPointer, activePath);
    }

    const keep = new Set(
      [pointer.activeVersion, pointer.previousVersion].filter(
        (version): version is string => Boolean(version),
      ),
    );
    for (const version of await readdir(this.versionsRoot)) {
      if (!keep.has(version)) {
        await rm(path.join(this.versionsRoot, version), { recursive: true, force: true });
      }
    }
  }
}

export class ActiveContentStore implements ContentStore {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly bundledStore: ContentStore,
  ) {}

  private async currentStore(): Promise<ContentStore> {
    const activeRoot = await this.cacheStore.activeContentRoot();
    return activeRoot ? new FileContentStore(activeRoot) : this.bundledStore;
  }

  async getCourse() {
    return (await this.currentStore()).getCourse();
  }

  async getLesson(lessonId: string, language: Language) {
    return (await this.currentStore()).getLesson(lessonId, language);
  }

  async getDatasets(language: Language) {
    return (await this.currentStore()).getDatasets(language);
  }
}
