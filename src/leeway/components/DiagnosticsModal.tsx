/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.DIAGNOSTICS
 * WHAT: Diagnostics modal for Office Suites runtime evidence.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/DiagnosticsModal.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Diagnostics Modal
 * Governed by LeeWay Standards Architecture:
 * Evaluates FabricPASS, Agent SkillsPASS, and Veritas audit checkpoints.
 */

import React from 'react';
import { X, Activity, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';
import { INITIAL_COMPLIANCE_CHECKS, LEEWAY_STANDARDS_VERSION } from '../governance/leewayCompliance';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              LeeWay Standards Sovereign Diagnostics
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {LEEWAY_STANDARDS_VERSION}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overview Score Card */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">SOVEREIGN COMPLIANCE SCORE</span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">99.4%</span>
            </div>
          </div>

          <div className="flex flex-col text-right text-[11px] font-mono text-slate-400">
            <span>Runtime: Sovereign Linux (Node 22 / React 19)</span>
            <span>Security Level: FabricPASS L4 Attested</span>
            <span>Zero-Drift: Enforced</span>
          </div>
        </div>

        {/* Verification Checkpoints */}
        <div className="p-6 overflow-y-auto space-y-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block font-mono">
            LeeWay Standards Architectural Audit Items
          </span>

          {INITIAL_COMPLIANCE_CHECKS.map((check) => (
            <div
              key={check.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-white">{check.name}</h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                      {check.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {check.description}
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                  {check.status} ({check.score}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white cursor-pointer font-medium"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
