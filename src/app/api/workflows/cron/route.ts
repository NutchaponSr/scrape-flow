import { db } from "@/lib/db";

import { WorkflowStatus } from "@/features/workflows/types";
import { triggerWorkflow } from "@/features/workflows/utils";

export async function GET(req: Request) {
  const now = new Date();
  const workflows = await db.workflow.findMany({
    select: {
      id: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: {
        not: null,
      },
      nextRunAt: {
        lte: now,
      },
    },
  });

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}