/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.CONTINUUM
 * WHAT: Continuum lifecycle modal for governed workflow visibility.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/ContinuumModal.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Continuum Lifecycle Modal
 * Demonstrates the 8-stage LeeWay context engineering formula:
 * Continuity -> Context -> Formula -> Capability -> Runtime -> Veritas -> Receipt -> Learning
 */

import React from 'react';
import { X, Infinity as InfinityIcon, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface ContinuumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContinuumModal: React.FC<ContinuumModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const stages = [
    { name: '1. Continuity', desc: 'Unbroken session memory across all 9 suite modules', color: 'border-cyan-400 text-cyan-300' },
    { name: '2. Context', desc: 'Tri-tier memory: Episodic, Semantic vectors, Procedural', color: 'border-blue-400 text-blue-300' },
    { name: '3. Formula', desc: 'Deterministic transformation logic & prompt atom templates', color: 'border-emerald-400 text-emerald-300' },
    { name: '4. Capability', desc: 'LibreOffice core engines + Open Notebook source grounding', color: 'border-yellow-400 text-yellow-300' },
    { name: '5. Runtime', desc: 'Sovereign agent execution with zero unverified external APIs', color: 'border-orange-400 text-orange-300' },
    { name: '6. Veritas', desc: 'Cryptographic compliance verification & paged source citations', color: 'border-purple-400 text-purple-300' },
    { name: '7. Receipt', desc: 'Immutable audit hashes for every generation action', color: 'border-pink-400 text-pink-300' },
    { name: '8. Learning', desc: 'Institutional memory updates with zero drift feedback loops', color: 'border-teal-400 text-teal-300' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <InfinityIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              LeeWay Continuum Architecture Lifecycle
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            The LeeWay Continuum protocol guarantees that every transformation, calculation, and document edit flows through an auditable, governed pipeline:
          </p>

          <div className="space-y-2.5">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 ${stage.color} shrink-0`}></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{stage.name}</h4>
                    <p className="text-[11px] text-slate-400">{stage.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white cursor-pointer font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
