import { Separator } from "@/components/ui/separator";

import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";

interface WorkflowsLayoutProps {
  children: React.ReactNode;
}

const WorkflowsLayout = ({ children }: WorkflowsLayoutProps) => {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={16} fontSize="text-xl" />
        <ModeToggle />
      </footer>
    </div>
  );
}

export default WorkflowsLayout;