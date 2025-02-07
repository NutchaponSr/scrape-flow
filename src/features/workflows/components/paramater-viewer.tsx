import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ParamaterViewerProps {
  title: string;
  subtitle: string;
  paramsJSON: string | null;
}

export const ParamaterViewer = ({
  title,
  subtitle,
  paramsJSON
}: ParamaterViewerProps) => {
  const params = paramsJSON ? JSON.parse(paramsJSON) : undefined;

  return (
    <Card>
      <CardHeader className="rounded-lg rounded-b-none border-b py-4 bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div>
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-sm">No paramaters generated by this phase</p>
          )}
          {params && Object.entries(params).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                {key}
              </p>
              <Input
                readOnly
                className="flex-1 basic-2/3"
                value={value as string}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}