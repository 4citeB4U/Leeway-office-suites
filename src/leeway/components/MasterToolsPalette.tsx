/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Master Tools Palette
 * Comprehensive tool suite fulfilling all parts of the LeeWay Office Suites:
 * - Documents (Writer)
 * - Spreadsheets (Calc)
 * - Presentations (Impress)
 * - Draw & Vector Diagramming
 * - PDF & Annotations
 * - Research Notebook Grounding
 */

import React, { useState } from 'react';
import {
  X,
  Wrench,
  Search,
  FileText,
  Sheet,
  Presentation,
  Pencil,
  FileSignature,
  BookOpen,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  CheckSquare,
  ShieldCheck,
  Calculator,
  Percent,
  DollarSign,
  TrendingUp,
  BarChart2,
  PieChart,
  Play,
  Copy,
  Layers,
  Square,
  Circle,
  ArrowRight,
  Highlighter,
  PenTool,
  MessageSquare,
  Type,
  Crop,
  Stamp,
  Maximize2,
  Sparkles,
  Link,
  Code,
  Check,
  ArrowUpDown,
  Filter,
  Grid
} from 'lucide-react';
import { SuiteModuleId } from '../types';

interface MasterToolsPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: SuiteModuleId;
  onSelectModule: (mod: SuiteModuleId) => void;
  onApplyToolAction?: (category: string, actionId: string, label: string) => void;
}

type ToolTabId = 'all' | 'documents' | 'spreadsheets' | 'presentations' | 'draw' | 'pdf' | 'research';

interface ToolActionItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
  iconColor: string;
  module: SuiteModuleId;
  shortcut?: string;
}

