import { Browser, Page } from "puppeteer";

import { LogCollector } from "@/features/log/types";
import { WorkflowTask } from "@/features/workflows/types";

export type Environment = {
  browser?: Browser;
  page?: Page;
  // Phase with nodeId|taskId as key
  phases: Record<string /* key: nodeId|taskId */, {
    inputs: Record<string, string>;
    outputs: Record<string, string>;
  }> 
}

export type ExecutionEnvironment<T extends WorkflowTask> = {
  log: LogCollector;
  getInput: (name: T["inputs"][number]["name"]) => string;
  getBrowser: () => Browser | undefined;
  getPage: () => Page | undefined;
  setBrowser: (browser: Browser) => void;
  setPage: (page: Page) => void;
  setOutput: (name: T["outputs"][number]["name"], value: string) => void;
}