import { 
  AlertCircleIcon, 
  InboxIcon 
} from "lucide-react";

import { 
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { WorkflowCard } from "@/features/workflows/components/workflow-card";

import { GetUserWorkflows } from "@/features/workflows/server/get-user-workflows";

export const UserWorkflows = async () => {
  const workflows = await GetUserWorkflows();

  if (!workflows) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="size-4" />
        <AlertTitle>No workflows found</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
          <InboxIcon size={40} className="stroke-primary" />
        </div>
        <div className="flex flex-col gap-1 text-center">
          <h2 className="font-bold">No workflow created yet</h2>
          <p className="text-sm text-muted-foreground">
            Click the button below to create your first workflow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard 
          key={workflow.id} 
          workflow={workflow} 
        />
      ))}
    </div>
  );
}

UserWorkflows.Skeleton = function SkeletonUserWorkflows() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full" />
      ))}
    </div>
  );
}