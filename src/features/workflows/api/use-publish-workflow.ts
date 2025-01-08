import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { PublishWorkflow } from "@/features/workflows/server/publish-workflow";

export const usePublishWorkflow = (id: string) => {
  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success("Execution published", { id });
    },
    onError: () => {
      toast.error("Something went wrong", { id });
    },
  });

  return mutation;
}