"use client";

import { 
  CoinsIcon, 
  CopyIcon, 
  GripVerticalIcon, 
  Trash2Icon
} from "lucide-react";
import { useReactFlow } from "@xyflow/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { TaskType } from "@/features/tasks/types";
import { TaskRegistry } from "@/features/tasks/registry";
import { AppNode } from "../types";
import { CreateFlowNode } from "@/features/tasks/utils";

interface NodeHeaderProps {
  taskType: TaskType;
  nodeId: string;
}

export const NodeHeader = ({ 
  taskType,
  nodeId,
}: NodeHeaderProps) => {
  const task = TaskRegistry[taskType];
  const { addNodes, deleteElements, getNode } = useReactFlow();

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center"> 
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  });
                }}
              >
                <Trash2Icon size={12} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  const newX = node.position.x;
                  const newY = node.position.y + (node.measured?.height ?? 0)! + 20; 
                  const newNode = CreateFlowNode(node.data.type, {
                    x: newX,
                    y: newY,
                  });

                  addNodes([newNode]);
                }}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}