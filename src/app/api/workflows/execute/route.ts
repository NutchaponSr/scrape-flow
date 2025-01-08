import praser from "cron-parser";

import { timingSafeEqual } from "crypto";

import { db } from "@/lib/db";

import { 
  ExecutionPhaseStatus, 
  WorkflowExecutionPlan, 
  WorkflowExecutionStatus, 
  WorkflowExecutionTrigger 
} from "@/features/workflows/types";
import { TaskRegistry } from "@/features/tasks/registry";
import { ExecuteWorkflow } from "@/features/workflows/lib/execute";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];

  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId") as string;

  if (!workflowId) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }

  const executionPlan = JSON.parse(workflow.executionPlan!) as WorkflowExecutionPlan;

  if (!executionPlan) {
    return Response.json({ error: "Execution plan not found" }, { status: 404 });
  }


  try {
    const cron = praser.parseExpression(workflow.cron!, { utc: true });
    const nextRun = cron.next().toDate();

    const execution = await db.workflowExecution.create({
      data: {
        workflowId,
        startedAt: new Date(),
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
    }); 
  
    await ExecuteWorkflow(execution.id, nextRun);
  
    return new Response(null, { status: 200 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

}

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;

  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch {
    return false;
  }
}