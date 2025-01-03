"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow
} from "@xyflow/react";
import { useEffect } from "react";
import { Workflow } from "@prisma/client";

import { NodeComponent } from "@/features/node/components/node-component";

import { TaskType } from "@/features/tasks/types";
import { CreateFlowNode } from "@/features/tasks/utils";

import "@xyflow/react/dist/style.css";

interface FlowEditorProps {
  workflow: Workflow;
}

const nodeTypes = { FlowScrapeNode: NodeComponent }

export const FlowEditor = ({ workflow }: FlowEditorProps) => {
  const { setViewport } = useReactFlow();

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

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
    } catch (error) {}
  }, [workflow.definition, setEdges, setNodes, setViewport]); 

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
        snapGrid={[50, 50]}
        fitViewOptions={{ padding: 1 }}
      >
        <Controls position="top-left" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}