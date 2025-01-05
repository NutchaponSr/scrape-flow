import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { ExecutionViewer } from "@/features/workflows/components/execution-viewer";

import { GetWorkflowExecutionWithPhases } from "@/features/workflows/server/get-workflow-execution-with-phases";

interface ExecutionViewerWrapperProps {
  executionId: string;
}

export const ExecutionViewerWrapper = async ({ executionId }: ExecutionViewerWrapperProps) => { 
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return (
      <div>
        Not found
      </div>
    );
  }

  return <ExecutionViewer initialData={workflowExecution} />
}