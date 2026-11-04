/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.SIDEBAR
 * WHAT: Unified suite sidebar for module and transformation actions.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/UnifiedSuiteSidebar.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Unified Suite Taskbar (Right-Hand Side)
 * Consolidates "Office Tools" and "Turn sources into" into a single, unified
 * accordion sidebar on the right hand side, dedicating the full left hand
 * area to the document preview canvas.
 */

import React, { useState } from 'react';
import {
  Wrench,
  Sparkles,
  FileText,
  Sheet,
  Presentation,
  Pencil,
  FileSignature,
  BookOpen,
  CalendarCheck,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Video,
  GitFork,
  HelpCircle,
  BarChart2,
  Table,
  Calendar,
  List,
  FileEdit,
  Check
} from 'lucide-react';
import { SuiteModuleId, TransformActionId } from '../types';

interface UnifiedSuiteSidebarProps {
  activeModule: SuiteModuleId;
  onSelectModule: (module: SuiteModuleId) => void;
  onExecuteTransform: (transformType: TransformActionId) => void;
  isGenerating?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  sourcesCount: number;
  activeSourcesCount: number;
}

interface OfficeToolItem {
  id: SuiteModuleId;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  iconColor: string;
  badge?: string | number;
}

const OFFICE_TOOLS: OfficeToolItem[] = [
  { id: 'documents', label: 'Documents', sublabel: 'Writer • ODF v1.2', icon: FileText, iconColor: 'text-cyan-400' },
  { id: 'spreadsheets', label: 'Spreadsheets', sublabel: 'Calc • Formulas', icon: Sheet, iconColor: 'text-emerald-400' },
  { id: 'presentations', label: 'Presentations', sublabel: 'Impress • Slides', icon: Presentation, iconColor: 'text-rose-400' },
  { id: 'draw', label: 'Draw', sublabel: 'Vector & Canvas', icon: Pencil, iconColor: 'text-yellow-400' },
  { id: 'pdf', label: 'PDF & Annotation', sublabel: 'Reviewer & Markup', icon: FileSignature, iconColor: 'text-pink-400' },
  { id: 'research', label: 'Research Notebook', sublabel: 'Open Notebook • Audio', icon: BookOpen, iconColor: 'text-purple-400' },
  { id: 'notes', label: 'Notes', sublabel: 'Action Items & Memos', icon: CalendarCheck, iconColor: 'text-amber-400' },
  { id: 'sources', label: 'Sources', sublabel: 'Active Document Index', icon: Layers, iconColor: 'text-cyan-400' }
];

interface TransformOption {
  id: TransformActionId;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  badge?: string;
}

const CONVERSION_OPTIONS: TransformOption[] = [
  { id: 'Audio Overview', label: 'Audio Overview', icon: Sparkles, iconColor: 'text-purple-400' },
  { id: 'Slide Deck', label: 'Slide Deck', icon: Presentation, iconColor: 'text-rose-400' },
  { id: 'Video Overview', label: 'Video Overview', icon: Video, iconColor: 'text-emerald-400' },
  { id: 'Mind Map', label: 'Mind Map', icon: GitFork, iconColor: 'text-purple-300' },
  { id: 'Reports', label: 'Reports', icon: FileText, iconColor: 'text-pink-400' },
  { id: 'Flashcards', label: 'Flashcards', icon: Layers, iconColor: 'text-yellow-400' },
  { id: 'Quiz', label: 'Quiz', icon: HelpCircle, iconColor: 'text-cyan-400' },
  { id: 'Infographic', label: 'Infographic', icon: BarChart2, iconColor: 'text-amber-300' },
  { id: 'Data Table', label: 'Data Table', icon: Table, iconColor: 'text-blue-400' },
  { id: 'Timeline', label: 'Timeline', icon: Calendar, iconColor: 'text-sky-400' },
  { id: 'Summary', label: 'Summary', icon: List, iconColor: 'text-teal-400' },
  { id: 'FAQ', label: 'FAQ', icon: HelpCircle, iconColor: 'text-indigo-400' },
  { id: 'Extract', label: 'Extract', icon: FileEdit, iconColor: 'text-amber-400' }
];

