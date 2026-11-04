/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.DATA
 * TAG: LEEWAY.APP.DATA.DEFAULTSOURCES
 * WHAT: Default grounded source records for the Office Suites demo state.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/data/defaultSources.ts
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Initial Grounded Sources matching the LeeWay Office Suites specification
 */

import { GroundedSource } from '../types';

export const INITIAL_SOURCES: GroundedSource[] = [
  {
    id: 'src-1',
    title: 'LeeWay Project Report.pdf',
    type: 'pdf',
    pageCount: 12,
    category: 'Project update',
    checked: true,
    content: `LeeWay Project Report - Integration & Workforce Update (Jan 27, 2025).
1. Executive Summary:
The integration project continues to make strong progress, with key milestones on track for the next phase of deployment. This report summarizes progress, outcomes, and recommendations.
2. Project Progress:
- Integration layer: 92% complete
- Workforce onboarding: In progress (Phase 2)
- Knowledge base: Expanded with 42 new resources
3. Key Outcomes:
- Improved team productivity
- Expanded knowledge coverage
- Autonomous verification receipts active across all operational units.`,
    summary: 'Executive report detailing the 92% completion of the integration layer and 42 knowledge resources.',
    updatedAt: 'Jan 27, 2025'
  },
  {
    id: 'src-2',
    title: 'Integration Plan.docx',
    type: 'docx',
    pageCount: 8,
    category: 'Implementation',
    checked: true,
    content: `Integration Plan for LeeWay Office Suites and Open Notebook Core.
Scope:
- Unified workspace embedding LibreOffice core engines (Writer, Calc, Impress, Draw) with Open Notebook research grounding.
- Zero-latency context preservation following the LeeWay Continuum pipeline.
- Real-time token citations and Veritas receipt hashing on every synthesis action.
- Milestones 1 through 4 completed. Milestone 5 (Enterprise federation) scheduled for next quarter.`,
    summary: 'Technical implementation architecture binding office productivity tools to source grounding.',
    updatedAt: 'Jan 24, 2025'
  },
  {
    id: 'src-3',
    title: 'Workforce Brief.pdf',
    type: 'pdf',
    pageCount: 6,
    category: 'Team & adoption',
    checked: true,
    content: `Workforce Brief: Phase 2 Pilot and Organizational Adoption.
Key Metrics:
- Phase 2 deployment active across pilot business units.
- 88% user adoption achieved within first 14 days.
- Over 42 dedicated knowledge assets and prompt atoms deployed into enterprise workspace.
- Training sessions complete for all team facilitators. Feedback indicates +34% operational velocity.`,
    summary: 'Workforce adoption progress, training statistics, and cross-team productivity improvements.',
    updatedAt: 'Jan 26, 2025'
  }
];

export const INITIAL_KNOWLEDGE_BASE_ITEMS = [
  { id: 'kb-1', title: 'LeeWay Standards Architecture Whitepaper v2026.4', category: 'Standards', pages: 24, date: '2025-01-20' },
  { id: 'kb-2', title: 'LibreOffice Core C++ Integration Guidelines', category: 'Architecture', pages: 32, date: '2025-01-18' },
  { id: 'kb-3', title: 'Open Notebook Grounded Model Synthesis Spec', category: 'Research', pages: 18, date: '2025-01-22' },
  { id: 'kb-4', title: 'FabricPASS Cryptographic Validation Framework', category: 'Security', pages: 14, date: '2025-01-15' },
  { id: 'kb-5', title: 'Continuum Context Pipeline: 8-Stage Lifecycle', category: 'Continuum', pages: 20, date: '2025-01-19' },
  { id: 'kb-6', title: 'Workforce Onboarding Phase 2 Operational Playbook', category: 'Operations', pages: 16, date: '2025-01-25' },
  { id: 'kb-7', title: 'Vector Embeddings & Semantic Indexing Topology', category: 'Knowledge', pages: 28, date: '2025-01-12' },
  { id: 'kb-8', title: 'Veritas Receipt Generation & Multi-Tenant Audit', category: 'Governance', pages: 12, date: '2025-01-26' },
  { id: 'kb-9', title: 'Agent SkillsPASS & Modular Execution Atoms', category: 'Agents', pages: 22, date: '2025-01-14' },
  { id: 'kb-10', title: 'Spreadsheet Calculation Engine Matrix Specification', category: 'Office Suite', pages: 15, date: '2025-01-17' },
  { id: 'kb-11', title: 'Vector Drawing & Diagramming Canvas Protocol', category: 'Office Suite', pages: 19, date: '2025-01-21' },
  { id: 'kb-12', title: 'Slide Presentation Layout & Visual Anchor Grammar', category: 'Office Suite', pages: 26, date: '2025-01-23' }
];
