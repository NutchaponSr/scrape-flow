"use client";

import parser from "cron-parser";
import cronstrue from "cronstrue";

import { 
  CalendarIcon, 
  ClockIcon, 
  TriangleAlertIcon 
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CustomDialogHeader } from "@/components/custom-dialog-header";

import { useUpdateWorkflowCron } from "@/features/workflows/api/use-update-workflow-cron";
import { useRemoveWorkflowSchedule } from "@/features/workflows/api/use-remove-workflow-schedule";

interface SchedulerDialogProps {
  props: {
    cron: string | null;
    workflowId: string;
  }
}

export const SchedulerDialog = ({ 
  props,
}: SchedulerDialogProps) => {
  const { 
    mutate: updateWorkflowCron, 
    isPending: isPendingUpdate,
  } = useUpdateWorkflowCron();
  const {
    mutate: removeWorkflowSchedule,
    isPending: isPendingRemove,
  } = useRemoveWorkflowSchedule();

  const [cron, setCron] = useState(props.cron || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  useEffect(() => {
    try {
      parser.parseExpression(cron);
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>  
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="link"
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            readableSavedCron && "text-primary",
          )}
        >
          {readableSavedCron && (
            <div className="flex items-center gap-2">
              <ClockIcon className="size-3" />
              {readableCron}
            </div>
          )}
          {!readableSavedCron && (
            <div className="flex items-center gap-1">
              <TriangleAlertIcon className="size-3" /> Set schedule
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader 
          title="Schedule workflow execution" 
          icon={CalendarIcon}
        />
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Specify a cron expression to schedule periodic workflow execution.
          </p>
          <Input 
            placeholder="E.g. * * * * *" 
            value={cron}
            onChange={(e) => setCron(e.target.value)}
          />
          <div className={cn(
            "bg-accent rounded-md p-4 border text-sm",
            validCron ? "border-primary text-primary" : "border-destructive text-destructive"
          )}>
            {validCron ? readableCron : "Not a valid cron expression"}
          </div>
          {workflowHasValidCron && (
            <DialogClose asChild>
              <div>
                <Button
                  variant="outline"
                  disabled={isPendingUpdate || isPendingRemove}
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  onClick={() => {
                    toast.loading("Removing schedule...", { id: "cron" });
                    removeWorkflowSchedule(props.workflowId);
                  }}
                >
                  Remove current schedule
                </Button>
                <Separator className="my-4" />
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              className="w-full"
              disabled={isPendingUpdate || !validCron || isPendingRemove}
              onClick={() => {
                toast.loading("Saving...", { id: "cron" });
                updateWorkflowCron({
                  id: props.workflowId,
                  cron,
                })
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}