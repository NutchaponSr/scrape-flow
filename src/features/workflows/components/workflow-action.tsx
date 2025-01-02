import { 
  MoreVerticalIcon,
  TrashIcon 
} from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Hint } from "@/components/hint";

import { DeleteWorkflowDialog } from "@/features/workflows/components/delete-workflow-dialog";

interface WorkflowActionProps {
  name: string;
  id: string;
}

export const WorkflowAction = ({ name, id }: WorkflowActionProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Hint content="Workflow Actions">
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon className="size-[18px]" />
              </div>
            </Hint>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog((prev) => !prev)}
            className="text-destructive flex items-center gap-2"
          >
            <TrashIcon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteWorkflowDialog 
        open={showDeleteDialog} 
        setOpen={setShowDeleteDialog} 
        name={name}
        id={id}
      />
    </>
  );
}