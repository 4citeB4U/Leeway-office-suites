/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.CORE
 * TAG: LEEWAY.APP.CORE.TYPES
 * WHAT: Shared type contracts for the Office Suites client.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/types.ts
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LeeWay Standards Architectural Type Definitions
 * Adhering to https://github.com/4citeB4U/LeeWay-Standards
 */

export type SuiteModuleId =
  | 'documents'
  | 'spreadsheets'
  | 'presentations'
  | 'draw'
  | 'pdf'
  | 'research'
  | 'notes'
  | 'sources';

export type SystemDockId =
  | 'home'
  | 'workforce'
  | 'blackboard'
  | 'office'
  | 'continuum'
  | 'diagnostics'
  | 'preview'
  | 'apps';

export type TransformActionId =
  | 'Audio Overview'
  | 'Slide Deck'
  | 'Video Overview'
  | 'Mind Map'
  | 'Reports'
  | 'Flashcards'
  | 'Quiz'
  | 'Infographic'
  | 'Data Table'
  | 'Timeline'
  | 'Summary'
  | 'FAQ'
  | 'Extract';

export type GroundedActionId =
  | 'Ask a Question'
  | 'Extract Notes'
  | 'Summarize'
  | 'Compare Documents'
  | 'Extract';

export interface GroundedSource {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'md' | 'txt' | 'web';
  pageCount: number;
  category: string;
  checked: boolean;
  content: string;
  summary: string;
  updatedAt: string;
}

export interface VeritasReceipt {
  status: 'VERIFIED' | 'COMPLIANT' | 'AUDITED';
  hash: string;
  complianceScore: string;
  groundedSourcesCount: number;
  timestamp: string;
  standardsVersion: string;
  formulaStage: string;
}

export interface AnnotationItem {
  id: string;
  type: 'highlight' | 'pen' | 'note' | 'circle' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  text?: string;
  page: number;
  author: string;
  createdAt: string;
}

export interface TransformResult {
  transformType: string;
  content: string;
  veritas: VeritasReceipt;
  sourcesUsed: string[];
  artifact?: TransformArtifact;
}

export type TransformArtifactKind =
  | 'text'
  | 'slides'
  | 'table'
  | 'mindmap'
  | 'infographic'
  | 'audio'
  | 'video'
  | 'cards'
  | 'quiz'
  | 'timeline'
  | 'faq'
  | 'extract';

export interface TransformSlide {
  title: string;
  subtitle: string;
  bullets: string[];
  notes?: string;
}

export interface TransformTableRow {
  source: string;
  type: string;
  pages: number;
  updated: string;
  category: string;
  summary: string;
}

export interface TransformMetric {
  label: string;
  value: string;
  detail: string;
}

export interface TransformAudioTurn {
  speaker: 'Alex' | 'Morgan';
  text: string;
  timestamp: string;
}

export interface TransformArtifact {
  kind: TransformArtifactKind;
  title: string;
  description: string;
  text?: string;
  slides?: TransformSlide[];
  rows?: TransformTableRow[];
  metrics?: TransformMetric[];
  nodes?: Array<{ id: string; label: string; parentId?: string }>;
  dialogue?: TransformAudioTurn[];
  cards?: Array<{ question: string; answer: string; source: string }>;
  questions?: Array<{ question: string; options: string[]; answer: string }>;
}
