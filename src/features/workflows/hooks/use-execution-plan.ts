import { toast } from "sonner";
import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react"

import { AppNode } from "@/features/node/types";
import { FlowToExecutionPlan } from "@/features/workflows/utils";
import { FlowToExecutionPlanValidationError } from "@/features/workflows/types";

import { useFlowValidation } from "@/features/workflows/hooks/use-flow-validation";

export const useExecutionPlan = () => {
  const {
    clearErrors,
    setInvalidInputs,
  } = useFlowValidation();
  const { toObject } = useReactFlow();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = useCallback((error: any) => {
    switch (error.type) {
      case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
        toast.error("No entry point found");
        break;
      case FlowToExecutionPlanValidationError.INVALID_INPUT:
        toast.error("Not all inputs values are set");
        setInvalidInputs(error.invalidElements);
        break;
      default:
        toast.error("Something went wrong");
        break;
    }
  }, [setInvalidInputs]);

  const generateExecutionPlan = useCallback(() => {
    const { edges, nodes } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(nodes as AppNode[], edges);

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [
    toObject, 
    clearErrors, 
    handleError,
  ]);

  return generateExecutionPlan;
}