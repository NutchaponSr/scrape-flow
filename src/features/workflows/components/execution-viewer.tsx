"use client";

import { 
  CalendarIcon, 
  CircleDashedIcon, 
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  WorkflowIcon
} from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { 
  datesToDurationString,
  getPhasesTotalCost 
} from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ExecutionLabel } from "@/features/workflows/components/execution-label";

import { ExecutionData, WorkflowExecutionStatus } from "@/features/workflows/types";

import { useGetExecution } from "@/features/workflows/api/use-get-execution";
import { usePhaseDetails } from "../api/use-phase-details";

interface ExecutionViewerProps {
  initialData: ExecutionData;
}

export const ExecutionViewer = ({ initialData }: ExecutionViewerProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const { data: execution } = useGetExecution(initialData);
  const { data: phaseDetails } = usePhaseDetails(selectedPhase);

  const duration = datesToDurationString(
    execution?.completeAt,
    execution?.startedAt,
  );

  const creditsConsumed = getPhasesTotalCost(execution?.phases || []);
  const isRunning = execution?.status === WorkflowExecutionStatus.RUNNING;

  return (
    <div className="flex w-full h-full">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
        <div className="py-4">
          <ExecutionLabel 
            icon={CircleDashedIcon}
            label="Status"
            value={execution?.status}
          />
          <ExecutionLabel 
            icon={CalendarIcon}
            label="Started at"
            value={execution?.startedAt
              ? formatDistanceToNow(new Date(execution.startedAt))
              : "-"
            }
          />
          <ExecutionLabel 
            icon={ClockIcon}
            label="Duration"
            value={duration ? duration : <Loader2Icon size={20} className="animate-spin" />}
          />
          <ExecutionLabel 
            icon={CoinsIcon}
            label="Credits consumed"
            value={creditsConsumed}
          />
          <Separator />
          <div className="flex justify-center items-center py-2 px-4">
            <div className="text-muted-foreground flex items-center gap-2">
              <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
              <span className="font-semibold">Phases</span>
            </div>
          </div>
          <Separator />
          <div className="overflow-auto h-full px-2 py-4">
            {execution?.phases.map((phase, index) => (
              <Button
                key={phase.id}
                className="w-full justify-between"
                onClick={() => {
                  if (isRunning) return;

                  setSelectedPhase(phase.id);
                }}  
                variant={selectedPhase === phase.id ? "secondary" : "ghost"}
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{index + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {phase.status}
                </p>
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex w-full h-full">
        <pre>{JSON.stringify(phaseDetails, null, 4)}</pre>
      </div>
    </div> 
  );
}