import Link from "next/link";

import { Workflow } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import { format, formatDistanceToNow } from "date-fns";
import { ChevronRightIcon, ClockIcon } from "lucide-react";

import { ExecutionStatusLabel } from "@/features/workflows/components/execution-status-label";
import { ExecutionStatusIndicator } from "@/features/workflows/components/execution-status-indicator";

import { 
  WorkflowExecutionStatus, 
  WorkflowStatus 
} from "@/features/workflows/types";

interface LastRunDetailsProps {
  workflow: Workflow;
}

export const LastRunDetails = ({ workflow }: LastRunDetailsProps) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  if (isDraft) return null;

  const {
    lastRunAt,
    lastRunId,
    lastRunStatus,
    nextRunAt
  } = workflow;

  const formattedStartedAt = 
    lastRunAt && 
    formatDistanceToNow(lastRunAt, { addSuffix: true }); 

  const nextSchedule = nextRunAt && format(nextRunAt, "yyyy-MM-dd HH:mm");
  const nextScheduleUTC = nextRunAt && formatInTimeZone(nextRunAt, "UTC", "HH:mm");

  return (
    <div className="bg-primary/5 px-4 py-1 flex justify-between items-center text-muted-foreground">
      <div className="flex items-center text-sm gap-2">
        {lastRunAt && (
          <Link 
            href={`/workflows/runs/${workflow.id}/${lastRunId}`}
            className="flex items-center text-sm gap-2 group"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator status={lastRunStatus as WorkflowExecutionStatus} />
            <ExecutionStatusLabel status={lastRunStatus as WorkflowExecutionStatus} />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon size={14} className="-translate-x-[2px] group-hover:translate-x-0 transition" />
          </Link>
        )}  
        {!lastRunAt && <p>No runs yet</p>}
        {nextRunAt && (
          <div className="flex items-center text-sm gap-2">
            <ClockIcon size={14} />
            <span>Next run at:</span>
            <span>{nextSchedule}</span>
            <span>({nextScheduleUTC} UTC)</span>
          </div>
        )}
      </div>
    </div>
  );
}
