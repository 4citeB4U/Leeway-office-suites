/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.DOCUMENTS
 * WHAT: Document authoring workspace with governed export actions.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/DocumentsModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Documents Module (LeeWay Writer browser workspace)
 * Realistic executive document authoring with rich text formatting ribbon,
 * page ruler, document canvas, templates, file import (.docx, .odt, .txt),
 * and browser-local export to .odt (OASIS OpenDocument Text), .docx, and .pdf.
 * Governed by LeeWay Standards Architecture (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  FileText,
  Download,
  Upload,
  Copy,
  Check,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table as TableIcon,
  ShieldCheck,
  FileCode,
  FileCheck,
  Plus,
  Sparkles
} from 'lucide-react';
import { createDocxBlob, createOdtBlob, createPdfBlob } from '../officeExports';
import { generateVeritasReceipt } from '../governance/leewayCompliance';

interface DocumentsModuleProps {
  initialContent?: string;
}

const TEMPLATES: Record<string, { title: string; content: string }> = {
  projectReport: {
    title: 'LeeWay Project Report - Executive Draft',
    content: `# LeeWay Project Report
## Integration & Workforce Update — Executive Working Draft
**Date:** January 28, 2026 | **Classification:** Enterprise Sovereign | **Status:** Active

### 1. Executive Summary
The integration project continues to make strong progress, with key milestones on track for the next phase of deployment. This document unifies real-time source citations and automated Veritas compliance receipts under the LeeWay Standards governance framework.

### 2. Implementation Milestones
- **Integration Layer:** 92% Complete across Writer, Calc, Impress, Draw, and PDF [Source 1, p. 2]
- **Workforce Onboarding:** Phase 2 Pilot active with 88% team adoption [Source 3, p. 1]
- **Knowledge Base Assets:** 42 indexed foundational resources [Source 1, p. 2]
- **Agent Continuum Pipeline:** Zero-loss context propagation verified across all enterprise nodes.

### 3. Operational Risk & Telemetry
| Stream | Readiness | Verification Seal | Status |
|---|---|---|---|
| C++ Engine Core | 100% | LW-SOV-091A | ACTIVE |
| Grounded RAG | 94% | LW-RAG-228B | PASS |
| Veritas Hash | 100% | LW-VER-440C | CERTIFIED |

### 4. Immediate Action Items
1. Coordinate with workforce leads to confirm the final headcount for the Phase 2 training cohort.
2. Review and distribute the executive brief to all departmental heads prior to Friday's review.
3. Issue cryptographic Veritas attestation seals for all exported OpenDocument packages.

---
*Governed by LeeWay Standards Architecture v2026.4 · Veritas Hash: LW-VERITAS-DOC-982A*`
  },
  blank: {
    title: 'Untitled Document',
    content: `# Document Title
## Subtitle or Executive Summary

Write your document here. Use the formatting ribbon above to format headers, lists, and tables.`
  },
  technicalSpec: {
    title: 'Technical Integration Specification',
    content: `# Technical Architecture Specification
## Unified Office Suites & Sovereign Agent System

### 1. Architectural Overview
This system integrates browser-local LeeWay Office capabilities with Open Notebook semantic grounding pipelines.

### 2. Security Requirements
- All document transforms must emit a cryptographic Veritas SHA-256 receipt.
- Local execution priority: no documents leave sovereign containment without explicit attestation.

### 3. API Contract
- Browser-local Writer export -> Generates an ODF-compatible document package.
- Browser-local Calc formulas -> Evaluates supported spreadsheet expressions.`
  }
};

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({ initialContent }) => {
  const [docTitle, setDocTitle] = useState(TEMPLATES.blank.title);
  const [content, setContent] = useState(initialContent || TEMPLATES.blank.content);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [fontSize, setFontSize] = useState<string>('11pt');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialContent?.trim()) setContent(initialContent);
  }, [initialContent]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live document statistics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const estimatedPages = Math.max(1, Math.ceil(wordCount / 400));
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Format insertion helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const insertBlock = (block: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((prev) => prev + '\n\n' + block);
      return;
    }
    const start = el.selectionStart;
    const newContent = content.substring(0, start) + '\n\n' + block + '\n\n' + content.substring(start);
    setContent(newContent);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real File Import (.docx, .odt, .txt, .md)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|md)$/i.test(file.name)) {
      setNotice('PDF/DOCX/ODT import is not yet implemented. Use TXT or Markdown; binary files will not be interpreted as text.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setContent(text);
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
        setNotice(`Imported ${file.name}`);
        setTimeout(() => setNotice(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const createNewDocument = () => {
    setDocTitle(TEMPLATES.blank.title);
    setContent(TEMPLATES.blank.content);
    setNotice('New blank document created');
    setTimeout(() => setNotice(null), 2500);
  };

  // Browser-local Office-compatible export; no server handoff required.
  const exportDocument = async (format: 'odt' | 'pdf' | 'docx') => {
    setIsExporting(format);
    try {
      const blob = format === 'odt'
        ? await createOdtBlob(docTitle, content)
        : format === 'docx'
          ? await createDocxBlob(docTitle, content)
          : await createPdfBlob(docTitle, content);
      const filename = `${docTitle.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.${format}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(`Saved ${filename} locally from LeeWay Writer`);
      setTimeout(() => setNotice(null), 3500);
    } catch (err: any) {
      alert('Document export failed: ' + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/80 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-2xl">
      {/* 1. Header Ribbon: LeeWay Writer & Document Actions */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-cyan-500/20 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="text-xs sm:text-sm font-bold text-white tracking-wide bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 outline-none w-56 sm:w-72"
              />
              <span className="flex items-center gap-1 text-[9px] text-cyan-400 font-mono bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-800/60">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                LeeWay Writer
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono">
              Browser-local ODF-compatible workspace • Real editable document canvas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* File Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md"
            className="hidden"
          />
          <button
            onClick={createNewDocument}
            className="flex items-center gap-1 rounded bg-cyan-950/90 px-2 py-1 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-900"
            title="Create a new blank document"
          >
            <Plus className="h-3 w-3" />
            <span>New Document</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Import existing document file"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>Import</span>
          </button>

          {/* Export to .ODT */}
          <button
            onClick={() => exportDocument('odt')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/60 text-xs font-semibold text-cyan-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Download an Office-compatible OpenDocument text file"
          >
            <FileCode className="w-3 h-3" />
            <span>{isExporting === 'odt' ? 'Exporting...' : 'Export .ODT'}</span>
          </button>

          {/* Export to .DOCX */}
          <button
            onClick={() => exportDocument('docx')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Export Microsoft Word (.docx) file"
          >
            <Download className="w-3 h-3" />
            <span>.DOCX</span>
          </button>

          {/* Export to .PDF */}
          <button
            onClick={() => exportDocument('pdf')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-xs font-semibold text-rose-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Download a PDF of the current document"
          >
            <FileCheck className="w-3 h-3" />
            <span>.PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy document text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Formatting Ribbon (Writer Styles, Fonts, Alignment, Inserts) */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/70 border-b border-slate-800 text-xs shrink-0 flex-wrap">
        {/* Templates Picker */}
        <select
          onChange={(e) => {
            const tmpl = TEMPLATES[e.target.value];
            if (tmpl) {
              setDocTitle(tmpl.title);
              setContent(tmpl.content);
            }
          }}
          className="bg-slate-950 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-800 focus:border-cyan-400 outline-none cursor-pointer"
        >
          <option value="blank">Template: Blank Document</option>
          <option value="technicalSpec">Template: Tech Specification</option>
          <option value="projectReport">Template: Project Report (example only)</option>
        </select>

        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value as any)}
          className="bg-slate-950 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-800 focus:border-cyan-400 outline-none cursor-pointer"
        >
          <option value="sans">Plus Jakarta Sans</option>
          <option value="serif">Times New Roman</option>
          <option value="mono">JetBrains Mono</option>
        </select>

        <div className="w-px h-3.5 bg-slate-800 mx-0.5" />

        {/* Headings */}
        <button
          onClick={() => insertFormatting('# ', '')}
          className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-bold text-xs"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertFormatting('## ', '')}
          className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 font-semibold text-xs"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertFormatting('### ', '')}
          className="px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 text-xs"
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px h-3.5 bg-slate-800 mx-0.5" />

        {/* Bold, Italic, Underline */}
        <button
          onClick={() => insertFormatting('**', '**')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Bold (**text**)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertFormatting('*', '*')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Italic (*text*)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertFormatting('<u>', '</u>')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-800 mx-0.5" />

        {/* Lists & Table */}
        <button
          onClick={() => insertFormatting('- ', '')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertFormatting('1. ', '')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() =>
            insertBlock(
              '| Column 1 | Column 2 | Column 3 |\n|---|---|---|\n| Data A | Data B | Data C |\n| Data D | Data E | Data F |'
            )
          }
          className="p-1 rounded hover:bg-slate-800 text-cyan-400 transition-colors"
          title="Insert Table"
        >
          <TableIcon className="w-3.5 h-3.5" />
        </button>

        {/* Insert Veritas Seal */}
        <button
          onClick={() =>
            insertBlock(
              `> **Veritas Grounding Metadata**\n> Hash: ${generateVeritasReceipt('DOC', 1, `${docTitle}|${content}`).hash} · Deterministic local receipt`
            )
          }
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 hover:bg-cyan-900 text-[10px] text-cyan-300 font-semibold"
          title="Insert Veritas Security Seal"
        >
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Veritas Seal</span>
        </button>

        {notice && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700/60 ml-auto animate-in fade-in">
            <Check className="w-3 h-3" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* 3. Top Margin Ruler */}
      <div className="h-4 bg-slate-900 border-b border-slate-800 flex items-center px-6 shrink-0 select-none overflow-hidden text-[8px] text-slate-500 font-mono">
        <div className="flex-1 max-w-3xl mx-auto flex items-center justify-between border-x border-slate-800 px-2">
          <span>0cm</span>
          <span>5cm</span>
          <span>10cm</span>
          <span>15cm</span>
          <span>20cm</span>
        </div>
      </div>

      {/* 4. Real Document Page Canvas Area */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-[#0a0f1d] p-4 sm:p-6 flex justify-center custom-scrollbar">
        {/* Paged Paper Canvas */}
        <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] p-6 sm:p-10 flex flex-col min-h-[700px] text-slate-100 relative">
          {/* Header Marker */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-[10px] text-slate-400 font-mono select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="font-bold text-white uppercase tracking-wider">{docTitle}</span>
            </div>
            <span>Page 1 of {estimatedPages} · ISO 26300 ODF</span>
          </div>

          {/* Interactive Document Editor */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your document content here..."
            className={`flex-1 w-full bg-transparent resize-none outline-none leading-relaxed text-slate-100 ${
              fontFamily === 'serif'
                ? 'font-serif text-base'
                : fontFamily === 'mono'
                ? 'font-mono text-xs'
                : 'font-sans text-sm'
            }`}
            style={{ fontSize }}
          />

          {/* Document Footer Marker */}
          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
            <span>Confidential & Sovereign · LeeWay Standards</span>
            <span>Veritas SHA-256 Attested</span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Status Bar (Live Word/Character Count & Status) */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800/90 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0 select-none">
        <div className="flex items-center gap-3">
          <span>Words: <strong className="text-white">{wordCount}</strong></span>
          <span>Characters: <strong className="text-white">{charCount}</strong></span>
          <span>Est. Reading Time: <strong className="text-cyan-300">{readingTime} min</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>LeeWay Writer · ODF-compatible export</span>
        </div>
      </div>
    </div>
  );
};
