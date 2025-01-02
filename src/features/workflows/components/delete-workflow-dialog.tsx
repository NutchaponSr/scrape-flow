"use client";

import { toast } from "sonner";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

import { useDeleteWorkflow } from "@/features/workflows/api/use-delete-workflow";

interface DeleteWorkflowDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  id: string;
}

export const DeleteWorkflowDialog = ({
  open,
  setOpen,
  name,
  id,
}: DeleteWorkflowDialogProps) => {
  const { mutate } = useDeleteWorkflow(id);

  const [confirmText, setConfirmText] = useState("");

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <span>
                If you are sure, enter <b>{name}</b> to confirm.
              </span>
              <Input 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)} 
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmText !== name}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => {
              toast.loading("Deleting workflow...", { id: id });
              mutate(id, {
                onSuccess: () => {
                  setConfirmText("");
                }
              });
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}