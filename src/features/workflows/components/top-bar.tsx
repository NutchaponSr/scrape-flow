"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Hint } from "@/components/hint";

import { SaveButton } from "@/features/workflows/components/save-button";
import { ExecuteButton } from "@/features/workflows/components/execute-button";
import { PublishButton } from "@/features/workflows/components/publish-button";
import { NavigationTabs } from "@/features/workflows/components/navigation-tabs";
import { UnpublishButton } from "@/features/workflows/components/unpublish-button";

interface TopbarProps {
  title: string;
  subtitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  isPublished?: boolean;
}

export const TopBar = ({ 
  title, 
  subtitle,
  workflowId,
  hideButtons = false,
  isPublished = false,
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
      <NavigationTabs workflowId={workflowId} />
      <div className="flex gap-1 flex-1 justify-end">
        {!hideButtons && (
          <>
            <ExecuteButton workflowId={workflowId} />
            {isPublished && (
              <UnpublishButton workflowId={workflowId} />
            )}
            {!isPublished && (
              <>
                <SaveButton workflowId={workflowId} />
                <PublishButton workflowId={workflowId} />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}