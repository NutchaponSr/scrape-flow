import { z } from "zod";

export const CreateWorkflowSchema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

export type CreateWorkflow = z.infer<typeof CreateWorkflowSchema>;