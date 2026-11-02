/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LeeWay Office Suites Header Banner
 * Unifies the brand header with the top-level tool section at the far right.
 * Exactly as requested:
 * - Brand: LeeWay Office Suites (Create • Edit • Research • Analyze • Present)
 * - Far Right: Moved tool section (Pointer, Hand, Highlighter, Pen, Sticky Note, Text, Crop, Zoom -/+)
 * - Dedicated "Tools" button opening the master multi-module toolkit for all parts of the suite.
 */

import React, { useState } from 'react';
import {
  FileText,
  MousePointer,
  Hand,
  Highlighter,
  PenTool,
  MessageSquare,
  Type,
  Crop,
  ZoomIn,
  ZoomOut,
  Wrench,
  ChevronDown
} from 'lucide-react';

export type ActiveToolType = 'select' | 'pan' | 'highlight' | 'pen' | 'note' | 'text' | 'crop';

interface OfficeSuitesBannerProps {
  activeModuleTitle?: string;
  activeTool?: ActiveToolType;
  onSelectTool?: (tool: ActiveToolType) => void;
  zoomLevel?: number;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onZoomFit?: () => void;
  onOpenMasterTools?: () => void;
  highlightColor?: string;
  onSelectHighlightColor?: (c: string) => void;
  penColor?: string;
  onSelectPenColor?: (c: string) => void;
}

export const OfficeSuitesBanner: React.FC<OfficeSuitesBannerProps> = ({
  activeTool = 'select',
  onSelectTool = () => {},
  zoomLevel = 100,
  onZoomIn = () => {},
  onZoomOut = () => {},
  onZoomReset = () => {},
  onZoomFit = () => {},
  onOpenMasterTools = () => {},
  highlightColor = '#fef08a',
  onSelectHighlightColor,
  penColor = '#22d3ee',
  onSelectPenColor
}) => {
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showPenMenu, setShowPenMenu] = useState(false);

  const HIGHLIGHT_COLORS = [
    { name: 'Yellow', hex: '#fef08a' },
    { name: 'Green', hex: '#86efac' },
    { name: 'Cyan', hex: '#67e8f9' },
    { name: 'Pink', hex: '#f472b6' }
  ];

  const PEN_COLORS = [
    { name: 'Cyan', hex: '#22d3ee' },
    { name: 'Green', hex: '#4ade80' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Orange', hex: '#fb923c' }
  ];

  return (
    <div className="relative overflow-visible rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-3 py-1.5 shadow-[0_2px_12px_rgba(6,182,212,0.12)] shrink-0 z-30">
      {/* Background Futuristic Cyan Energy Wave Graphic */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-2/3"
          viewBox="0 0 600 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 C 150 8, 300 52, 450 22 C 520 8, 580 38, 600 30"
            stroke="url(#cyanGlowGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="cyanGlowGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0" />
              <stop offset="40%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="80%" stopColor="#67e8f9" stopOpacity="1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Banner Bar: Brand on Left, Tool Section on Far Right */}
      <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.4)] shrink-0">
            <FileText className="w-4 h-4 text-cyan-300" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white drop-shadow-sm whitespace-nowrap">
              LeeWay <span className="text-cyan-400">Office Suites</span>
            </h1>
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-slate-300">
              <span>Create</span>
              <span className="text-cyan-400/60">•</span>
              <span>Edit</span>
              <span className="text-cyan-400/60">•</span>
              <span>Research</span>
              <span className="text-cyan-400/60">•</span>
              <span>Analyze</span>
              <span className="text-cyan-400/60">•</span>
              <span>Present</span>
            </div>
          </div>
        </div>

        {/* Right: The Moved Tool Section (Pointer, Hand, Highlighter, Pen, Sticky Note, Text, Crop, Zoom, Tools Button) */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto overflow-x-auto py-0.5">
          {/* Active Toolstrip */}
          <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/90 shadow-inner">
            {/* 1. Pointer / Selection Tool */}
            <button
              onClick={() => onSelectTool('select')}
              title="Selection Pointer (V)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                activeTool === 'select'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>

            {/* 2. Hand Pan Tool */}
            <button
              onClick={() => onSelectTool('pan')}
              title="Pan Hand Tool (H)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                activeTool === 'pan'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
            </button>

            {/* 3. Highlighter with Color Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  onSelectTool('highlight');
                  setShowHighlightMenu(!showHighlightMenu);
                }}
                title="Highlighter (Shift+H)"
                className={`flex items-center gap-0.5 p-1.5 rounded-md transition-all cursor-pointer ${
                  activeTool === 'highlight'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/70 shadow-[0_0_8px_rgba(250,204,21,0.3)]'
                    : 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800/70'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>

              {showHighlightMenu && (
                <div className="absolute left-0 top-full mt-1.5 p-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex gap-1 z-50">
                  {HIGHLIGHT_COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        if (onSelectHighlightColor) onSelectHighlightColor(col.hex);
                        onSelectTool('highlight');
                        setShowHighlightMenu(false);
                      }}
                      className="w-4 h-4 rounded-full border border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: col.hex }}
                      title={`${col.name} Highlighter`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 4. Pen / Stylus with Color Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  onSelectTool('pen');
                  setShowPenMenu(!showPenMenu);
                }}
                title="Stylus / Pen (P)"
                className={`flex items-center gap-0.5 p-1.5 rounded-md transition-all cursor-pointer ${
                  activeTool === 'pen'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                    : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/70'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <ChevronDown className="w-2.5 h-2.5 opacity-70" />
              </button>

              {showPenMenu && (
                <div className="absolute left-0 top-full mt-1.5 p-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex gap-1 z-50">
                  {PEN_COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        if (onSelectPenColor) onSelectPenColor(col.hex);
                        onSelectTool('pen');
                        setShowPenMenu(false);
                      }}
                      className="w-4 h-4 rounded-full border border-slate-600 hover:scale-110 transition-transform cursor-pointer"
                      style={{ backgroundColor: col.hex }}
                      title={`${col.name} Pen`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 5. Sticky Note Annotation */}
            <button
              onClick={() => onSelectTool('note')}
              title="Sticky Note Comment (N)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                activeTool === 'note'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/70 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/70'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            {/* 6. Text Box */}
            <button
              onClick={() => onSelectTool('text')}
              title="Insert Text Box (T)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                activeTool === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                  : 'text-cyan-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
            </button>

            {/* 7. Crop / Area Select */}
            <button
              onClick={() => onSelectTool('crop')}
              title="Crop / Region Select (C)"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                activeTool === 'crop'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
            </button>

            {/* Subtle Divider */}
            <div className="h-4 w-px bg-slate-700/80 mx-0.5" />

            {/* 8. Zoom Controls (- / + / 100% / Fit) */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={onZoomOut}
                title="Zoom Out (-)"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onZoomReset}
                title="Reset Zoom to 100%"
                className="px-1.5 py-0.5 text-[10px] font-mono text-slate-200 hover:text-cyan-300 cursor-pointer"
              >
                {zoomLevel}%
              </button>

              <button
                onClick={onZoomIn}
                title="Zoom In (+)"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onZoomFit}
                title="Fit to Window"
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700/60 cursor-pointer ml-0.5"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Master "Tools" Button: Fulfills all parts of the presentation, spreadsheets, documents, drawing, research */}
          <button
            onClick={onOpenMasterTools}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950 via-blue-950 to-cyan-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-400/60 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] cursor-pointer shrink-0"
            title="Open Complete Suite Tools Palette"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-300" />
            <span className="tracking-wide">Tools</span>
          </button>
        </div>
      </div>
    </div>
  );
};
