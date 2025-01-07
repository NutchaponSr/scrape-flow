import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

import { TopBar } from "@/features/workflows/components/top-bar";
import { ExecutionTableWrapper } from "@/features/workflows/components/execution-table-wrapper";

const ExecutionPage = ({
  params
}: {
  params: { workflowId: string }
}) => {
  return (
    <div className="h-full w-full overflow-auto">
      <TopBar 
        hideButtons
        workflowId={params.workflowId}
        title="All runs"
        subtitle="List of all workflow runs"
      />
      <Suspense fallback={
        <div className="flex h-full w-full">
          <Loader2Icon size={30} className="animate-spin stroke-primary" />
        </div>
      }>
        <ExecutionTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
}

export default ExecutionPage;