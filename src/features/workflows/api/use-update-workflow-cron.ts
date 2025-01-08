import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { UpdateWorkflowCron } from "@/features/workflows/server/update-workflow-cron";

export const useUpdateWorkflowCron = () => {
  const mutation = useMutation({
    mutationFn: UpdateWorkflowCron,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    },
  });

  return mutation;
}