import type { ContentReleaseManifest } from "../contracts";

export interface CachedRelease {
  manifest: ContentReleaseManifest;
  assets: Record<string, ArrayBuffer>;
}

export interface ContentCache {
  readActive(): Promise<CachedRelease | null>;
  activate(release: CachedRelease): Promise<void>;
}
