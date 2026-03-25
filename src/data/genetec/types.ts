// ─── Primitives ──────────────────────────────────────────────────────────────

export type SeverityLevel = 'info' | 'warning' | 'critical' | 'fatal';
export type SkillLevel = 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
export type EquipmentType =
  | 'camera'
  | 'controller'
  | 'reader'
  | 'door'
  | 'server'
  | 'archiver'
  | 'workstation'
  | 'network'
  | 'system';
export type GenetecDomain = 'video' | 'access-control' | 'system' | 'network';
export type ArticleCategory = 'reference' | 'configuration' | 'diagnostic' | 'maintenance';
export type ChecklistTiming =
  | 'commissioning'
  | 'pre-intervention'
  | 'post-intervention'
  | 'post-update'
  | 'periodic';
export type DiagnosticCauseProbability = 'high' | 'medium' | 'low';

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface GenetecParameter {
  name: string;
  value: string;
  description?: string;
}

// ─── Guided Procedure ─────────────────────────────────────────────────────────

export interface GenetecProcedureStep {
  id: string;
  title: string;
  description: string;
  substeps?: string[];
  parameters?: GenetecParameter[];
  warning?: string;
  tip?: string;
  logsToCheck?: string[];
  validation?: string;
}

export interface GenetecGuidedProcedure {
  id: string;
  title: string;
  description: string;
  domain: GenetecDomain;
  equipment: EquipmentType[];
  skillLevel: SkillLevel;
  estimatedTime: string;
  prerequisites: string[];
  steps: GenetecProcedureStep[];
  validationChecks: string[];
  warnings?: string[];
  relatedProcedures?: string[];
  relatedDiagnostics?: string[];
}

// ─── Diagnostic Flow ──────────────────────────────────────────────────────────

export interface GenetecDiagnosticCause {
  id: string;
  description: string;
  probability: DiagnosticCauseProbability;
  checkSteps: string[];
  correctiveActions: string[];
  logsToCheck?: string[];
  escalate?: boolean;
}

export interface GenetecDiagnosticFlow {
  id: string;
  symptom: string;
  description: string;
  domain: GenetecDomain;
  equipment: EquipmentType[];
  severity: SeverityLevel;
  immediateActions: string[];
  causes: GenetecDiagnosticCause[];
  escalationCriteria?: string[];
  relatedProcedures?: string[];
}

// ─── Log Reference ────────────────────────────────────────────────────────────

export type LogSource =
  | 'Security Desk'
  | 'Config Tool'
  | 'Event Viewer'
  | 'Health Monitor'
  | 'Windows Event Log';

export interface GenetecLogReference {
  id: string;
  source: LogSource;
  component: string;
  eventName: string;
  severity: SeverityLevel;
  description: string;
  impact: string;
  probableCauses: string[];
  recommendedActions: string[];
  relatedDiagnostics?: string[];
}

// ─── Checklist ────────────────────────────────────────────────────────────────

export interface GenetecChecklistItem {
  id: string;
  label: string;
  description?: string;
  critical: boolean;
  logsToCheck?: string[];
  parameters?: GenetecParameter[];
}

export interface GenetecChecklist {
  id: string;
  title: string;
  description: string;
  domain: GenetecDomain;
  equipment: EquipmentType[];
  timing: ChecklistTiming;
  estimatedTime: string;
  items: GenetecChecklistItem[];
  relatedProcedures?: string[];
}

// ─── Knowledge Article ────────────────────────────────────────────────────────

export interface GenetecKnowledgeSection {
  title: string;
  body: string;
  parameters?: { name: string; description: string; defaultValue?: string; range?: string }[];
  warnings?: string[];
  tips?: string[];
}

export interface GenetecKnowledgeArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  domain: GenetecDomain;
  equipment?: EquipmentType[];
  skillLevel: SkillLevel;
  summary: string;
  sections: GenetecKnowledgeSection[];
  relatedArticles?: string[];
  relatedProcedures?: string[];
}
