"use client";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface CustomDialogHeaderProps {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  titleClassName?: string;
  subTitleClassName?: string;
}

export const CustomDialogHeader = ({
  title,
  subTitle,
  icon: Icon,
  iconClassName,
  titleClassName,
  subTitleClassName
}: CustomDialogHeaderProps) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && (
            <Icon 
              size={30}
              className={cn(
                "stroke-primary",
                iconClassName
              )}
            />
          )}
          {title && (
            <h2 className={cn("text-xl text-primary", titleClassName)}>
              {title}
            </h2>
          )}
          {subTitle && (
            <p className={cn("text-sm text-muted-foreground", subTitleClassName)}>
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}