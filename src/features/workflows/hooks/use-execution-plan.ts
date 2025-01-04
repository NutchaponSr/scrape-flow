import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react"

import { AppNode } from "@/features/node/types";
import { FlowToExecutionPlan } from "@/features/workflows/utils";

export const useExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const generateExecutionPlan = useCallback(() => {
    const { edges, nodes } = toObject();
    const result = FlowToExecutionPlan(nodes as AppNode[], edges);
  }, [toObject]);

  return generateExecutionPlan;
}