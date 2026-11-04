/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.ADDSOURCE
 * WHAT: Source-ingestion modal for the grounded workspace.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/AddSourceModal.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Add Source Ingestion Modal
 */

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import { GroundedSource } from '../types';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newSource: GroundedSource) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Operations');
  const [type, setType] = useState<'pdf' | 'docx' | 'md' | 'txt'>('pdf');
  const [pageCount, setPageCount] = useState(4);
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSource: GroundedSource = {
      id: 'src-' + Date.now(),
      title: title.endsWith(`.${type}`) ? title : `${title}.${type}`,
      type,
      pageCount,
      category,
      checked: true,
      content: content || `${title} content ingested into LeeWay Grounding core.`,
      summary: `User-ingested document categorized under ${category}.`,
      updatedAt: 'Just now'
    };

    onAdd(newSource);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Ingest Grounded Source
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q1 Operational Review"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Format</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="pdf">PDF (.pdf)</option>
                <option value="docx">Word (.docx)</option>
                <option value="md">Markdown (.md)</option>
                <option value="txt">Text (.txt)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Pages</label>
              <input
                type="number"
                min={1}
                max={500}
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Document Text / Notes Content</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw source text or key excerpts for token grounding..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_12px_rgba(34,211,238,0.4)] cursor-pointer"
            >
              Ingest & Index
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
