import {
  type ExecutionRunner,
  type RunRequest,
  type RunResult,
  type RunnerStatus,
  unavailableRunnerStatus,
} from "./execution-runner";

const NOT_CONNECTED = "Biolearning Runner is not connected.";

export class NullExecutionRunner implements ExecutionRunner {
  async getStatus(): Promise<RunnerStatus> {
    return { ...unavailableRunnerStatus };
  }

  async run(_request: RunRequest): Promise<RunResult> {
    throw new Error(NOT_CONNECTED);
  }

  async cancel(_runId: string): Promise<void> {
    throw new Error(NOT_CONNECTED);
  }
}