export const MasterToolsPalette: React.FC<MasterToolsPaletteProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  onApplyToolAction
}) => {
  const [activeTab, setActiveTab] = useState<ToolTabId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const TOOL_CATEGORIES: { id: ToolTabId; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Tools', icon: Wrench },
    { id: 'documents', label: 'Documents (Writer)', icon: FileText },
    { id: 'spreadsheets', label: 'Spreadsheets (Calc)', icon: Sheet },
    { id: 'presentations', label: 'Presentations (Impress)', icon: Presentation },
    { id: 'draw', label: 'Draw & Vector', icon: Pencil },
    { id: 'pdf', label: 'PDF & Annotation', icon: FileSignature },
    { id: 'research', label: 'Research Grounding', icon: BookOpen }
  ];

  const TOOLS_LIST: ToolActionItem[] = [
    // Documents
    {
      id: 'doc-bold',
      name: 'Bold / Emphasis',
      desc: 'Format text with high-contrast emphasis',
      icon: Bold,
      iconColor: 'text-cyan-400',
      module: 'documents',
      shortcut: 'Ctrl+B'
    },
    {
      id: 'doc-italic',
      name: 'Italic / Subtle',
      desc: 'Apply slanted italic typography',
      icon: Italic,
      iconColor: 'text-cyan-400',
      module: 'documents',
      shortcut: 'Ctrl+I'
    },
    {
      id: 'doc-underline',
      name: 'Underline',
      desc: 'Underline key terms and headings',
      icon: Underline,
      iconColor: 'text-cyan-400',
      module: 'documents',
      shortcut: 'Ctrl+U'
    },
    {
      id: 'doc-heading',
      name: 'Header & Sections',
      desc: 'Insert formatted H1/H2 section headers',
      icon: Type,
      iconColor: 'text-blue-400',
      module: 'documents'
    },
    {
      id: 'doc-table',
      name: 'Insert Matrix Table',
      desc: 'Insert customizable 4x4 data table',
      icon: Table,
      iconColor: 'text-indigo-400',
      module: 'documents'
    },
    {
      id: 'doc-veritas',
      name: 'Veritas Seal Attestation',
      desc: 'Embed cryptographic audit hash into document',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      module: 'documents'
    },

    // Spreadsheets
    {
      id: 'sheet-sum',
      name: 'AutoSum Formula',
      desc: 'Compute sum of selected column or row (=SUM)',
      icon: Calculator,
      iconColor: 'text-emerald-400',
      module: 'spreadsheets',
      shortcut: 'Alt+='
    },
    {
      id: 'sheet-currency',
      name: 'Currency Format ($)',
      desc: 'Format numbers as USD dollar values',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      module: 'spreadsheets'
    },
    {
      id: 'sheet-percent',
      name: 'Percentage Format (%)',
      desc: 'Convert decimal figures to percentages',
      icon: Percent,
      iconColor: 'text-teal-400',
      module: 'spreadsheets'
    },
    {
      id: 'sheet-chart',
      name: 'Generate Chart',
      desc: 'Insert reactive bar/pie chart from grid values',
      icon: BarChart2,
      iconColor: 'text-sky-400',
      module: 'spreadsheets'
    },
    {
      id: 'sheet-sort',
      name: 'Sort & Filter Grid',
      desc: 'Order tabular rows by ascending or descending values',
      icon: ArrowUpDown,
      iconColor: 'text-teal-300',
      module: 'spreadsheets'
    },

    // Presentations
    {
      id: 'pres-new-slide',
      name: 'Add New Slide',
      desc: 'Insert a new structured slide template',
      icon: Copy,
      iconColor: 'text-amber-400',
      module: 'presentations',
      shortcut: 'Ctrl+M'
    },
    {
      id: 'pres-slideshow',
      name: 'Presenter Mode (F5)',
      desc: 'Launch presentation in fullscreen with speaker notes',
      icon: Play,
      iconColor: 'text-amber-400',
      module: 'presentations',
      shortcut: 'F5'
    },
    {
      id: 'pres-layout',
      name: 'Slide Layout Templates',
      desc: 'Choose split, metric card, or executive layouts',
      icon: Layers,
      iconColor: 'text-amber-300',
      module: 'presentations'
    },

    // Draw & Vector
    {
      id: 'draw-rect',
      name: 'Rectangle & Box',
      desc: 'Vector rectangular container with border styling',
      icon: Square,
      iconColor: 'text-yellow-400',
      module: 'draw'
    },
    {
      id: 'draw-circle',
      name: 'Circle & Ellipse',
      desc: 'Vector radial circular node',
      icon: Circle,
      iconColor: 'text-yellow-400',
      module: 'draw'
    },
    {
      id: 'draw-arrow',
      name: 'Connector & Arrow',
      desc: 'Connect diagram nodes with dynamic directional lines',
      icon: ArrowRight,
      iconColor: 'text-yellow-300',
      module: 'draw'
    },
    {
      id: 'draw-grid',
      name: 'Snap to Grid',
      desc: 'Align vector paths to pixel-perfect millimeter grid',
      icon: Grid,
      iconColor: 'text-cyan-400',
      module: 'draw'
    },

    // PDF & Annotation
    {
      id: 'pdf-highlighter',
      name: 'Fluorescent Highlighter',
      desc: 'Mark key phrases with yellow or cyan tint',
      icon: Highlighter,
      iconColor: 'text-yellow-400',
      module: 'pdf'
    },
    {
      id: 'pdf-pen',
      name: 'Stylus & Ink Pen',
      desc: 'Freehand calligraphy and handwritten markup',
      icon: PenTool,
      iconColor: 'text-cyan-400',
      module: 'pdf'
    },
    {
      id: 'pdf-note',
      name: 'Sticky Note Comment',
      desc: 'Pin collaborative review note onto document page',
      icon: MessageSquare,
      iconColor: 'text-amber-400',
      module: 'pdf'
    },
    {
      id: 'pdf-text',
      name: 'Type Text Box',
      desc: 'Add typographic callouts and margin annotations',
      icon: Type,
      iconColor: 'text-cyan-300',
      module: 'pdf'
    },
    {
      id: 'pdf-stamp',
      name: 'Review Stamp',
      desc: 'Apply Approved / In Review / Draft governance seal',
      icon: Stamp,
      iconColor: 'text-emerald-400',
      module: 'pdf'
    },
    {
      id: 'pdf-crop',
      name: 'Region Crop & Zoom',
      desc: 'Magnify specific quadrant or section of document',
      icon: Crop,
      iconColor: 'text-slate-300',
      module: 'pdf'
    },

    // Research Grounding
    {
      id: 'res-query',
      name: 'Grounding Query Engine',
      desc: 'Query across all 3 indexed sources with page citations',
      icon: Search,
      iconColor: 'text-purple-400',
      module: 'research'
    },
    {
      id: 'res-extract',
      name: 'Extract Key Quotes',
      desc: 'Isolate bulleted findings and quantitative data points',
      icon: Sparkles,
      iconColor: 'text-purple-300',
      module: 'research'
    },
    {
      id: 'res-veritas-audit',
      name: 'Citation Veracity Audit',
      desc: 'Verify that every statement matches source text exactly',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      module: 'research'
    }
  ];

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesTab = activeTab === 'all' || tool.module === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleToolClick = (tool: ToolActionItem) => {
    // Switch module if different
    if (activeModule !== tool.module) {
      onSelectModule(tool.module);
    }
    if (onApplyToolAction) {
      onApplyToolAction(tool.module, tool.id, tool.name);
    }
    setAppliedNotice(`Activated "${tool.name}" in ${tool.module.toUpperCase()}`);
    setTimeout(() => setAppliedNotice(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.4)]">
              <Wrench className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  LeeWay Office Suites — Master Toolkit
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-700/60 text-cyan-300">
                  {TOOLS_LIST.length} Tools
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full-spectrum utilities for Documents, Spreadsheets, Presentations, Draw, PDF & Research
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Tools Palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search and Feedback Strip */}
        <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all tools, formulas, shortcuts, and markup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-slate-500"
            />
          </div>

          {appliedNotice && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{appliedNotice}</span>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-2 flex items-center gap-1.5 overflow-x-auto border-b border-slate-800/60 bg-slate-950/50">
          {TOOL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors cursor-pointer border-t border-x ${
                  isActive
                    ? 'bg-slate-900 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tools Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isCurrentModule = activeModule === tool.module;

            return (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="group flex flex-col justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all text-left cursor-pointer shadow-sm relative overflow-hidden"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:border-cyan-400/50 group-hover:bg-cyan-950/40 transition-colors shrink-0">
                    <Icon className={`w-4 h-4 ${tool.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {tool.name}
                      </h4>
                      {tool.shortcut && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-slate-400 shrink-0">
                          {tool.shortcut}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[10px]">
                  <span className="capitalize text-slate-400 font-mono">
                    {tool.module}
                  </span>
                  <span className="text-cyan-400 font-medium group-hover:underline flex items-center gap-1">
                    {isCurrentModule ? 'Activate' : `Switch to ${tool.module}`}
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </button>
            );
          })}

          {filteredTools.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <Search className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No tools match your search</p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or switch category tab.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Currently Active: <strong className="text-white capitalize">{activeModule}</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
