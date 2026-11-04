/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.NOTES
 * WHAT: Notes workspace with document handoff.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/NotesModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Notes Module (Office Tools)
 * Pinned workspace notes, collaborative annotations, and research insights.
 * Governed by LeeWay Standards (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  Trash2,
  Edit3,
  Search,
  ShieldCheck,
  Tag,
  Copy,
  Check,
  FileText
} from 'lucide-react';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  tag: string;
  updatedAt: string;
  veritasHash: string;
}

const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Milestone Execution & Phase 2 Priorities',
    content: 'Review and confirm headcount for Phase 2 workforce training cohort before Friday. Ensure all 42 newly cataloged resources in the knowledge repository are properly linked in the executive briefing.',
    tag: 'Workforce',
    updatedAt: 'Today, 10:30 AM',
    veritasHash: 'LW-NOTE-01A'
  },
  {
    id: 'note-2',
    title: 'Calc Formula & Dependency Validation',
    content: 'All portfolio budget sums in the telemetry spreadsheet (=SUM(D2:D6) and =AVERAGE(B2:B6)) have been verified against LibreOffice Calc core engine standards. Target Q2 budget allocation remains at $1.4M.',
    tag: 'Operations',
    updatedAt: 'Today, 09:45 AM',
    veritasHash: 'LW-NOTE-02B'
  },
  {
    id: 'note-3',
    title: 'Veritas Attestation & FabricPASS Audit',
    content: 'Zero-hallucination compliance score verified at 99.4%. Continuum pipeline ensures seamless context propagation between Open Notebook research grounding and LibreOffice document exports.',
    tag: 'Governance',
    updatedAt: 'Yesterday, 04:15 PM',
    veritasHash: 'LW-NOTE-03C'
  }
];

interface NotesModuleProps {
  onSendToDoc?: (text: string) => void;
}

export const NotesModule: React.FC<NotesModuleProps> = ({ onSendToDoc }) => {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(INITIAL_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const handleAddNote = () => {
    const newNote: NoteItem = {
      id: 'note-' + Date.now(),
      title: 'New Office Note',
      content: 'Start writing your collaborative note or extract insights from active sources...',
      tag: 'General',
      updatedAt: 'Just now',
      veritasHash: 'LW-NOTE-' + Math.random().toString(36).substring(2, 6).toUpperCase()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setSelectedNoteId(remaining[0].id);
  };

  const handleUpdateContent = (content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, content, updatedAt: 'Just now' } : n))
    );
  };

  const handleUpdateTitle = (title: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === selectedNoteId ? { ...n, title, updatedAt: 'Just now' } : n))
    );
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/70 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-cyan-500/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-950/70 border border-amber-500/40 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Office Notes & Insights</h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Collaborative annotations, meeting action items & grounded takeaways
            </p>
          </div>
        </div>

        <button
          onClick={handleAddNote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Split Layout: Notes List on Left, Editor on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Notes List Column */}
        <div className="w-72 bg-slate-950/80 border-r border-slate-800/80 p-3 flex flex-col gap-2.5 overflow-y-auto shrink-0">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-amber-300 border border-slate-700">
                      {note.tag}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{note.updatedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate mb-1">{note.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Editor Column */}
        {selectedNote && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-4 sm:p-6 bg-[#070b14]">
            <div className="flex-1 flex flex-col gap-3 max-w-3xl w-full mx-auto bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateTitle(e.target.value)}
                  className="bg-transparent text-base font-bold text-white focus:outline-none focus:border-b focus:border-amber-400 px-1 py-0.5 flex-1"
                />

                <div className="flex items-center gap-2">
                  {onSendToDoc && (
                    <button
                      onClick={() => onSendToDoc(selectedNote.title + '\n\n' + selectedNote.content)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-medium cursor-pointer"
                      title="Insert into Document"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Send to Doc</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedNote.content);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy Note Content"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDeleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-400 cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                value={selectedNote.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                className="flex-1 bg-transparent text-slate-200 text-xs sm:text-sm font-sans leading-relaxed focus:outline-none resize-none min-h-[300px]"
                placeholder="Write note content..."
              />

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Veritas Hash: {selectedNote.veritasHash}</span>
                </div>
                <span>Last updated: {selectedNote.updatedAt}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
