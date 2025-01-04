"use client";

import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

interface ExecuteButtonProps {
  workflowId: string;
}

export const ExecuteButton = ({ workflowId }:  ExecuteButtonProps) => {
  return (
    <Button
      variant="outline"
    >
      <PlayIcon className="stroke-orange-400" />
      Execute
    </Button>
  );
}