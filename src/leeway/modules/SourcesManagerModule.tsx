/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.SOURCESMANAGER
 * WHAT: Source-management workspace for grounded documents.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/SourcesManagerModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sources Manager Module
 * Detailed inspect, token metrics, upload, and text viewer for all grounded source files.
 */

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Check,
  FileCode,
  Calendar,
  FileText,
  Search,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { GroundedSource } from '../types';

interface SourcesManagerModuleProps {
  sources: GroundedSource[];
  onToggleSource: (id: string) => void;
  onAddSource: () => void;
  onDeleteSource: (id: string) => void;
}

export const SourcesManagerModule: React.FC<SourcesManagerModuleProps> = ({
  sources,
  onToggleSource,
  onAddSource,
  onDeleteSource
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(sources[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSource = sources.find((s) => s.id === selectedSourceId) || sources[0];

  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/60 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Active Sources Management</h2>
            <span className="text-[10px] text-cyan-400 font-mono">Open Notebook Grounding Ingestion Engine</span>
          </div>
        </div>

        <button
          onClick={onAddSource}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload / Ingest Source</span>
        </button>
      </div>

      {/* Main Split Layout: Source List on Left, Content Inspector on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Source List */}
        <div className="w-80 bg-slate-950/80 border-r border-slate-800/80 p-3 flex flex-col gap-2.5 overflow-y-auto">
          {/* Search Bar */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter sources..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Grounded Documents ({sources.length})
          </div>

          <div className="flex flex-col gap-2">
            {filteredSources.map((src) => {
              const isSelected = selectedSource?.id === src.id;

              return (
                <div
                  key={src.id}
                  onClick={() => setSelectedSourceId(src.id)}
                  className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSource(src.id);
                        }}
                        className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                          src.checked
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'bg-slate-800 border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="text-xs font-semibold text-white truncate max-w-[170px]">
                        {src.title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSource(src.id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="Remove source"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {src.summary}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{src.pageCount} pages</span>
                    <span>{src.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Source Inspector */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-900/30 flex flex-col gap-4">
          {selectedSource ? (
            <>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    {selectedSource.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedSource.category} • {selectedSource.pageCount} pages • Updated: {selectedSource.updatedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold ${
                      selectedSource.checked
                        ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {selectedSource.checked ? 'Active In Grounding' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Source Document Text Extent */}
              <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider block mb-3 font-mono">
                  Ingested Source Text & Token Excerpts
                </span>
                <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-300">
                  {selectedSource.content}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              Select a source to inspect.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
