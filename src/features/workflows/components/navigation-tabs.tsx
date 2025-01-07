"use client";

import Link from "next/link";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface NavigationTabsProps {
  workflowId: string;
}

export const NavigationTabs = ({ workflowId }: NavigationTabsProps) => {
  return (
    <Tabs className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-full">
        <Link href={`/workflows/editor/${workflowId}`}>Editor</Link>
        <Link href={`/workflows/runs/${workflowId}`}>Run</Link>
      </TabsList>
    </Tabs>
  );
}