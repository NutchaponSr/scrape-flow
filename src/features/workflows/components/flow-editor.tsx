import { Workflow } from "@prisma/client";

interface FlowEditorProps {
  workflow: Workflow;
}

export const FlowEditor = ({ workflow }: FlowEditorProps) => {
  return (
    <div className="h-full w-full">
      {JSON.stringify(workflow)}
    </div>
  );
}