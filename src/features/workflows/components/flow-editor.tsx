"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import { Workflow } from "@prisma/client";
import { useCallback, useEffect } from "react";

import { NodeComponent } from "@/features/node/components/node-component";
import { DeletableEdge } from "@/features/node/components/deletable-edge";

import { AppNode } from "@/features/node/types";
import { TaskType } from "@/features/tasks/types";
import { CreateFlowNode } from "@/features/tasks/utils";

import "@xyflow/react/dist/style.css";
import { TaskRegistry } from "@/features/tasks/registry";

interface FlowEditorProps {
  workflow: Workflow;
}

const nodeTypes = { FlowScrapeNode: NodeComponent };
const edgeTypes = { default: DeletableEdge }

export const FlowEditor = ({ workflow }: FlowEditorProps) => {
  const { 
    setViewport,
    screenToFlowPosition,
    updateNodeData,
  } = useReactFlow();

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);

  useEffect(() => { 
    try { 
      const flow = JSON.parse(workflow.definition);

      if (!flow) return;

      setEdges(flow.edges || []);
      setNodes(flow.nodes || []);

      if (!flow.viewpoint) return;

      const {
        x = 0,
        y = 0,
        zoom = 1,
      } = flow.viewpoint;

      setViewport({ x, y, zoom });
    } catch (error) {
      console.log("🔴", error);
    }
  }, [workflow.definition, setEdges, setNodes, setViewport]); 

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    const taskType = e.dataTransfer.getData("application/reactflow");

    if (typeof taskType === undefined || !taskType) return;

    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((node) => node.concat(newNode));
  }, [setNodes, screenToFlowPosition]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((edge) => addEdge({
      ...connection,
      animated: true,
    }, edge));

    if (!connection.targetHandle) return;
    // Remove input value if is present on connection 
    const node = nodes.find((node) => node.id === connection.target);

    if (!node) return;

    const nodeInputs = node.data.inputs;

    updateNodeData(node.id, {
      inputs: {
        ...nodeInputs,
        [connection.targetHandle]: "",
      },
    });
  }, [
    nodes,
    setEdges,
    updateNodeData,
  ]);

  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // No self-connections allowed
    if (connection.source === connection.target) return false;

    // Same taskParam type connection
    const source = nodes.find((node) => node.id === connection.source);
    const target = nodes.find((node) => node.id === connection.target);

    if (!source || !target) return false;

    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];

    const input = targetTask.inputs.find((input) => input.name === connection.targetHandle);
    const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);

    if (input?.type !== output?.type) return false;

    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };

    const detectedCycle = hasCycle(target);

    return !detectedCycle;
  }, [nodes, edges]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        fitView
        snapToGrid
        edges={edges}
        nodes={nodes}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={[50, 50]}
        fitViewOptions={{ padding: 1 }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}