"use client";

import {
  Handle,
  Position,
} from "@xyflow/react";

import { cn } from "@/lib/utils";

import { TaskParam } from "@/features/tasks/types";
import { ColorForHandle } from "@/features/node/types";

interface NodeOutputProps {
  output: TaskParam;
  nodeId: string;
}

export const NodeOutput = ({
  output,
  nodeId,
}: NodeOutputProps) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary rounded-b-md">
      <p className="text-xs text-muted-foreground">
        {output.name}
      </p>
      <Handle 
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !h-4 !w-4",
          ColorForHandle[output.type],
        )}
      />
    </div>
  );
}