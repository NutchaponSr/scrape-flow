import Link from "next/link";

import { Workflow } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

import { ExecutionStatusIndicator } from "@/features/workflows/components/execution-status-indicator";

import { WorkflowExecutionStatus } from "@/features/workflows/types";
import { ChevronRightIcon } from "lucide-react";

interface LastRunDetailsProps {
  workflow: Workflow;
}

export const LastRunDetails = ({ workflow }: LastRunDetailsProps) => {
  const formattedStartedAt = 
    workflow.lastRunAt && 
    formatDistanceToNow(workflow.lastRunAt, { addSuffix: true });

  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {workflow.lastRunAt && (
          <Link 
            href={`/workflows/runs/${workflow.id}/${workflow.lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator status={workflow.lastRunStatus as WorkflowExecutionStatus} />
            <span>{workflow.lastRunStatus}</span>
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon size={14} className="-translate-x-[2px] group-hover:translate-x-0 transition" />
          </Link>
        )}  
        {!workflow.lastRunAt && <p>No runs yet</p>}
      </div>
    </div>
  );
}