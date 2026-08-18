export type VariableValue =
  | number
  | string
  | boolean
  | null
  | VariableValue[]
  | { [key: string]: VariableValue };

export type Variables = {
  [key: string]: VariableValue;
};

export type ExecutionState = {
  lines: string[];
  currentLine: number;
  variables: Variables;
  prevVariables: Variables;
  isFinished: boolean;
  logs: string[];
  breakpoints: number[];
  isContinuing: boolean;
  errors: string[];
};

export type HistoryState = ExecutionState[];
