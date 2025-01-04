import { PageToHtmlTask } from "@/features/tasks/components/page-to-html";
import { LaunchBrowserTask } from "@/features/tasks/components/launch-browser";
import { ExtractTextFromElementTask } from "@/features/tasks/components/extract-text-from-element";

import { TaskType } from "@/features/tasks/types";
import { WorkflowTask } from "@/features/workflows/types";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K }
}

export const TaskRegistry: Registry = {
  LAUNCH_BROWSER: LaunchBrowserTask,
  PAGE_TO_HTML: PageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask
}