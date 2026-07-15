const ALLOWED_HOSTS = new Set([
  "github.com",
  "api.github.com",
  "objects.githubusercontent.com",
]);

export interface HttpResult<T> {
  data: T;
  finalUrl: string;
}

export interface HttpClient {
  getJson(url: string): Promise<HttpResult<unknown>>;
  getBytes(url: string): Promise<HttpResult<Uint8Array>>;
}

export function assertAllowedGitHubUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    throw new Error(`Content URL is not an allowed public GitHub URL: ${value}`);
  }
  return url;
}

async function checkedFetch(url: string): Promise<Response> {
  assertAllowedGitHubUrl(url);
  const response = await fetch(url, { redirect: "follow" });
  assertAllowedGitHubUrl(response.url);
  if (!response.ok) {
    throw new Error(`Content request failed with HTTP ${response.status}.`);
  }
  return response;
}

export class FetchHttpClient implements HttpClient {
  async getJson(url: string): Promise<HttpResult<unknown>> {
    const response = await checkedFetch(url);
    return { data: await response.json(), finalUrl: response.url };
  }

  async getBytes(url: string): Promise<HttpResult<Uint8Array>> {
    const response = await checkedFetch(url);
    return {
      data: new Uint8Array(await response.arrayBuffer()),
      finalUrl: response.url,
    };
  }
}
