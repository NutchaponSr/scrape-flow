"use client";

import { 
  Handle, 
  Position, 
  useEdges
} from "@xyflow/react";

import { cn } from "@/lib/utils";

import { NodeParamField } from "@/features/node/components/node-param-field";

import { TaskParam } from "@/features/tasks/types";
import { ColorForHandle } from "@/features/node/types";
import { useFlowValidation } from "@/features/workflows/hooks/use-flow-validation";

interface NodeInputProps {
  input: TaskParam;
  nodeId: string;
}

export const NodeInput = ({ input, nodeId }: NodeInputProps) => {
  const edges = useEdges();
  const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);

  const { invalidInputs } = useFlowValidation();

  const hasErrors = invalidInputs
    .find((node) => node.nodeId === nodeId)?.inputs
    .find((invalidInput) => invalidInput === input.name);

  return (
    <div className={cn(
      "flex justify-start relative p-3 w-full bg-secondary",
      hasErrors && "bg-destructive/30"
    )}>
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle 
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForHandle[input.type],
          )}
        />
      )}
    </div>
  );
}