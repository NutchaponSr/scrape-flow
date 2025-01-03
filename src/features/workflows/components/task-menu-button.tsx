import { Button } from "@/components/ui/button";

import { TaskType } from "@/features/tasks/types";
import { TaskRegistry } from "@/features/tasks/registry";

interface TaskMenuButtonProps {
  taskType: TaskType;
}

export const TaskMenuButton = ({ taskType }: TaskMenuButtonProps) => {
  const task = TaskRegistry[taskType];

  const onDragStart = (e: React.DragEvent, type: TaskType) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <Button
      draggable
      variant="secondary"
      onDragStart={(e) => onDragStart(e, taskType)}
      className="flex justify-between items-center gap-2 border w-full"
    >
      <div className="flex gap-2">
        <task.icon size={20} />
        {task.label}
      </div>
    </Button>
  );
}