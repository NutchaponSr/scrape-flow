"use client";

import { 
  CalendarIcon, 
  CircleDashedIcon, 
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  WorkflowIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { 
  datesToDurationString,
  getPhasesTotalCost 
} from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CountUpWrapper } from "@/components/count-up-wrapper";

import { LogViewer } from "@/features/workflows/components/log-viewer";
import { ExecutionLabel } from "@/features/workflows/components/execution-label";
import { ParamaterViewer } from "@/features/workflows/components/paramater-viewer";
import { PhaseStatusBadge } from "@/features/workflows/components/phase-status-badge";

import { 
  ExecutionData, 
  ExecutionPhaseStatus, 
  WorkflowExecutionStatus 
} from "@/features/workflows/types";

import { useGetExecution } from "@/features/workflows/api/use-get-execution";
import { usePhaseDetails } from "@/features/workflows/api/use-phase-details";

interface ExecutionViewerProps {
  initialData: ExecutionData;
}

export const ExecutionViewer = ({ initialData }: ExecutionViewerProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const { data: execution } = useGetExecution(initialData);
  const { data: phaseDetails } = usePhaseDetails(selectedPhase);

  
  const duration = datesToDurationString(
    execution?.completedAt,
    execution?.startedAt,
  );
  
  const creditsConsumed = getPhasesTotalCost(execution?.phases || []);
  const isRunning = execution?.status === WorkflowExecutionStatus.RUNNING;

  useEffect(() => {
    // While running we auto-select the current running phase in the sidebar
    const phases = execution?.phases || [];

    if (isRunning) {
      // Select the last executed phase
      const phaseToSelect = phases.toSorted((a, b) => a.startedAt! > b.startedAt! ?  -1 : 1)[0];

      setSelectedPhase(phaseToSelect.id);
      return;
    }

    const phaseToSelect = phases.toSorted((a, b) => a.completedAt! > b.completedAt! ? -1 : 1)[0];

    setSelectedPhase(phaseToSelect.id);
  }, [execution?.phases, isRunning]);

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
            value={<CountUpWrapper value={creditsConsumed} />}
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
                <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
              </Button>
            ))}
          </div>
        </div>
      </aside>
      <div className="flex w-full h-full">
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {!isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>
              <p className="text-sm text-muted-foreground">
                Select a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="space-x-4 py-1">
                <div className="flex gap-1 items-center">
                  <CoinsIcon size={16} className="stroke-muted-foreground" />
                  <span>Credits</span>
                </div>
                <span>{phaseDetails.creditsConsumed}</span>
              </Badge>
              <Badge variant="outline" className="space-x-4 py-1">
                <div className="flex gap-1 items-center">
                  <ClockIcon size={16} className="stroke-muted-foreground" />
                  <span>Duration</span>
                </div>
                <span>
                  {datesToDurationString(
                    phaseDetails.completedAt,
                    phaseDetails.startedAt,
                  ) || "-"}
                </span>
              </Badge>
            </div>
            <ParamaterViewer 
              title="Inputs" 
              subtitle="Inputs used for this phase"
              paramsJSON={phaseDetails.inputs}
            />
            <ParamaterViewer 
              title="Outputs" 
              subtitle="Outputs generated by this phase"
              paramsJSON={phaseDetails.outputs}
            />
            <LogViewer logs={phaseDetails.logs} />
          </div>
        )}
      </div>
    </div> 
  );
}