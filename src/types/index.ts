// ─── Enums & union types ───────────────────────────────────────────────────

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ToolType =
  | 'CMD'
  | 'PowerShell'
  | 'Nmap'
  | 'Wireshark'
  | 'Bash'
  | 'Browser'
  | 'Terrain'
  | 'Python'
  | 'SSH'
  | 'Telnet'
  | 'ONVIF'
  | 'Autre';

export type CategoryId =
  | 'network-config'
  | 'connectivity'
  | 'dns'
  | 'discovery'
  | 'nmap'
  | 'ports-processes'
  | 'video-surveillance'
  | 'onvif'
  | 'poe-switch'
  | 'wireshark'
  | 'cybersecurity'
  | 'terrain-tips';

// ─── Category ─────────────────────────────────────────────────────────────

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: string;
  color: string;
  count?: number;
}

// ─── Command ──────────────────────────────────────────────────────────────

export interface CommandEntry {
  id: string;
  title: string;
  command: string;
  tool: ToolType;
  category: CategoryId;
  description: string;
  fieldUsage: string;
  level: DifficultyLevel;
  tags: string[];
  useCases: string[];
  notes?: string;
  warning?: string;
  examples?: CommandExample[];
  relatedDiagnostics?: string[];
  relatedChecklists?: string[];
}

export interface CommandExample {
  label: string;
  command: string;
  description?: string;
}

// ─── Diagnostic ────────────────────────────────────────────────────────────

export interface DiagnosticStep {
  stepNumber: number;
  title: string;
  description: string;
  commands?: string[];
  checkpoints?: string[];
  tip?: string;
  warning?: string;
}

export interface DiagnosticGuide {
  id: string;
  title: string;
  description: string;
  problemSummary: string;
  category: CategoryId;
  level: DifficultyLevel;
  tags: string[];
  estimatedTime?: string;
  steps: DiagnosticStep[];
  probableCauses: string[];
  bestPractices: string[];
  variants?: string[];
  caution?: string;
  relatedCommands?: string[];
}

// ─── Checklist ─────────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  critical?: boolean;
  command?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistTemplate {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  tags: string[];
  estimatedTime?: string;
  sections: ChecklistSection[];
  notes?: string;
}

// ─── User state (localStorage) ─────────────────────────────────────────────

export interface ChecklistProgress {
  checklistId: string;
  checkedItems: Record<string, boolean>;
  startedAt: string;
  updatedAt: string;
}

export interface FavoritesState {
  commands: string[];
  diagnostics: string[];
  checklists: string[];
}

export interface HistoryEntry {
  type: 'command' | 'diagnostic' | 'checklist' | 'search';
  id?: string;
  query?: string;
  title: string;
  visitedAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  compactMode: boolean;
  showWelcome: boolean;
}
