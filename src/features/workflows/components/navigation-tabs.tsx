"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface NavigationTabsProps {
  workflowId: string;
}

export const NavigationTabs = ({ workflowId }: NavigationTabsProps) => {
  const pathname = usePathname();
  const activeValue = pathname.split("/")[2];

  return (
    <Tabs value={activeValue} className="w-[400px]">
      <TabsList className="grid grid-cols-2 w-full">
        <Link href={`/workflows/editor/${workflowId}`}>
          <TabsTrigger value="editor" className="w-full">
            Editor
          </TabsTrigger>
        </Link>
        <Link href={`/workflows/runs/${workflowId}`}>
          <TabsTrigger value="runs" className="w-full">
            Runs
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}