"use client";

import { ParamProps } from "@/features/node/types";

export const BrowserInstanceParam = ({ param }: ParamProps) => {
  return (
    <p className="text-xs">
      {param.name}
    </p>
  );
}