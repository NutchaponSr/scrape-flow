"use client";

import { createContext, useState } from "react";

import { AppNodeMissingInputs, FlowValidationContextType } from "@/features/workflows/types";

export const FlowValidationContext = createContext<FlowValidationContextType | null>(null);

export const FlowValidationProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>([]);

  const clearErrors = () => setInvalidInputs([]);

  return (
    <FlowValidationContext.Provider value={{
      invalidInputs,
      setInvalidInputs,
      clearErrors,
    }}>
      {children}
    </FlowValidationContext.Provider>
  );
}