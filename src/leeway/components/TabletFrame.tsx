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
