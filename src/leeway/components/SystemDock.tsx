/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.DOCK
 * WHAT: Bottom system dock for suite navigation and diagnostics.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/SystemDock.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * System Dock - Tablet OS Navigation Bar
 * Matches the bottom system dock from the tablet image:
 * Home, Workforce, Blackboard, LeeWay Office, Continuum, Diagnostics, Preview, Apps
 */

import React from 'react';
import {
  Home,
  Users,
  Monitor,
  FileText,
  Infinity as InfinityIcon,
  Activity,
  PlaySquare,
  LayoutGrid
} from 'lucide-react';
import { SystemDockId } from '../types';

interface SystemDockProps {
  activeDockTab: SystemDockId;
  onSelectDockTab: (tab: SystemDockId) => void;
  onOpenContinuum: () => void;
  onOpenDiagnostics: () => void;
}

export const SystemDock: React.FC<SystemDockProps> = ({
  activeDockTab,
  onSelectDockTab,
  onOpenContinuum,
  onOpenDiagnostics
}) => {
  return (
    <footer className="agpu-system-dock flex items-center justify-center gap-2 py-2 px-4 border-t select-none z-20 shrink-0">
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
        {/* Home */}
        <button
          onClick={() => onSelectDockTab('home')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'home'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Home className="w-3 h-3 text-slate-300" />
          <span>Home</span>
        </button>

        {/* Workforce */}
        <button
          onClick={() => onSelectDockTab('workforce')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'workforce'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3 h-3 text-slate-300" />
          <span>Workforce</span>
        </button>

        {/* Blackboard */}
        <button
          onClick={() => onSelectDockTab('blackboard')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'blackboard'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Monitor className="w-3 h-3 text-slate-300" />
          <span>Blackboard</span>
        </button>

        {/* LeeWay Office (Active Pill in Screenshot) */}
        <button
          onClick={() => onSelectDockTab('office')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wide text-white bg-blue-700 border border-blue-700 shadow-sm cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center justify-center w-3.5 h-3.5 rounded bg-white/20">
            <FileText className="w-2.5 h-2.5 text-white" />
          </div>
          <span>LeeWay Office</span>
        </button>

        {/* Continuum */}
        <button
          onClick={onOpenContinuum}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
        >
          <InfinityIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Continuum</span>
        </button>

        {/* Diagnostics */}
        <button
          onClick={onOpenDiagnostics}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
        >
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Diagnostics</span>
        </button>

        {/* Preview */}
        <button
          onClick={() => onSelectDockTab('preview')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'preview'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlaySquare className="w-3 h-3 text-slate-300" />
          <span>Preview</span>
        </button>

        {/* Apps */}
        <button
          onClick={() => onSelectDockTab('apps')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'apps'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutGrid className="w-3 h-3 text-slate-300" />
          <span>Apps</span>
        </button>
      </div>
    </footer>
  );
};
