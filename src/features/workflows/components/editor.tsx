"use client";

import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";

import { FlowValidationProvider } from "@/components/providers/flow-validation-provider";

import { TopBar } from "@/features/workflows/components/top-bar";
import { TaskMenu } from "@/features/workflows/components/task-menu";
import { FlowEditor } from "@/features/workflows/components/flow-editor";

interface EditorProps {
  workflow: Workflow;
}

export const Editor = ({ workflow }: EditorProps) => {

  return (
    <FlowValidationProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <TopBar 
            title="Workflow editor" 
            subtitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationProvider>
  );
}