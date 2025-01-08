import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { UnpublishWorkflow } from "@/features/workflows/server/unpublish-workflow";

export const useUnpublishWorkflow = (id: string) => {
  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success("Execution unpublished", { id });
    },
    onError: () => {
      toast.error("Something went wrong", { id });
    },
  });

  return mutation;
}