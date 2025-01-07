import { useQuery } from "@tanstack/react-query";

import { InitialDataType } from "@/features/workflows/types";
import { GetWorkflowExecutions } from "../server/get-workflow-executions";

export const useGetWorkflowExecutions = (workflowId: string, initialData: InitialDataType) => {
  const query = useQuery({
    initialData,
    queryKey: ["executions", workflowId],
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000,
  });

  return query;
}