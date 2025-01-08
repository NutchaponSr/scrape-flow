import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { RemoveWorkflowSchedule } from "@/features/workflows/server/remove-worflow-schedule";

export const useRemoveWorkflowSchedule = () => {
  const mutate = useMutation({
    mutationFn: RemoveWorkflowSchedule,
    onSuccess: () => {
      toast.success("Schedule updated successfully", { id: "cron" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "cron" });
    }
  });

  return mutate;
}