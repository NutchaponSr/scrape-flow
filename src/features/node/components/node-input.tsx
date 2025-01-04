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

interface NodeInputProps {
  input: TaskParam;
  nodeId: string;
}

export const NodeInput = ({ input, nodeId }: NodeInputProps) => {
  const edges = useEdges();
  const isConnected = edges.some(edge => edge.target === nodeId && edge.targetHandle === input.name);

  return (
    <div className="flex justify-start relative p-3 w-full bg-secondary">
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