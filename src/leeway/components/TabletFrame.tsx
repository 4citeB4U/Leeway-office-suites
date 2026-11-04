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

interface TabletFrameProps {
  children: React.ReactNode;
}

export const TabletFrame: React.FC<TabletFrameProps> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col select-none">
      {children}
    </div>
  );
};
