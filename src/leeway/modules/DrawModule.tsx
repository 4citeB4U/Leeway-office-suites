/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.DRAW
 * WHAT: Browser-local illustration and annotation workspace.
 * WHY: Turn selected source material into a visible picture while preserving manual drawing.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/DrawModule.tsx
 * WHEN: 2026-11-04 source transformation repair.
 * HOW: Render a source-grounded illustration on Canvas and keep all pen work local.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */

/** @license SPDX-License-Identifier: Apache-2.0 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pencil, Highlighter, Eraser, RotateCcw, Download, ImagePlus } from 'lucide-react';
import { GroundedSource } from '../types';

interface DrawModuleProps {
  sources?: GroundedSource[];
}

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let line = '';
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  });
  if (line) lines.push(line);
  return lines;
};

function renderSourceIllustration(canvas: HTMLCanvasElement, sources: GroundedSource[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = 960;
  canvas.height = 640;
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#1e293b';
  for (let x = 20; x < canvas.width; x += 30) {
    for (let y = 20; y < canvas.height; y += 30) ctx.fillRect(x, y, 1.5, 1.5);
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('LeeWay source illustration', 40, 48);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.fillText(
    sources.length ? `Created from ${sources.length} selected source${sources.length === 1 ? '' : 's'}` : 'Select a source, then create an illustration',
    40,
    74
  );

  const rootX = 480;
  const rootY = 128;
  ctx.fillStyle = '#0e7490';
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rootX - 115, rootY, 230, 58, 14);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('Selected source set', rootX, rootY + 25);
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#cffafe';
  ctx.fillText('LeeWay grounded workspace', rootX, rootY + 44);

  const cards = sources.slice(0, 6);
  const cardWidth = 270;
  const cardHeight = 152;
  const gapX = 28;
  const startX = (canvas.width - (cardWidth * 3 + gapX * 2)) / 2;
  const startY = 250;
  cards.forEach((source, index) => {
    const x = startX + (index % 3) * (cardWidth + gapX);
    const y = startY + Math.floor(index / 3) * (cardHeight + 38);
    const accent = ['#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#60a5fa'][index % 6];
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rootX, rootY + 58);
    ctx.lineTo(x + cardWidth / 2, y);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, cardWidth, cardHeight, 12);
    ctx.fill();
    ctx.stroke();
    ctx.textAlign = 'left';
    ctx.fillStyle = accent;
    ctx.font = 'bold 13px sans-serif';
    wrapText(ctx, source.title, cardWidth - 28).slice(0, 2).forEach((line, lineIndex) => ctx.fillText(line, x + 14, y + 24 + lineIndex * 17));
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px sans-serif';
    wrapText(ctx, source.summary || source.content, cardWidth - 28).slice(0, 4).forEach((line, lineIndex) => ctx.fillText(line, x + 14, y + 66 + lineIndex * 15));
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText(`${source.category} • ${source.pageCount} pages`, x + 14, y + cardHeight - 14);
  });
  if (!cards.length) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = '16px sans-serif';
    ctx.fillText('No selected sources yet', rootX, 330);
  }
}

export const DrawModule: React.FC<DrawModuleProps> = ({ sources = [] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#22d3ee');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const colors = ['#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ffffff'];
  const sourceSignature = sources.map((source) => `${source.id}:${source.updatedAt}:${source.checked}`).join('|');
  const stableSources = useMemo(() => sources, [sourceSignature]);

  const createIllustration = () => {
    if (canvasRef.current) renderSourceIllustration(canvasRef.current, stableSources);
  };

  useEffect(() => {
    createIllustration();
  }, [stableSources]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * (canvas.width / rect.width), (e.clientY - rect.top) * (canvas.height / rect.height));
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ctx.strokeStyle = tool === 'eraser' ? '#090d16' : tool === 'highlighter' ? `${color}40` : color;
    ctx.lineWidth = tool === 'eraser' ? 20 : tool === 'highlighter' ? 14 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'leeway-source-illustration.png';
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/60 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-yellow-950/60 border border-yellow-500/40 text-yellow-400"><Pencil className="w-4 h-4" /></div>
          <div>
            <h2 className="text-sm font-bold text-white">LeeWay Canvas & Illustration</h2>
            <span className="text-[10px] text-yellow-400 font-mono">Browser-local illustration engine</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={createIllustration} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer" title="Create an illustration from selected sources">
            <ImagePlus className="w-3.5 h-3.5" />
            <span>Create Illustration</span>
          </button>
          <button onClick={clearCanvas} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"><RotateCcw className="w-3.5 h-3.5 text-slate-400" /><span>Clear</span></button>
          <button onClick={downloadCanvas} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-950/70 hover:bg-yellow-900 border border-yellow-500/40 text-xs font-medium text-yellow-300 transition-colors cursor-pointer"><Download className="w-3.5 h-3.5" /><span>Export PNG</span></button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/60 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1">
          <button onClick={() => setTool('pen')} aria-label="Pen" className={`p-1.5 rounded-lg transition-colors cursor-pointer ${tool === 'pen' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50' : 'hover:bg-slate-800 text-slate-400'}`}><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setTool('highlighter')} aria-label="Highlighter" className={`p-1.5 rounded-lg transition-colors cursor-pointer ${tool === 'highlighter' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50' : 'hover:bg-slate-800 text-slate-400'}`}><Highlighter className="w-4 h-4" /></button>
          <button onClick={() => setTool('eraser')} aria-label="Eraser" className={`p-1.5 rounded-lg transition-colors cursor-pointer ${tool === 'eraser' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/50' : 'hover:bg-slate-800 text-slate-400'}`}><Eraser className="w-4 h-4" /></button>
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-1.5">
          {colors.map((c) => <button key={c} onClick={() => setColor(c)} aria-label={`Choose ${c}`} style={{ backgroundColor: c }} className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${color === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'}`} />)}
        </div>
        <div className="h-4 w-px bg-slate-800" />
        <label className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">Width:
          <input type="range" min="1" max="12" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value, 10))} className="w-20 accent-yellow-400 cursor-pointer" />
          <span>{lineWidth}px</span>
        </label>
      </div>

      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
        <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} className="rounded-xl border border-slate-800 shadow-2xl cursor-crosshair max-w-full" />
      </div>
    </div>
  );
};
