/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.PDFANNOTATION
 * WHAT: PDF annotation workspace with source-grounded actions.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/PDFAnnotationModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * PDF & Annotation Module
 * High-definition, crystal-clear interactive document viewer.
 * Matching the exact reference layout:
 * - Tab bar: "LeeWay Project Report.pdf" + "+"
 * - Comprehensive PDF toolbar (Pointer, Hand, Highlighter, Pen, Sticky Note, Text Box, Crop, Zoom Controls, Fit Screen, Fullscreen)
 * - Subbar: Page Nav ("< 1 of 12 >"), Review Status, Share
 * - The crisp, highly legible LeeWay Project Report document page
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  X,
  MousePointer,
  Hand,
  Highlighter,
  PenTool,
  MessageSquare,
  Type,
  Crop,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileCheck,
  Share2,
  CheckCircle,
  Maximize2,
  Trash2
} from 'lucide-react';
import { AnnotationItem } from '../types';

export type ActiveAnnotationTool = 'select' | 'pan' | 'highlight' | 'pen' | 'note' | 'text' | 'crop';

interface PDFAnnotationModuleProps {
  onSendToBrief?: (content: string) => void;
  onOpenGroundedAsk?: () => void;
  activeTool?: ActiveAnnotationTool;
  onSelectTool?: (tool: ActiveAnnotationTool) => void;
  zoomLevel?: number;
  highlightColor?: string;
  penColor?: string;
}

