import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { Phase } from "@/features/workflows/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function waitFor(ms: number) {
  new Promise(resolve => setTimeout(resolve, ms));
}

export function datesToDurationString(
  end: Date | null | undefined,
  start: Date | null | undefined,
) {
  if (!start || !end) return null;

  const timeElapsed = end.getTime() - start.getTime();

  if (timeElapsed < 1000) return `${timeElapsed}ms`;

  const duration = intervalToDuration({
    start: 0,
    end: timeElapsed,
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}

export function getPhasesTotalCost(phases: Phase[]) {
  return phases.reduceRight((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}