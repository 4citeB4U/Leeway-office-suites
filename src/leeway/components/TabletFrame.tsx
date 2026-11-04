/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.TABLETFRAME
 * WHAT: Tablet frame defining the application workspace surface.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/TabletFrame.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Screen Container
 * Clean, full-screen edge-to-edge viewport maximizing working area.
 */

import React from 'react';
import { AppWindow, LockKeyhole, Minus, Square, X } from 'lucide-react';

interface TabletFrameProps {
  children: React.ReactNode;
}

export const TabletFrame: React.FC<TabletFrameProps> = ({ children }) => {
  return (
    <div className="agpu-desktop relative w-screen h-screen overflow-hidden text-slate-800 flex flex-col select-none">
      <div className="agpu-window-bar flex h-9 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <div className="agpu-window-controls flex items-center gap-1.5" aria-label="Window controls">
            <span className="agpu-window-dot agpu-window-dot-close" />
            <span className="agpu-window-dot agpu-window-dot-minimize" />
            <span className="agpu-window-dot agpu-window-dot-maximize" />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wide text-slate-600">
            <AppWindow className="h-3.5 w-3.5 text-blue-600" />
            <span>AGPU Workstation</span>
            <span className="text-slate-300">/</span>
            <span>LeeWay Office Suites</span>
          </div>
        </div>
        <div className="hidden items-center gap-3 text-[10px] font-medium text-slate-500 sm:flex">
          <span className="flex items-center gap-1"><LockKeyhole className="h-3 w-3 text-emerald-600" />Private workspace</span>
          <span>Local-first</span>
          <div className="flex items-center gap-1 text-slate-400" aria-hidden="true">
            <Minus className="h-3 w-3" /><Square className="h-2.5 w-2.5" /><X className="h-3 w-3" />
          </div>
        </div>
      </div>
      <div className="agpu-window-content flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
};
