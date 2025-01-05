import { useQuery } from "@tanstack/react-query"
import { GetWorkflowPhaseDetails } from "../server/get-phase-details";

export const usePhaseDetails = (phase: string | null) => {
  const query = useQuery({
    enabled: !!phase,
    queryKey: ["phase-details", phase],
    queryFn: () => GetWorkflowPhaseDetails(phase!),
  });

  return query;
}