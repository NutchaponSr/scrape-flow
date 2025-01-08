"use client";

import { CoinsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { datesToDurationString } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { ExecutionStatusIndicator } from "@/features/workflows/components/execution-status-indicator";

import { 
  InitialDataType, 
  WorkflowExecutionStatus 
} from "@/features/workflows/types";

import { useGetWorkflowExecutions } from "@/features/workflows/api/use-get-workflow-executions";

interface ExecutionTableProps {
  workflowId: string;
  initialData: InitialDataType;
}

export const ExecutionTable = ({
  workflowId,
  initialData,
}: ExecutionTableProps) => {
  const router = useRouter();
  const { data: executions } = useGetWorkflowExecutions(workflowId, initialData);

  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started at (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {executions.map((execution) => {
            const duration = datesToDurationString(
              execution.completedAt,
              execution.startedAt,
            );

            const formattedStartedAt = 
              execution.startedAt && 
              formatDistanceToNow(execution.startedAt, { addSuffix: true });

            return (
              <TableRow 
                key={execution.id} 
                className="cursor-pointer"
                onClick={() => router.push(`/workflows/runs/${execution.workflowId}/${execution.id}`)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-muted-foreground text-xs">
                      <span>Triggered via</span>
                      <Badge variant="outline">
                        {execution.trigger}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <ExecutionStatusIndicator status={execution.status as WorkflowExecutionStatus} />
                      <span className="font-semibold capitalize">
                        {execution.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      {duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <CoinsIcon size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {execution.creditConsumed}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formattedStartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}