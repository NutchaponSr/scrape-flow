"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { InitialDataType } from "@/features/workflows/types";

import { useGetWorkflowExecutions } from "@/features/workflows/api/use-get-workflow-executions";

interface ExecutionTableProps {
  workflowId: string;
  initialData: InitialDataType;
}

export const ExecutionTable = ({
  workflowId,
  initialData,
}: ExecutionTableProps) => {
  const { data: executions } = useGetWorkflowExecutions(workflowId, initialData);

  return (
    <div>
      
    </div>
  );
}