/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.DRAW
 * WHAT: Vector drawing workspace for governed diagrams.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/DrawModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Draw Module (LibreOffice Draw Vector Engine)
 * Interactive sketching, vector shape diagramming, and LeeWay Architecture canvas.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Pencil,
  Highlighter,
  Square,
  Circle,
  ArrowRight,
  Eraser,
  RotateCcw,
  Download,
  Palette
} from 'lucide-react';

export const DrawModule: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#22d3ee');
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const COLORS = ['#22d3ee', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ffffff'];

  // Initialize canvas with the LeeWay Architecture diagram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    canvas.width = 850;
    canvas.height = 600;

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid dots
    ctx.fillStyle = '#1e293b';
    for (let x = 20; x < canvas.width; x += 30) {
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Title on canvas
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('LeeWay Architecture Continuum Diagram (Governed by LeeWay Standards)', 40, 50);

    // Draw the 7 pipeline nodes
    const nodes = [
      { name: 'Continuity', color: '#38bdf8', x: 60, y: 150 },
      { name: 'Context', color: '#06b6d4', x: 170, y: 150 },
      { name: 'Formula', color: '#10b981', x: 280, y: 150 },
      { name: 'Capability', color: '#eab308', x: 390, y: 150 },
      { name: 'Runtime', color: '#f97316', x: 500, y: 150 },
      { name: 'Veritas', color: '#a855f7', x: 610, y: 150 },
      { name: 'Receipt', color: '#ec4899', x: 720, y: 150 }
    ];

    nodes.forEach((n, i) => {
      // Box
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 2;
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(n.x, n.y, 90, 50, 8);
      ctx.fill();
      ctx.stroke();

      // Node text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(n.name, n.x + 45, n.y + 30);

      // Arrow to next
      if (i < nodes.length - 1) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(n.x + 95, n.y + 25);
        ctx.lineTo(n.x + 105, n.y + 25);
        ctx.stroke();
      }
    });

    // Subtitle annotation
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText('✎ Sketch or annotate architectural pathways with the pen/highlighter tools', 40, 240);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 20;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color + '40'; // transparent
      ctx.lineWidth = 14;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leeway-draw-architecture.png';
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/60 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-xl">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-yellow-950/60 border border-yellow-500/40 text-yellow-400">
            <Pencil className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">LeeWay Vector Diagramming & Sketch</h2>
            <span className="text-[10px] text-yellow-400 font-mono">LibreOffice Draw Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Clear</span>
          </button>
          <button
            onClick={downloadCanvas}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-950/70 hover:bg-yellow-900 border border-yellow-500/40 text-xs font-medium text-yellow-300 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Drawing Toolbar */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/60 border-b border-slate-800 text-xs">
        {/* Tool Selectors */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              tool === 'pen'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Pen"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              tool === 'highlighter'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/50'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Highlighter"
          >
            <Highlighter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              tool === 'eraser'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/50'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800"></div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                color === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
              }`}
            />
          ))}
        </div>

        <div className="h-4 w-px bg-slate-800"></div>

        {/* Line Width */}
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
          <span>Width:</span>
          <input
            type="range"
            min="1"
            max="12"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
            className="w-20 accent-yellow-400 cursor-pointer"
          />
          <span>{lineWidth}px</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="rounded-xl border border-slate-800 shadow-2xl cursor-crosshair max-w-full"
        />
      </div>
    </div>
  );
};
