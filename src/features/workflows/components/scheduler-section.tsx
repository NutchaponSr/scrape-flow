import { 
  CoinsIcon,
  CornerDownRightIcon, 
  MoveRightIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Hint } from "@/components/hint";

import { SchedulerDialog } from "@/features/workflows/components/scheduler-dialog";

interface SchedulerSectionProps {
  cron: string | null;
  workflowId: string;
  isDraft: boolean;
  creditsCost: number;
}

export const SchedulerSection = ({ 
  cron,
  workflowId,
  isDraft,
  creditsCost,
}: SchedulerSectionProps) => {
  if (isDraft) return null;

  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="size-4 text-muted-foreground" />
      <SchedulerDialog props={{ workflowId, cron }} key={`${cron}-${workflowId}`} />
      <MoveRightIcon className="size-4 text-muted-foreground" />
      <Hint content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="space-x-2 text-muted-foreground">
            <CoinsIcon className="size-4" />
            <span className="text-sm">{creditsCost}</span>
          </Badge>
        </div>
      </Hint>
    </div>
  );
}