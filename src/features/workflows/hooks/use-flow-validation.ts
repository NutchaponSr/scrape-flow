import { useContext } from "react";

import { FlowValidationContext } from "@/components/providers/flow-validation-provider";

export const useFlowValidation = () => {
  const context = useContext(FlowValidationContext);

  if (!context) {
    throw new Error("useFlowValidation must be used within a FlowValidationContext");
  }

  return context;
}