export const UnifiedSuiteSidebar: React.FC<UnifiedSuiteSidebarProps> = ({
  activeModule,
  onSelectModule,
  onExecuteTransform,
  isGenerating = false,
  isCollapsed,
  onToggleCollapse,
  sourcesCount,
  activeSourcesCount
}) => {
  const [isOfficeToolsOpen, setIsOfficeToolsOpen] = useState(true);
  const [isTurnSourcesOpen, setIsTurnSourcesOpen] = useState(true);

  if (isCollapsed) {
    return (
      <aside className="agpu-sidebar-collapsed w-12 shrink-0 flex flex-col items-center gap-2 py-2 select-none bg-slate-950/90 border-l border-slate-800/80 rounded-xl">
        {/* Expand Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          title="Expand Unified Taskbar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="w-6 h-px bg-slate-800 my-0.5" />

        {/* Office Tools Shortcut */}
        <button
          onClick={() => {
            onToggleCollapse();
            setIsOfficeToolsOpen(true);
          }}
          className="p-1.5 rounded-lg text-cyan-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Office Tools"
        >
          <Wrench className="w-4 h-4" />
        </button>

        {/* Turn Sources Into Shortcut */}
        <button
          onClick={() => {
            onToggleCollapse();
            setIsTurnSourcesOpen(true);
          }}
          className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Turn sources into"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <div className="mt-auto mb-1 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[9px] font-mono text-cyan-300">
          {sourcesCount}
        </div>
      </aside>
    );
  }

  return (
    <aside className="agpu-sidebar w-72 sm:w-80 shrink-0 flex flex-col h-full max-h-full min-h-0 select-none bg-slate-950/95 border-l border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Top Bar with Collapse Button */}
      <div className="agpu-sidebar-header shrink-0 flex items-center justify-between px-3 py-2 border-b border-slate-800/90 bg-slate-950">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.5)] shrink-0">
            <Layers className="w-3.5 h-3.5 text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-xs sm:text-sm font-bold tracking-wide text-white truncate">
            LeeWay Workspace
            </h2>
            <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
              Office apps & source actions
            </p>
          </div>
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-1"
          title="Collapse Taskbar for Full Preview"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Accordion Scroll Body with Guaranteed Full Height Scrolling */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 sm:p-2.5 pb-8 flex flex-col gap-2.5 custom-suite-scrollbar overscroll-contain touch-pan-y">
        {/* ==================================================== */}
        {/* SECTION 1: Office Tools (Dropdown / Accordion)      */}
        {/* ==================================================== */}
        <div className="shrink-0 rounded-xl border border-slate-800/90 bg-slate-900/50 overflow-hidden shadow-sm">
          {/* Office Tools Dropdown Header */}
          <button
            onClick={() => setIsOfficeToolsOpen(!isOfficeToolsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 hover:bg-slate-800/80 transition-colors cursor-pointer text-left border-b border-slate-800/60"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-cyan-950 border border-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.4)] shrink-0">
                <Wrench className="w-3 h-3 text-cyan-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white tracking-wide">
                  Office Tools
                </span>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                  Create, edit & manage modules
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                {OFFICE_TOOLS.length}
              </span>
              {isOfficeToolsOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>

          {/* Dropped Down Content: Office Tools List */}
          {isOfficeToolsOpen && (
            <div className="p-1.5 grid grid-cols-1 gap-1">
              {OFFICE_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeModule === tool.id;

                return (
                  <button
                    key={tool.id}
                    onClick={() => onSelectModule(tool.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-white border border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-md border shrink-0 ${
                          isActive
                            ? 'bg-cyan-950 border-cyan-400'
                            : 'bg-slate-800/80 border-slate-700/60'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${tool.iconColor}`} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold truncate leading-tight">
                          {tool.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono truncate leading-none mt-0.5">
                          {tool.sublabel}
                        </span>
                      </div>
                    </div>

                    {tool.id === 'sources' && (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300 shrink-0">
                        {sourcesCount}
                      </span>
                    )}

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* SECTION 2: Turn sources into (Dropdown / Accordion) */}
        {/* ==================================================== */}
        <div className="shrink-0 rounded-xl border border-slate-800/90 bg-slate-900/50 overflow-hidden shadow-sm">
          {/* Turn Sources Into Dropdown Header */}
          <button
            onClick={() => setIsTurnSourcesOpen(!isTurnSourcesOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/90 hover:bg-slate-800/80 transition-colors cursor-pointer text-left border-b border-slate-800/60"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-purple-950 border border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.4)] shrink-0">
                <Sparkles className="w-3 h-3 text-purple-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white tracking-wide">
                  Turn selected sources into
                </span>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                  Create the artifact here • no handoff
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
                {CONVERSION_OPTIONS.length}
              </span>
              {isTurnSourcesOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
          </button>

          {/* Dropped Down Content: Conversion Options (2 columns from reference) */}
          {isTurnSourcesOpen && (
            <div className="p-2 grid grid-cols-2 gap-1.5">
              {CONVERSION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onExecuteTransform(opt.id)}
                    aria-label={`Create ${opt.label} from selected sources`}
                    title={activeSourcesCount === 0 ? 'Select at least one source first' : `Create ${opt.label} from selected sources`}
                    disabled={isGenerating || activeSourcesCount === 0}
                    className="group relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-800/90 border border-slate-700/60 group-hover:border-purple-400/40 shrink-0">
                      <Icon className={`w-3 h-3 ${opt.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-0.5">
                        <span className="text-[10px] font-medium text-slate-200 group-hover:text-white truncate">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="px-1 py-0.2 rounded-full text-[7px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 shrink-0">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pinned Bottom Status Bar (Always visible, outside scroll area) */}
      <div className="shrink-0 px-3 py-2 border-t border-slate-800/90 bg-slate-950/95 text-[10px] text-slate-400 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Active Sources: <strong className="text-cyan-300 font-mono">{activeSourcesCount}</strong>
        </span>
        <span className="text-cyan-400 font-semibold tracking-wide flex items-center gap-1">
          <Check className="w-3 h-3 text-cyan-400" />
          Veritas Sovereign
        </span>
      </div>
    </aside>
  );
};
