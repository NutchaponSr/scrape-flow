import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { waitFor } from "@/lib/utils";

import { Editor } from "@/features/workflows/components/editor";

const EditorPage = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return (
      <div>
        unauthenticated
      </div>
      
    );
  }

  await waitFor(5000);

  const workflow = await db.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={workflow} />;
}

export default EditorPage;