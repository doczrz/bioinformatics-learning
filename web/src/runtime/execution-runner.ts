export type EnvironmentKind = "local-r" | "local-python" | "remote";
export type EnvironmentAvailability = "unavailable" | "available";
export type RunnerStatus = Record<EnvironmentKind, EnvironmentAvailability>;
export type ExecutionLanguage = "r" | "python" | "shell";

export interface RunRequest {
  environment: EnvironmentKind;
  language: ExecutionLanguage;
  code: string;
  workingDirectory: string | null;
  remoteProfileId?: string;
}

export interface TableArtifact {
  name: string;
  columns: string[];
  rows: unknown[][];
}

export interface FileArtifact {
  name: string;
  mediaType: string;
  kind: "image" | "file";
  reference: string;
}

export interface RunResult {
  runId: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  stdout: string;
  stderr: string;
  exitCode: number | null;
  elapsedMilliseconds: number;
  tables: TableArtifact[];
  artifacts: FileArtifact[];
  remoteJobId?: string;
}

export interface ExecutionRunner {
  getStatus(): Promise<RunnerStatus>;
  run(request: RunRequest): Promise<RunResult>;
  cancel(runId: string): Promise<void>;
}

export const unavailableRunnerStatus: RunnerStatus = {
  "local-r": "unavailable",
  "local-python": "unavailable",
  remote: "unavailable",
};
