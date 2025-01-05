import { LucideIcon } from "lucide-react";

interface ExecutionLabelProps {
  icon: LucideIcon;
  label: React.ReactNode;
  value: React.ReactNode;
}

export const ExecutionLabel = ({
  icon: Icon,
  label,
  value,
}: ExecutionLabelProps) =>{ 
  return (
    <div className="flex justify-between items-center py-2 px-4 text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={20} className="stroke-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="font-semibold capitalize flex items-center gap-2">
        {value}
      </div>
    </div>
  );
}