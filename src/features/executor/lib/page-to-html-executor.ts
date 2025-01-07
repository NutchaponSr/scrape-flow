import { PageToHtmlTask } from "@/features/tasks/components/page-to-html";

import { ExecutionEnvironment } from "@/features/executor/types";

export async function PageToHtmlExecutor(
  env: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await env.getPage()!.content(); 

    env.setOutput("Html", html);
    
    return true;
  } catch (error) {
    env.log.error(`🔴 Error: ${error}`);
    return false;
  }
}