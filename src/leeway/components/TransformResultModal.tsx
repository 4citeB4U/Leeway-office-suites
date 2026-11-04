/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.TRANSFORMRESULT
 * WHAT: Transformation-result modal with document handoff.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/TransformResultModal.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Transform Result Modal
 * Displays the AI-generated output grounded in active sources with Veritas attestation.
 */

import React, { useState } from 'react';
import { X, ShieldCheck, Copy, Check, Download, FileText, Sparkles } from 'lucide-react';
import { TransformResult } from '../types';

interface TransformResultModalProps {
  result: TransformResult | null;
  onClose: () => void;
  onInsertIntoDoc: (content: string) => void;
}

export const TransformResultModal: React.FC<TransformResultModalProps> = ({
  result,
  onClose,
  onInsertIntoDoc
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              {result.transformType} Synthesis
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
              Grounded Output
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Veritas Attestation Banner */}
        <div className="px-6 py-2 bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Veritas Attestation: {result.veritas.hash}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Score: <strong className="text-emerald-400">{result.veritas.complianceScore}</strong></span>
            <span>Sources: <strong>{result.veritas.groundedSourcesCount}</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60 text-slate-200 text-xs leading-relaxed font-sans">
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
            {result.content}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={() => {
                const blob = new Blob([result.content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `leeway-${result.transformType.toLowerCase().replace(/\s+/g, '-')}.md`;
                a.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer font-medium"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download .md</span>
            </button>
          </div>

          <button
            onClick={() => {
              onInsertIntoDoc(result.content);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_12px_rgba(34,211,238,0.4)] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Send to LibreOffice Writer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
