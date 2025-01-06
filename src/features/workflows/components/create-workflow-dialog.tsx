"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers2Icon, Loader2Icon } from "lucide-react";

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
  CreateWorkflow, 
  CreateWorkflowSchema 
} from "@/features/workflows/schemas/create";
import { useCreateWorkflow } from "@/features/workflows/api/use-create-workflow";

interface CreateWorkflowDialogProps {
  triggerText: string;
}

export const CreateWorkflowDialog = ({ triggerText }: CreateWorkflowDialogProps) => {
  const { 
    mutate,
    isPending,
  } = useCreateWorkflow();

  const form = useForm<CreateWorkflow>({
    resolver: zodResolver(CreateWorkflowSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = useCallback((value: CreateWorkflow) => {
    toast.loading("Creating workflow...", { id: "create-workflow" });
    mutate(value);
  }, [mutate]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {triggerText ?? "Create Workflow"}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader 
          icon={Layers2Icon}
          title="Create Workflow"
          subTitle="Start building your workflow"
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