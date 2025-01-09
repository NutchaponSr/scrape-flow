import { cn } from "@/lib/utils";

import { WorkflowExecutionStatus } from "@/features/workflows/types";

const labelColors: Record<WorkflowExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  FAILED: "text-red-400",
  COMPLETED: "text-emerald-600",
}

interface ExecutionStatusLabelProps {
  status: WorkflowExecutionStatus;
}

export const ExecutionStatusLabel = ({ status }: ExecutionStatusLabelProps) => {
  return (
    <span className={cn("lowercase", labelColors[status])}>
      {status}
    </span>
  );
}