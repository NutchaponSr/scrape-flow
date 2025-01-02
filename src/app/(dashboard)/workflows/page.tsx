import { Suspense } from "react";

import { UserWorkflows } from "@/features/workflows/components/user-workflows";
import { CreateWorkflowDialog } from "@/features/workflows/components/create-workflow-dialog";

const WorkflowsPage = () => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
        <CreateWorkflowDialog triggerText="Create workflow" />
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflows.Skeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

export default WorkflowsPage;