/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.PRESENTATIONS
 * WHAT: Presentation authoring workspace with governed slide export.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/PresentationsModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Presentations Module (LibreOffice Impress Core Engine)
 * Fully interactive slide deck creation and editing with slide filmstrip,
 * layout switcher, inline text editing, speaker notes, live slide show,
 * and real C++ backend export to .odp (OpenDocument Presentation), .pptx, and .pdf.
 * Governed by LeeWay Standards Architecture (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useState, useEffect } from 'react';
import {
  Presentation,
  Plus,
  Play,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Download,
  FileCode,
  FileCheck,
  Cpu,
  ShieldCheck,
  Check,
  Maximize2,
  Minimize2,
  Layout,
  Palette,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export type SlideLayout = 'title' | 'bullets' | 'twoColumn' | 'metric' | 'quote';
export type SlideTheme = 'sovereign' | 'slate' | 'emerald' | 'purple';

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  secondaryBullets?: string[];
  metricValue?: string;
  metricLabel?: string;
  quoteAuthor?: string;
  notes: string;
  layout: SlideLayout;
}

const DEFAULT_SLIDES: SlideData[] = [
  {
    id: 'slide-1',
    title: 'LeeWay Office Suites Launch',
    subtitle: 'Create • Edit • Research • Analyze • Present',
    layout: 'title',
    bullets: [
      'Unification of LibreOffice Productivity & Open Notebook Grounding',
      'Autonomous Agent Tablet Form Factor with Sovereign Hardware Bezel',
      'Governed strictly by LeeWay Standards Architecture v2026.4',
      'Veritas Attestation & Real-Time Source Citations'
    ],
    notes: 'Introduce the core architectural thesis: blending local office suite fidelity with modern LLM research grounding.',
    metricValue: '100%',
    metricLabel: 'Sovereign Integrity'
  },
  {
    id: 'slide-2',
    title: 'The 92% Integration Milestone',
    subtitle: 'Velocity & Cross-Module Interlock',
    layout: 'metric',
    metricValue: '92%',
    metricLabel: 'Suite Modules Integrated & Verified',
    bullets: [
      'Core integration layer reached 92% completion on schedule',
      'Seamless bi-directional transfer between Writer, Calc, Impress, Draw, and PDF',
      'Knowledge repository expanded with 42 enterprise verified resources',
      'Tri-Tier Memory: Episodic, Semantic, Procedural'
    ],
    notes: 'Emphasize the on-track delivery validated in the Executive Summary of the Project Report.'
  },
  {
    id: 'slide-3',
    title: 'Workforce Onboarding & Adoption',
    subtitle: 'Phase 2 Pilot Telemetry',
    layout: 'bullets',
    bullets: [
      'Phase 2 enterprise pilot active across high-velocity teams',
      '88% user adoption achieved within first 14 days',
      '+34% documented acceleration in executive brief synthesis',
      'Source-grounded actions eliminate organizational hallucinations'
    ],
    notes: 'Reference the Workforce Brief source document and highlight user feedback.'
  },
  {
    id: 'slide-4',
    title: 'Sovereign Veritas Compliance',
    subtitle: 'Cryptographic Integrity via LeeWay Standards',
    layout: 'twoColumn',
    bullets: [
      'Every transform action produces an immutable Veritas hash receipt',
      'Strict adherence to FabricPASS identity & secret governance policies'
    ],
    secondaryBullets: [
      'Zero external unverified endpoints or fragile external CDNs',
      'Full local-first continuity with persistent institutional memory'
    ],
    notes: 'Reassure executive stakeholders regarding security, sovereignty, and enterprise governance compliance.'
  }
];

