import { TaskType } from "@/features/tasks/types";
import { WorkflowTask } from "@/features/workflows/types";
import { ExecutionEnvironment } from "@/features/executor/types";

import { PageToHtmlExecutor } from "@/features/executor/lib/page-to-html-executor";
import { LaunchBrowserExecutor } from "@/features/executor/lib/launch-browser-executor";
import { ExtractTextFromElementExecutor } from "@/features/executor/lib/extract-text-from-element-executor";

type ExecutorFn<T extends WorkflowTask> = (env: ExecutionEnvironment<T>) => Promise<boolean>;

type RegistryType = {
  [K in TaskType]: ExecutorFn<WorkflowTask & { type: K }>;
}

export const ExecutorRegistry: RegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecutor,
  PAGE_TO_HTML: PageToHtmlExecutor,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
}