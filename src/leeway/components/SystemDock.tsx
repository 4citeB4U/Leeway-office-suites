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
    <footer className="flex items-center justify-center gap-2 py-1 px-3 bg-slate-950 border-t border-cyan-500/20 backdrop-blur-xl select-none z-20 shrink-0">
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
        {/* Home */}
        <button
          onClick={() => onSelectDockTab('home')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'home'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Monitor className="w-3 h-3 text-slate-300" />
          <span>Blackboard</span>
        </button>

        {/* LeeWay Office (Active Pill in Screenshot) */}
        <button
          onClick={() => onSelectDockTab('office')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wide text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 border border-cyan-300/60 shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer whitespace-nowrap"
        >
          <div className="flex items-center justify-center w-3.5 h-3.5 rounded bg-white/20">
            <FileText className="w-2.5 h-2.5 text-white" />
          </div>
          <span>LeeWay Office</span>
        </button>

        {/* Continuum */}
        <button
          onClick={onOpenContinuum}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-all cursor-pointer whitespace-nowrap"
        >
          <InfinityIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Continuum</span>
        </button>

        {/* Diagnostics */}
        <button
          onClick={onOpenDiagnostics}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-all cursor-pointer whitespace-nowrap"
        >
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Diagnostics</span>
        </button>

        {/* Preview */}
        <button
          onClick={() => onSelectDockTab('preview')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeDockTab === 'preview'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
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
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LayoutGrid className="w-3 h-3 text-slate-300" />
          <span>Apps</span>
        </button>
      </div>
    </footer>
  );
};
