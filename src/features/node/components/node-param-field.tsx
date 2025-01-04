import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import { StringParam } from "@/features/node/components/string-param";
import { BrowserInstanceParam } from "@/features/node/components/browser-instance-param";

import { AppNode } from "@/features/node/types";
import { TaskParam, TaskParamType } from "@/features/tasks/types";

interface NodeParamFieldProps {
  param: TaskParam;
  nodeId: string;
  disabled: boolean;
}

export const NodeParamField = ({ 
  param, 
  nodeId,
  disabled,
}: NodeParamFieldProps) => {
  const {
    updateNodeData,
    getNode,
  } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback((newValue: string) => {
    updateNodeData(nodeId, {
      inputs: {
        ...node?.data.inputs,
        [param.name]: newValue,
      },
    });
  }, [
    nodeId,
    param.name,
    updateNodeData,
    node?.data.inputs
  ]);

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam 
          value={value}
          param={param}
          disabled={disabled}
          updateNodeParamValue={updateNodeParamValue} 
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam 
          value={""}
          param={param}
          disabled={false}
          updateNodeParamValue={updateNodeParamValue} 
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
}