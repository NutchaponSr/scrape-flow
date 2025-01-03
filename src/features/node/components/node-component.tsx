import { memo } from "react";
import { NodeProps } from "@xyflow/react";

import { NodeCard } from "@/features/node/components/node-card";
import { NodeInput } from "@/features/node/components/node-input";
import { NodeHeader } from "@/features/node/components/node-header";

import { AppNodeData } from "@/features/node/types";
import { TaskRegistry } from "@/features/tasks/registry";

export const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      <NodeHeader taskType={nodeData.type} />
      <div className="flex flex-col divide-y gap-2">
        {task.inputs.map((input, index) => (
          <NodeInput key={index} input={input} nodeId={props.id} />
        ))}
      </div>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";