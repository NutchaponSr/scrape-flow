"use client";

import { 
  ChangeEvent,
  useEffect,
  useId, 
  useState 
} from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ParamProps } from "@/features/node/types";
import { Textarea } from "@/components/ui/textarea";

export const StringParam = ({ 
  param,
  value,
  disabled,
  updateNodeParamValue,
}: ParamProps) => {
  const id = useId();

  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value)
  }, [value]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Component: any = Input;

  if (param.variant === "textarea") {
    Component = Textarea;
  }

  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && (
          <p className="text-red-400 px-2">*</p>
        )}
      </Label>
      <Component 
        id={id} 
        disabled={disabled}
        value={internalValue}
        placeholder="Enter value here"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInternalValue(e.target.value)}
        onBlur={(e: ChangeEvent<HTMLInputElement>) => updateNodeParamValue(e.target.value)}
        className="bg-background"
      />
      {param.helperText && (
        <p className="text-muted-foreground px-2">
          {param.helperText}
        </p>
      )}
    </div>
  );
}