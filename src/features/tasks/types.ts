export enum TaskType {
  LAUNCH_BROWSER = "LAUNCH_BROWSER",
}

export enum TaskParamType {
  STRING = "STRING",
}

export interface TaskParam {
  name: string;
  type: TaskParamType;
  helperText?: string;
  required?: boolean;
  hidleHandle?: boolean;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}