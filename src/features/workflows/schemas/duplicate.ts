import { z } from "zod";

import { CreateWorkflowSchema } from "@/features/workflows/schemas/create";

export const DuplicateWorkflowSchema = CreateWorkflowSchema.extend({
  workflowId: z.string(),
});

export type DuplicateWorkflow = z.infer<typeof DuplicateWorkflowSchema>;