export const PDFAnnotationModule: React.FC<PDFAnnotationModuleProps> = ({
  onSendToBrief,
  onOpenGroundedAsk,
  activeTool = 'select',
  onSelectTool,
  zoomLevel = 100,
  highlightColor = '#fef08a',
  penColor = '#22d3ee'
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 12;
  const [showReviewMenu, setShowReviewMenu] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'In Review' | 'Approved' | 'Draft'>('In Review');
  const [isShareSuccess, setIsShareSuccess] = useState(false);

  // Active Document Tabs
  const [tabs, setTabs] = useState([
    { id: 'tab-1', title: 'LeeWay Project Report.pdf', active: true },
  ]);

  // Dynamic user sticky notes
  const [customNotes, setCustomNotes] = useState<AnnotationItem[]>([]);
  const [activeNoteEditId, setActiveNoteEditId] = useState<string | null>(null);

  // Core Pinned Note state
  const [pinnedNoteText, setPinnedNoteText] = useState('Highlight key milestones in the final brief.');
  const [isEditingPinnedNote, setIsEditingPinnedNote] = useState(false);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'note') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newNote: AnnotationItem = {
        id: 'note-' + Date.now(),
        type: 'note',
        x: Math.min(Math.max(x - 40, 20), rect.width - 180),
        y: Math.min(Math.max(y - 20, 20), rect.height - 120),
        color: '#fef08a',
        text: 'New annotation item for workforce review.',
        page: currentPage,
        author: 'User',
        createdAt: 'Just now'
      };

      setCustomNotes((prev) => [...prev, newNote]);
      setActiveNoteEditId(newNote.id);
      if (onSelectTool) onSelectTool('select');
    }
  };

  const updateCustomNote = (id: string, text: string) => {
    setCustomNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const deleteCustomNote = (id: string) => {
    setCustomNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleShare = () => {
    setIsShareSuccess(true);
    setTimeout(() => setIsShareSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/70 overflow-hidden select-none border border-cyan-500/20 rounded-xl shadow-2xl">
      {/* 1. Document Tab Bar */}
      <div className="flex items-center justify-between px-3 pt-1.5 bg-slate-950/90 border-b border-cyan-500/20 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-t-lg text-xs font-semibold tracking-wide border-t border-x transition-colors cursor-pointer ${
                tab.active
                  ? 'bg-gradient-to-b from-slate-900 to-slate-900/90 text-cyan-300 border-cyan-500/40 shadow-[0_-2px_8px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-950/60 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>{tab.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tabs.length > 1) {
                    setTabs(tabs.filter((t) => t.id !== tab.id));
                  }
                }}
                className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Close Tab"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Tab Button */}
          <button
            onClick={() => {
              const newTabId = 'tab-' + (tabs.length + 1);
              setTabs([
                ...tabs,
                { id: newTabId, title: 'Integration Plan.docx', active: false }
              ]);
            }}
            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            title="Open Document"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Document Controls Sub-Bar (Page Navigation, Review Status, Share) */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800/80 text-slate-300 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Page Nav */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 font-mono text-[11px] bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700 text-slate-200">
              <span>{currentPage}</span>
              <span className="text-slate-400">of</span>
              <span>{totalPages}</span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700/80 mx-0.5"></div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Document Preview • 12 Pages</span>
          </div>
        </div>

        {/* Right Tools: Review Status Dropdown & Share */}
        <div className="flex items-center gap-2">
          {/* Review Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowReviewMenu(!showReviewMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{reviewStatus}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showReviewMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-30">
                {(['In Review', 'Approved', 'Draft'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setReviewStatus(st);
                      setShowReviewMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-slate-800 cursor-pointer"
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-medium cursor-pointer transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isShareSuccess ? 'Shared!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Document Canvas Viewport */}
      <div
        className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start bg-[#0a0f1d]"
        style={{ cursor: activeTool === 'note' ? 'crosshair' : activeTool === 'pan' ? 'grab' : 'default' }}
      >
        <div
          onClick={handlePageClick}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
          className="relative w-full max-w-[760px] bg-white text-slate-900 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-8 sm:p-10 transition-transform duration-100 ease-out flex flex-col justify-between shrink-0 my-2 select-text"
        >
          {/* Document Header */}
          <div>
            <div className="flex items-center justify-between pb-3">
              {/* Circular LW LeeWay Logo */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#004e92] text-white font-extrabold text-sm tracking-tight shadow-md">
                  LW
                </div>
                <span className="text-2xl font-black tracking-tight text-[#002f6c]">
                  LeeWay
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 font-mono">
                Jan 27, 2025
              </span>
            </div>

            {/* Document Title & Subtitle */}
            <div className="pt-2 pb-5 border-b border-slate-200 relative">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 leading-tight">
                LeeWay Project Report
              </h1>
              <p className="text-base font-semibold text-slate-600 mt-1">
                Integration & Workforce Update
              </p>

              {/* Decorative Blue Ribbon In Top Right */}
              <div className="pointer-events-none absolute -top-4 right-0 w-64 h-28 opacity-35 overflow-hidden">
                <svg viewBox="0 0 200 100" fill="none" className="w-full h-full">
                  <path
                    d="M0,45 Q60,10 120,55 T200,30 L200,0 L0,0 Z"
                    fill="url(#reportBlueGradHD)"
                  />
                  <defs>
                    <linearGradient id="reportBlueGradHD" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* SECTION 1: Executive Summary */}
            <div className="mt-6 flex flex-col md:flex-row items-start justify-between gap-5">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  1. Executive Summary
                </h2>
                <p className="text-sm text-slate-800 mt-2 leading-relaxed">
                  The integration project continues to make strong progress, with{' '}
                  <mark className="bg-yellow-200/95 text-slate-950 px-1.5 py-0.5 rounded font-semibold shadow-sm">
                    key milestones on track
                  </mark>{' '}
                  for the next phase of deployment. This report summarizes progress,
                  outcomes, and recommendations.
                </p>
              </div>

              {/* Pinned Note Card (Anchored cleanly to the right, exactly matching screenshot) */}
              <div className="w-full md:w-56 p-3 rounded-lg shadow-md border border-amber-300 bg-amber-100/95 text-slate-900 text-xs shrink-0 transition-transform hover:scale-[1.02]">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-amber-300">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    Note
                  </span>
                  <span className="text-amber-700 font-bold tracking-widest text-sm">···</span>
                </div>
                {isEditingPinnedNote ? (
                  <textarea
                    autoFocus
                    value={pinnedNoteText}
                    onChange={(e) => setPinnedNoteText(e.target.value)}
                    onBlur={() => setIsEditingPinnedNote(false)}
                    className="w-full bg-white/80 p-1.5 rounded text-xs text-slate-900 outline-none border border-amber-300 resize-none h-16 font-sans leading-snug"
                  />
                ) : (
                  <p
                    onClick={() => setIsEditingPinnedNote(true)}
                    className="cursor-text leading-snug font-medium text-slate-850 hover:text-black text-xs"
                    title="Click to edit note"
                  >
                    {pinnedNoteText}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 2: Project Progress */}
            <div className="mt-7">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                2. Project Progress
              </h2>
              <ul className="mt-3 space-y-3 text-sm text-slate-800">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0"></span>
                  <span className="font-medium">
                    Integration layer: <strong className="text-slate-950 font-bold">92% complete</strong>
                  </span>
                </li>

                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0"></span>
                  <span>
                    <mark className="bg-emerald-200/90 text-emerald-950 px-2 py-0.5 rounded font-bold">
                      Workforce onboarding:
                    </mark>{' '}
                    In progress (Phase 2)
                  </span>
                </li>

                <li className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0"></span>
                  <span className="font-medium">Knowledge base: Expanded with</span>
                  {/* Circled 42 */}
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-emerald-600 text-emerald-700 font-extrabold text-sm bg-emerald-50 shadow-sm">
                    42
                  </span>
                  <span className="font-medium">new resources</span>

                  {/* Green Hand-drawn Arrow & "Update with latest count?" Annotation */}
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 ml-2">
                    <svg className="w-10 h-5 transform rotate-6" viewBox="0 0 50 25" fill="none">
                      <path d="M5 18 C 18 10, 32 8, 44 6" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M36 2 L 46 6 L 38 12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-bold italic font-serif text-emerald-600 whitespace-nowrap">
                      Update with latest count?
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* SECTION 3: Key Outcomes */}
            <div className="mt-8 flex items-end justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  3. Key Outcomes
                </h2>
                <div className="mt-3 space-y-2 text-sm text-slate-800">
                  <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                    <span className="text-emerald-600 font-bold text-lg leading-none">✔</span>
                    <span>Improved team productivity</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                    <span className="text-emerald-600 font-bold text-lg leading-none">✔</span>
                    <span>Expanded knowledge coverage</span>
                  </div>
                </div>
              </div>

              {/* Mini Blue Upward Trend Bar Chart */}
              <div className="w-40 h-24 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-end shrink-0 shadow-sm">
                <div className="flex items-end justify-between h-14 gap-1.5 px-1.5">
                  <div className="w-4 bg-sky-300 rounded-t h-[35%] transition-all"></div>
                  <div className="w-4 bg-sky-400 rounded-t h-[50%] transition-all"></div>
                  <div className="w-4 bg-blue-500 rounded-t h-[70%] transition-all"></div>
                  <div className="w-4 bg-blue-600 rounded-t h-[95%] transition-all"></div>
                </div>
                <div className="text-[10px] text-center text-slate-500 font-mono font-medium mt-1">
                  Velocity Trend (Q1)
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC USER STICKY NOTES */}
          {customNotes
            .filter((n) => n.page === currentPage)
            .map((note) => (
              <div
                key={note.id}
                style={{
                  position: 'absolute',
                  left: `${note.x}px`,
                  top: `${note.y}px`
                }}
                className="w-52 p-3 rounded-lg shadow-xl border border-yellow-300 bg-amber-100 text-slate-900 text-xs z-20"
              >
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-300">
                  <span className="font-bold text-amber-900 text-[11px]">Note</span>
                  <button
                    onClick={() => deleteCustomNote(note.id)}
                    className="text-amber-800 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {activeNoteEditId === note.id ? (
                  <textarea
                    autoFocus
                    value={note.text}
                    onChange={(e) => updateCustomNote(note.id, e.target.value)}
                    onBlur={() => setActiveNoteEditId(null)}
                    className="w-full bg-white/80 p-1.5 rounded text-xs text-slate-900 outline-none border border-amber-300 resize-none h-14"
                  />
                ) : (
                  <p
                    onClick={() => setActiveNoteEditId(note.id)}
                    className="cursor-text leading-snug font-medium text-slate-800 text-[11px]"
                  >
                    {note.text}
                  </p>
                )}
              </div>
            ))}

          {/* Footer of the Paper */}
          <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>LeeWay Standards Compliant (ID: LW-RPT-0128)</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
