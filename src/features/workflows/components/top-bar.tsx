"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Hint } from "@/components/hint";

import { SaveButton } from "@/features/workflows/components/save-button";

interface TopbarProps {
  title: string;
  subtitle?: string;
  workflowId: string;
}

export const Topbar = ({ 
  title, 
  subtitle,
  workflowId
}: TopbarProps) => {
  const router = useRouter();

  return (
    <header className="flex p-2 border-b border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <Hint content="Back">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </Hint>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate text-ellipsis">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <SaveButton workflowId={workflowId} />
      </div>
    </header>
  );
}