export const PresentationsModule: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>(DEFAULT_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [theme, setTheme] = useState<SlideTheme>('sovereign');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Fullscreen keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setActiveSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, slides.length]);

  // Update slide helper
  const updateCurrentSlide = (updates: Partial<SlideData>) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === activeSlideIndex ? { ...s, ...updates } : s))
    );
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      title: 'New Impress Slide',
      subtitle: 'Slide Subtitle or Key Takeaway',
      layout: 'bullets',
      bullets: ['Key point 1 grounded in sources', 'Operational telemetry insight'],
      notes: 'Presenter speaker notes for this slide.'
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
    setNotice('Added new slide');
    setTimeout(() => setNotice(null), 2000);
  };

  // Duplicate slide
  const handleDuplicateSlide = () => {
    const dup: SlideData = {
      ...currentSlide,
      id: `slide-${Date.now()}`,
      title: `${currentSlide.title} (Copy)`
    };
    const nextSlides = [...slides];
    nextSlides.splice(activeSlideIndex + 1, 0, dup);
    setSlides(nextSlides);
    setActiveSlideIndex(activeSlideIndex + 1);
  };

  // Delete slide
  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      alert('Presentation must contain at least one slide.');
      return;
    }
    const nextSlides = slides.filter((_, i) => i !== idx);
    setSlides(nextSlides);
    setActiveSlideIndex(Math.min(activeSlideIndex, nextSlides.length - 1));
  };

  // Move slide up / down
  const handleMoveSlide = (direction: 'up' | 'down') => {
    if (direction === 'up' && activeSlideIndex > 0) {
      const next = [...slides];
      const temp = next[activeSlideIndex];
      next[activeSlideIndex] = next[activeSlideIndex - 1];
      next[activeSlideIndex - 1] = temp;
      setSlides(next);
      setActiveSlideIndex(activeSlideIndex - 1);
    } else if (direction === 'down' && activeSlideIndex < slides.length - 1) {
      const next = [...slides];
      const temp = next[activeSlideIndex];
      next[activeSlideIndex] = next[activeSlideIndex + 1];
      next[activeSlideIndex + 1] = temp;
      setSlides(next);
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  // Add bullet to active slide
  const handleAddBullet = (isSecondary = false) => {
    if (isSecondary) {
      const existing = currentSlide.secondaryBullets || [];
      updateCurrentSlide({ secondaryBullets: [...existing, 'New comparison point'] });
    } else {
      updateCurrentSlide({ bullets: [...currentSlide.bullets, 'New bullet point'] });
    }
  };

  // Update bullet text
  const handleUpdateBullet = (index: number, text: string, isSecondary = false) => {
    if (isSecondary) {
      const next = [...(currentSlide.secondaryBullets || [])];
      next[index] = text;
      updateCurrentSlide({ secondaryBullets: next });
    } else {
      const next = [...currentSlide.bullets];
      next[index] = text;
      updateCurrentSlide({ bullets: next });
    }
  };

  // Delete bullet
  const handleDeleteBullet = (index: number, isSecondary = false) => {
    if (isSecondary) {
      const next = (currentSlide.secondaryBullets || []).filter((_, i) => i !== index);
      updateCurrentSlide({ secondaryBullets: next });
    } else {
      const next = currentSlide.bullets.filter((_, i) => i !== index);
      updateCurrentSlide({ bullets: next });
    }
  };

  // Real Export via LibreOffice Impress backend
  const handleExport = async (format: 'odp' | 'pptx' | 'pdf') => {
    setIsExporting(format);
    try {
      const res = await fetch('/api/libreoffice/impress/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: slides[0]?.title || 'Presentation',
          slides: slides.map((s) => ({
            title: s.title,
            subtitle: s.subtitle,
            bullets: s.layout === 'twoColumn' ? [...s.bullets, ...(s.secondaryBullets || [])] : s.bullets,
            notes: s.notes
          })),
          format
        })
      });

      const json = await res.json();
      if (!json.success || !json.data) throw new Error(json.error || 'Export failed');

      const byteCharacters = atob(json.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: json.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = json.filename;
      a.click();
      URL.revokeObjectURL(url);

      setNotice(`Exported ${json.filename} with Veritas Seal [${json.veritasReceipt?.hash || 'OK'}]`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Presentation export failed: ' + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  // Theme styling helpers
  const getThemeClasses = () => {
    switch (theme) {
      case 'slate':
        return 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700 text-slate-100 shadow-slate-900/50';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 border-emerald-500/40 text-slate-100 shadow-emerald-950/40';
      case 'purple':
        return 'bg-gradient-to-br from-purple-950/80 via-slate-950 to-slate-950 border-purple-500/40 text-slate-100 shadow-purple-950/40';
      case 'sovereign':
      default:
        return 'bg-gradient-to-br from-[#071324] via-slate-950 to-slate-950 border-cyan-500/40 text-slate-100 shadow-cyan-950/50';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/80 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-2xl relative">
      {/* 1. Header Ribbon: LibreOffice Impress Engine & Slide Controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-cyan-500/20 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                LeeWay Impress
              </h2>
              <span className="flex items-center gap-1 text-[9px] text-rose-400 font-mono bg-rose-950/90 px-1.5 py-0.5 rounded border border-rose-800/60">
                <Cpu className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
                LibreOffice Impress v7.4.7.2
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono">
              OASIS OpenDocument Presentation Engine • Real Slide Authoring
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Present / Slide Show Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
            title="Launch Fullscreen Slide Show"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Slide Show</span>
          </button>

          {/* Export to .ODP */}
          <button
            onClick={() => handleExport('odp')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/90 hover:bg-rose-900 border border-rose-500/60 text-xs font-semibold text-rose-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Export authentic LibreOffice Impress (.odp) presentation"
          >
            <FileCode className="w-3 h-3" />
            <span>{isExporting === 'odp' ? 'Exporting...' : 'Export .ODP'}</span>
          </button>

          {/* Export to .PPTX */}
          <button
            onClick={() => handleExport('pptx')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Export Microsoft PowerPoint (.pptx)"
          >
            <Download className="w-3 h-3" />
            <span>.PPTX</span>
          </button>

          {/* Export to .PDF */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Export Slide Handout PDF"
          >
            <span>.PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Slide Layout & Theme Ribbon */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/70 border-b border-slate-800 text-xs shrink-0 flex-wrap">
        {/* Layout Picker */}
        <div className="flex items-center gap-1">
          <Layout className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] text-slate-400">Layout:</span>
          <select
            value={currentSlide.layout}
            onChange={(e) => updateCurrentSlide({ layout: e.target.value as SlideLayout })}
            className="bg-slate-950 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-800 focus:border-cyan-400 outline-none cursor-pointer"
          >
            <option value="title">Title Slide</option>
            <option value="bullets">Title + Bullets</option>
            <option value="twoColumn">Two Column Compare</option>
            <option value="metric">Big KPI Metric</option>
            <option value="quote">Executive Quote</option>
          </select>
        </div>

        <div className="w-px h-3.5 bg-slate-800 mx-1" />

        {/* Theme Picker */}
        <div className="flex items-center gap-1">
          <Palette className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-[10px] text-slate-400">Theme:</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as SlideTheme)}
            className="bg-slate-950 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-800 focus:border-cyan-400 outline-none cursor-pointer"
          >
            <option value="sovereign">Sovereign Cyan</option>
            <option value="slate">Executive Graphite</option>
            <option value="emerald">Emerald Telemetry</option>
            <option value="purple">Insight Purple</option>
          </select>
        </div>

        {notice && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700/60 ml-auto animate-in fade-in">
            <Check className="w-3 h-3" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* 3. Main Workspace: Slide Filmstrip (Left) + Slide Editor Canvas (Center) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Slide Filmstrip */}
        <div className="w-44 sm:w-52 shrink-0 border-r border-slate-800/80 bg-slate-950/70 p-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar select-none">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Slides ({slides.length})
            </span>
            <button
              onClick={handleAddSlide}
              className="p-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 transition-colors cursor-pointer"
              title="Add New Slide"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Slide Thumbnails */}
          {slides.map((s, idx) => {
            const isActive = idx === activeSlideIndex;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`group relative p-2 rounded-lg border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-rose-500/70 shadow-[0_0_12px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/50'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono mb-1 text-slate-500">
                  <span>Slide {idx + 1}</span>
                  <span className="capitalize">{s.layout}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white">
                  {s.title || 'Untitled'}
                </h4>
                <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                  {s.subtitle || (s.bullets[0] ? s.bullets[0] : 'Empty slide')}
                </p>

                {/* Thumbnail Action Buttons */}
                {isActive && (
                  <div className="flex items-center justify-end gap-1 mt-2 pt-1 border-t border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide('up');
                      }}
                      disabled={idx === 0}
                      className="p-0.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      title="Move slide up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide('down');
                      }}
                      disabled={idx === slides.length - 1}
                      className="p-0.5 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      title="Move slide down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateSlide();
                      }}
                      className="p-0.5 rounded hover:bg-slate-800 text-slate-400"
                      title="Duplicate slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="p-0.5 rounded hover:bg-red-950 text-slate-400 hover:text-red-300"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Center: Slide Editor Canvas */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#060a12] p-4 sm:p-6 overflow-y-auto custom-scrollbar select-text">
          {/* 16:9 Aspect Ratio Slide Canvas */}
          <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
            <div
              className={`w-full aspect-[16/9] rounded-2xl border p-6 sm:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all ${getThemeClasses()}`}
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Slide Header: Editable Title & Subtitle */}
              <div className="relative z-10">
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                  placeholder="Enter slide title..."
                  className="w-full text-xl sm:text-2xl md:text-3xl font-extrabold text-white bg-transparent border-b border-transparent hover:border-slate-700/60 focus:border-cyan-400 outline-none transition-colors"
                />
                <input
                  type="text"
                  value={currentSlide.subtitle}
                  onChange={(e) => updateCurrentSlide({ subtitle: e.target.value })}
                  placeholder="Enter slide subtitle or core thesis..."
                  className="w-full text-xs sm:text-sm text-cyan-300 font-medium bg-transparent border-b border-transparent hover:border-slate-700/60 focus:border-cyan-400 outline-none mt-1 transition-colors"
                />
              </div>

              {/* Slide Body: Driven by Layout */}
              <div className="my-auto relative z-10 py-3">
                {/* 1. Metric Layout */}
                {currentSlide.layout === 'metric' && (
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 min-w-[200px]">
                      <input
                        type="text"
                        value={currentSlide.metricValue || '92%'}
                        onChange={(e) => updateCurrentSlide({ metricValue: e.target.value })}
                        className="text-4xl sm:text-5xl font-black text-cyan-400 bg-transparent text-center outline-none w-full"
                      />
                      <input
                        type="text"
                        value={currentSlide.metricLabel || 'Milestone Velocity'}
                        onChange={(e) => updateCurrentSlide({ metricLabel: e.target.value })}
                        className="text-xs font-mono text-slate-400 bg-transparent text-center outline-none w-full mt-1"
                      />
                    </div>

                    <div className="flex-1 flex flex-col gap-2 w-full">
                      {currentSlide.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => handleUpdateBullet(bIdx, e.target.value)}
                            className="flex-1 text-xs sm:text-sm text-slate-200 bg-transparent hover:bg-slate-900/40 px-1 py-0.5 rounded outline-none border border-transparent focus:border-slate-700"
                          />
                          <button
                            onClick={() => handleDeleteBullet(bIdx)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-red-400 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddBullet()}
                        className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 mt-1 cursor-pointer w-fit"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add bullet</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Two-Column Layout */}
                {currentSlide.layout === 'twoColumn' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                        Column A
                      </span>
                      {currentSlide.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => handleUpdateBullet(bIdx, e.target.value)}
                            className="flex-1 text-xs text-slate-200 bg-transparent outline-none"
                          />
                          <button
                            onClick={() => handleDeleteBullet(bIdx)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddBullet(false)}
                        className="flex items-center gap-1 text-[10px] text-cyan-400 w-fit cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" /> Add
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                        Column B
                      </span>
                      {(currentSlide.secondaryBullets || []).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => handleUpdateBullet(bIdx, e.target.value, true)}
                            className="flex-1 text-xs text-slate-200 bg-transparent outline-none"
                          />
                          <button
                            onClick={() => handleDeleteBullet(bIdx, true)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddBullet(true)}
                        className="flex items-center gap-1 text-[10px] text-rose-400 w-fit cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" /> Add
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. Standard Bullets Layout */}
                {(currentSlide.layout === 'bullets' || currentSlide.layout === 'title') && (
                  <div className="flex flex-col gap-2.5">
                    {currentSlide.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2.5 group">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => handleUpdateBullet(bIdx, e.target.value)}
                          placeholder="Type bullet point..."
                          className="flex-1 text-xs sm:text-sm text-slate-200 bg-transparent hover:bg-slate-900/30 px-1 py-0.5 rounded outline-none border border-transparent focus:border-slate-700"
                        />
                        <button
                          onClick={() => handleDeleteBullet(bIdx)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-500 hover:text-red-400 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddBullet()}
                      className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium mt-1 cursor-pointer w-fit"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet Point</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Slide Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/80 pt-2 select-none relative z-10">
                <span>LeeWay Agent Tablet · Sovereign Impress</span>
                <span>Slide {activeSlideIndex + 1} of {slides.length}</span>
              </div>
            </div>

            {/* Presenter Speaker Notes Area (Under Canvas) */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5 select-none">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Presenter Notes (Slide {activeSlideIndex + 1})</span>
              </div>
              <textarea
                value={currentSlide.notes}
                onChange={(e) => updateCurrentSlide({ notes: e.target.value })}
                placeholder="Enter speaker notes and presentation cues here..."
                rows={2}
                className="w-full bg-slate-900/70 text-slate-200 text-xs p-2 rounded-lg border border-slate-800 focus:border-cyan-400 outline-none resize-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fullscreen Slide Show Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 sm:p-14 select-none">
          {/* Fullscreen Controls Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-white font-bold">SLIDE SHOW ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{activeSlideIndex + 1} / {slides.length}</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs cursor-pointer"
              >
                Exit (Esc)
              </button>
            </div>
          </div>

          {/* Large Presentation Slide */}
          <div className="max-w-5xl mx-auto w-full my-auto flex flex-col gap-6">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="text-lg sm:text-xl text-cyan-300 font-medium">
                {currentSlide.subtitle}
              </p>
            )}

            {currentSlide.layout === 'metric' && (
              <div className="my-6">
                <span className="text-7xl font-black text-cyan-400">
                  {currentSlide.metricValue || '92%'}
                </span>
                <p className="text-sm font-mono text-slate-400 mt-2">
                  {currentSlide.metricLabel}
                </p>
              </div>
            )}

            <ul className="flex flex-col gap-4 text-base sm:text-xl text-slate-200 mt-4">
              {currentSlide.bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fullscreen Bottom Navigation Bar */}
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Use Left/Right arrows or Spacebar to advance</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.max(prev - 1, 0))}
                disabled={activeSlideIndex === 0}
                className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                disabled={activeSlideIndex === slides.length - 1}
                className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
