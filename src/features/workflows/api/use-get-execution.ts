import { useQuery } from "@tanstack/react-query";

import { 
  ExecutionData, 
  WorkflowExecutionStatus,
} from "@/features/workflows/types";
import { GetWorkflowExecutionWithPhases } from "@/features/workflows/server/get-workflow-execution-with-phases";

export const useGetExecution = (initialData: ExecutionData) => {
  const query = useQuery({
    initialData,
    queryKey: ["execution", initialData?.id],
    queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
    refetchInterval: (query) => query.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  return query;
}