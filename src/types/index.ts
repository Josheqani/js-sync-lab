export type ExecutionType = 'sync' | 'async';

export type TokenType =
  | 'keyword'
  | 'function'
  | 'string'
  | 'number'
  | 'comment'
  | 'operator'
  | 'punctuation'
  | 'variable'
  | 'plain';

export interface CodeToken {
  text: string;
  type: TokenType;
}

export interface CodeLine {
  lineNumber: number;
  tokens: CodeToken[];
  rawText: string;
  description?: string;
}

export interface StackFrame {
  id: string;
  name: string;
  line: number;
  type: 'sync' | 'async-reg' | 'callback' | 'microtask';
  color?: string;
}

export interface WebApiTask {
  id: string;
  label: string;
  durationMs: number;
  remainingMs: number;
  callbackName: string;
  progress: number; // 0 to 100
  targetLine: number;
}

export interface QueueItem {
  id: string;
  name: string;
  type: 'macrotask' | 'microtask';
  targetLine: number;
  source: string;
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'sync' | 'async' | 'microtask' | 'info';
  lineNumber: number;
  stepIndex: number;
}

export interface StepState {
  stepIndex: number;
  activeLineNumber: number | null;
  activeLineSecondary?: number | null; // e.g. showing both definition and trigger
  highlightReason: 'sync-exec' | 'async-register' | 'jump-skip' | 'callback-exec' | 'idle' | 'stack-clear';
  callStack: StackFrame[];
  webApis: WebApiTask[];
  taskQueue: QueueItem[];
  microtaskQueue: QueueItem[];
  eventLoopStatus: 'idle' | 'monitoring' | 'transferring' | 'blocked';
  consoleLogs: ConsoleLogEntry[];
  title: string;
  description: string;
  deepDive: {
    callStackAction: string;
    webApiAction: string;
    eventLoopAction: string;
    takeaway: string;
  };
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  type: ExecutionType;
  lines: CodeLine[];
  steps: StepState[];
  comparisonScenarioId?: string;
}
