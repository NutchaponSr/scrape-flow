"use client";

import Link from "next/link";

import { 
  FileTextIcon,
  PlayIcon,
  ShuffleIcon,
} from "lucide-react";
import { Workflow } from "@prisma/client";

import { cn } from "@/lib/utils";
import { statusColors } from "@/constants/workflows";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

import { RunButton } from "@/features/workflows/components/run-button";
import { WorkflowAction } from "@/features/workflows/components/workflow-action";
import { SchedulerSection } from "@/features/workflows/components/scheduler-section";

import { WorkflowStatus } from "@/features/workflows/types";

interface WorkflowCardProps {
  workflow: Workflow;
}

export const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="border border-separate shadow-sm rounded-lg overflow-hidden hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            statusColors[workflow.status as WorkflowStatus],
          )}>
            {isDraft ? (
              <FileTextIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-muted-foreground flex items-center">
              <Link
                href={`/workflows/editor/${workflow.id}`}
                className="flex items-center hover:underline"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              ) }
            </h3>
            <SchedulerSection 
              workflowId={workflow.id}
              isDraft={isDraft} 
              creditsCost={workflow.creditsCost} 
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunButton workflowId={workflow.id} />}
          <Link
            href={`/workflows/editor/${workflow.id}`}
            className={cn(
              "flex items-center space-x-2",
              buttonVariants({
                variant: "outline",
                size: "sm"
              }),
            )}
          >
            <ShuffleIcon className="size-4" />
            Edit
          </Link>
          <WorkflowAction 
            id={workflow.id}
            name={workflow.name} 
          />
        </div>
      </CardContent>
    </Card>
  );
}