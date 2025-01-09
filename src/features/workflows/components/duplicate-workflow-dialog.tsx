"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, Layers2Icon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { CustomDialogHeader } from "@/components/custom-dialog-header";

import { 
  DuplicateWorkflow,
  DuplicateWorkflowSchema
} from "@/features/workflows/schemas/duplicate";

import { useDuplicateWorkflow } from "@/features/workflows/api/use-duplicate-workflow";

interface DuplicateWorkflowDialogProps {
  workflowId: string;
}

export const DuplicateWorkflowDialog = ({ workflowId }: DuplicateWorkflowDialogProps) => {
  const { mutate, isPending } = useDuplicateWorkflow();

  const form = useForm<DuplicateWorkflow>({
    resolver: zodResolver(DuplicateWorkflowSchema),
    defaultValues: {
      workflowId,
    },
  });

  const onSubmit = useCallback((value: DuplicateWorkflow) => {
    toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
    mutate(value);
  }, [mutate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100"
          )}
        >
          <CopyIcon className="size-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader 
          icon={Layers2Icon}
          title="Duplicate workflow"
        />
        <div className="p-6">
          <Form {...form}>
            <form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control} 
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive and unqiue name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control} 
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-muted-foreground">(optional)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of the what your workflow does. <br />
                      This is optional but can help you remember the workflow&apos;s purpose.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && "Proceed"}
                {isPending && <Loader2Icon className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}