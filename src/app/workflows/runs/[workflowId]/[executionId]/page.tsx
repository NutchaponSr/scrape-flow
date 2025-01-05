import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

import { TopBar } from "@/features/workflows/components/top-bar";
import { ExecutionViewerWrapper } from "@/features/workflows/components/execution-viewer-wrapper";

const ExecutionViewerPage = ({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  },
}) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar 
        workflowId={params.workflowId}
        title="Worflow run details"
        subtitle={`Run ID: ${params.executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense fallback={
          <div className="flex w-full items-center justify-center">
            <Loader2Icon className="size-10 animate-spin stroke-primary" />
          </div>
        }>  
          <ExecutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

export default ExecutionViewerPage;