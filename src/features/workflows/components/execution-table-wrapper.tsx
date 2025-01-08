import { InboxIcon } from "lucide-react";

import { waitFor } from "@/lib/utils";

import { ExecutionTable } from "@/features/workflows/components/execution-table";

import { GetWorkflowExecutions } from "@/features/workflows/server/get-workflow-executions";

interface ExecutionTableWrapperProps {
  workflowId: string;
}

export const ExecutionTableWrapper = async ({ workflowId }: ExecutionTableWrapperProps) => {
  waitFor(4000);
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions) {
    return <div>No data</div>
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6"> 
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="text-bold">No runs have been triggered yet for this workflow</p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container w-full py-6">
      <ExecutionTable workflowId={workflowId} initialData={executions} />
    </div>
  );
}