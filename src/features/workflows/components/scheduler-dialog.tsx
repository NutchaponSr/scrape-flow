"use client";

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

import { CustomDialogHeader } from "@/components/custom-dialog-header";

import { useUpdateWorkflowCron } from "@/features/workflows/api/use-update-workflow-cron";

interface SchedulerDialogProps {
  cronStr: string | null;
  workflowId: string;
}

export const SchedulerDialog = ({ 
  cronStr,
  workflowId,
}: SchedulerDialogProps) => {
  const { mutate, isPending } = useUpdateWorkflowCron();

  const [cron, setCron] = useState(cronStr || "");
  const [validCron, setValidCron] = useState(false);
  const [readableCron, setReadableCron] = useState("");

  useEffect(() => {
    try {
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch {
      setValidCron(false);
    }
  }, [cron]);

  return (
    <Dialog>  
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="link"
          className={cn(
            "text-sm p-0 h-auto text-orange-500",
            validCron && "text-primary",
          )}
        >
          {validCron && (
            <div className="flex items-center gap-2">
              <ClockIcon className="size-3" />
              {readableCron}
            </div>
          )}
          {!validCron && (
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
        <div className="p-6 space-y-4">
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
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              className="w-full"
              disabled={isPending}
              onClick={() => {
                toast.loading("Saving...", { id: "cron" });
                mutate({
                  id: workflowId,
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