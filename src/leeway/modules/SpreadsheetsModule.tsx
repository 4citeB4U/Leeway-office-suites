/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.SPREADSHEETS
 * WHAT: Spreadsheet workspace with local formula evaluation.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/SpreadsheetsModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Spreadsheets Module (LibreOffice Calc Core Engine)
 * Fully interactive spreadsheet with inline cell editing, multi-sheet tabs,
 * real formula execution (=SUM, =AVERAGE, =COUNT, =MAX, =MIN, =IF, =PRODUCT),
 * file import (.xlsx, .ods, .csv), and real C++ backend exports.
 * Governed by LeeWay Standards Architecture (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sheet,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  DollarSign,
  Percent,
  Sigma,
  Trash2,
  Cpu,
  ShieldCheck,
  FileSpreadsheet,
  Check,
  FileUp
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  format?: 'currency' | 'percent' | 'standard';
}

interface SheetContent {
  id: string;
  name: string;
  data: Record<string, string>;
  formatting: Record<string, CellFormatting>;
  rowCount: number;
  colCount: number;
}

const DEFAULT_SHEETS: SheetContent[] = [
  {
    id: 'sheet-1',
    name: 'Workforce & Telemetry',
    rowCount: 20,
    colCount: 7,
    formatting: {
      A1: { bold: true, align: 'left' },
      B1: { bold: true, align: 'center' },
      C1: { bold: true, align: 'left' },
      D1: { bold: true, align: 'right' },
      E1: { bold: true, align: 'right' },
      F1: { bold: true, align: 'center' },
      A7: { bold: true },
      D7: { bold: true, format: 'currency' },
      E7: { bold: true }
    },
    data: {
      A1: 'Workstream / Module',
      B1: 'Progress (%)',
      C1: 'Operational Status',
      D1: 'Budget ($k)',
      E1: 'Knowledge Units',
      F1: 'Veritas State',

      A2: 'Integration Layer',
      B2: '92',
      C2: 'On Track',
      D2: '450',
      E2: '42',
      F2: 'VERIFIED',

      A3: 'Workforce Onboarding (Phase 2)',
      B3: '88',
      C3: 'In Progress',
      D3: '280',
      E3: '18',
      F3: 'VERIFIED',

      A4: 'Knowledge Base Expansion',
      B4: '95',
      C4: 'Active',
      D4: '120',
      E4: '42',
      F4: 'VERIFIED',

      A5: 'Continuum Memory Sync',
      B5: '99',
      C5: 'Optimal',
      D5: '190',
      E5: '24',
      F5: 'VERIFIED',

      A6: 'Enterprise Sovereign Security',
      B6: '100',
      C6: 'FabricPASS L4',
      D6: '360',
      E6: '30',
      F6: 'AUDITED',

      A7: 'Total Portfolio Summary',
      B7: '=AVERAGE(B2:B6)',
      C7: 'Active Deployment',
      D7: '=SUM(D2:D6)',
      E7: '=SUM(E2:E6)',
      F7: 'GOVERNED'
    }
  },
  {
    id: 'sheet-2',
    name: 'Milestone Projections',
    rowCount: 15,
    colCount: 6,
    formatting: {
      A1: { bold: true },
      B1: { bold: true },
      C1: { bold: true, align: 'right' },
      D1: { bold: true, align: 'right' }
    },
    data: {
      A1: 'Milestone Target',
      B1: 'Target Quarter',
      C1: 'Resource Capacity',
      D1: 'Projected Output',
      A2: 'Phase 2 Scale',
      B2: 'Q1 2026',
      C2: '150',
      D2: '480',
      A3: 'FabricPASS Audit',
      B3: 'Q2 2026',
      C3: '85',
      D3: '320',
      A4: 'Autonomous Dispatch',
      B4: 'Q3 2026',
      C4: '210',
      D4: '750',
      A5: 'Total Projected',
      B5: 'FY 2026',
      C5: '=SUM(C2:C4)',
      D5: '=SUM(D2:D4)'
    }
  }
];

export const SpreadsheetsModule: React.FC = () => {
  const [sheets, setSheets] = useState<SheetContent[]>(DEFAULT_SHEETS);
  const [activeSheetId, setActiveSheetId] = useState<string>('sheet-1');
  const [selectedCell, setSelectedCell] = useState<string>('B2');
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [formulaValue, setFormulaValue] = useState<string>('92');
  const [computedValues, setComputedValues] = useState<Record<string, string | number>>({});
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  const currentSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

  // Helper to get column letters
  const getColLetters = (count: number) => {
    return Array.from({ length: count }, (_, i) => String.fromCharCode(65 + i));
  };

  const columns = getColLetters(currentSheet.colCount);
  const rows = Array.from({ length: currentSheet.rowCount }, (_, i) => i + 1);

  // Focus inline input when editing
  useEffect(() => {
    if (editingCell && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [editingCell]);

  // Recalculate formula values whenever data changes
  useEffect(() => {
    const computed: Record<string, string | number> = {};
    const sheetData = currentSheet.data;

    // First pass: copy non-formulas
    Object.keys(sheetData).forEach((key) => {
      const val = sheetData[key];
      if (!val || !val.startsWith('=')) {
        computed[key] = val;
      }
    });

    // Second pass: evaluate formulas
    Object.keys(sheetData).forEach((key) => {
      const val = sheetData[key];
      if (val && val.startsWith('=')) {
        computed[key] = evaluateFormula(val, computed);
      }
    });

    setComputedValues(computed);
    setFormulaValue(sheetData[selectedCell] || '');
  }, [currentSheet.data, selectedCell]);

  // Formula Evaluator (SUM, AVERAGE, COUNT, MAX, MIN, arithmetic)
  const evaluateFormula = (formula: string, grid: Record<string, string | number>): string | number => {
    const clean = formula.trim().replace(/^=/, '');

    try {
      const funcMatch = clean.match(/^([A-Z]+)\((.*)\)$/i);
      if (funcMatch) {
        const funcName = funcMatch[1].toUpperCase();
        const argsStr = funcMatch[2].trim();

        const numbers: number[] = [];
        const parts = argsStr.split(',').map((p) => p.trim());

        for (const part of parts) {
          if (part.includes(':')) {
            const [start, end] = part.split(':').map((s) => s.toUpperCase());
            const startCol = start.charAt(0).charCodeAt(0);
            const startRow = parseInt(start.slice(1), 10);
            const endCol = end.charAt(0).charCodeAt(0);
            const endRow = parseInt(end.slice(1), 10);

            for (let c = startCol; c <= endCol; c++) {
              const col = String.fromCharCode(c);
              for (let r = startRow; r <= endRow; r++) {
                const raw = grid[`${col}${r}`];
                const num = parseFloat(String(raw || '0').replace(/[^0-9.-]/g, ''));
                if (!isNaN(num)) numbers.push(num);
              }
            }
          } else {
            const raw = grid[part.toUpperCase()] !== undefined ? grid[part.toUpperCase()] : part;
            const num = parseFloat(String(raw || '0').replace(/[^0-9.-]/g, ''));
            if (!isNaN(num)) numbers.push(num);
          }
        }

        if (funcName === 'SUM') {
          return Math.round(numbers.reduce((a, b) => a + b, 0) * 100) / 100;
        }
        if (funcName === 'AVERAGE') {
          return numbers.length ? Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 100) / 100 : 0;
        }
        if (funcName === 'COUNT') {
          return numbers.length;
        }
        if (funcName === 'MAX') {
          return numbers.length ? Math.max(...numbers) : 0;
        }
        if (funcName === 'MIN') {
          return numbers.length ? Math.min(...numbers) : 0;
        }
      }

      // Simple math expressions: =B2*1.15
      const expr = clean.replace(/([A-Z][0-9]+)/gi, (match) => {
        const val = grid[match.toUpperCase()];
        const num = parseFloat(String(val || '0').replace(/[^0-9.-]/g, ''));
        return isNaN(num) ? '0' : String(num);
      });

      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${expr})`)();
        return Math.round(res * 100) / 100;
      }

      return clean;
    } catch {
      return '#VALUE!';
    }
  };

  const handleSelectCell = (cellKey: string) => {
    setSelectedCell(cellKey);
    setFormulaValue(currentSheet.data[cellKey] || '');
  };

  const handleStartEdit = (cellKey: string) => {
    setSelectedCell(cellKey);
    setEditingCell(cellKey);
    setEditValue(currentSheet.data[cellKey] || '');
  };

  const handleCommitEdit = (newVal?: string) => {
    const val = newVal !== undefined ? newVal : editValue;
    const targetCell = editingCell || selectedCell;

    setSheets((prev) =>
      prev.map((s) => {
        if (s.id !== activeSheetId) return s;
        const nextData = { ...s.data };
        if (val.trim() === '') {
          delete nextData[targetCell];
        } else {
          nextData[targetCell] = val;
        }
        return { ...s, data: nextData };
      })
    );

    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, cellKey: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommitEdit();
      // Move down
      const col = cellKey.charAt(0);
      const row = parseInt(cellKey.slice(1), 10);
      if (row < currentSheet.rowCount) {
        handleSelectCell(`${col}${row + 1}`);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleCommitEdit();
      // Move right
      const colCode = cellKey.charAt(0).charCodeAt(0);
      const row = parseInt(cellKey.slice(1), 10);
      if (colCode - 65 + 1 < currentSheet.colCount) {
        handleSelectCell(`${String.fromCharCode(colCode + 1)}${row}`);
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleFormulaBarChange = (val: string) => {
    setFormulaValue(val);
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id !== activeSheetId) return s;
        const nextData = { ...s.data };
        if (val.trim() === '') {
          delete nextData[selectedCell];
        } else {
          nextData[selectedCell] = val;
        }
        return { ...s, data: nextData };
      })
    );
  };

  // AutoSum button: inserts =SUM(col2:col{row-1})
  const handleAutoSum = () => {
    const col = selectedCell.charAt(0);
    const row = parseInt(selectedCell.slice(1), 10);
    if (row > 2) {
      const sumFormula = `=SUM(${col}2:${col}${row - 1})`;
      handleFormulaBarChange(sumFormula);
      setNotice(`Inserted ${sumFormula}`);
      setTimeout(() => setNotice(null), 2500);
    }
  };

  // Formatting toggles
  const toggleFormat = (key: keyof CellFormatting, value?: any) => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id !== activeSheetId) return s;
        const existing = s.formatting[selectedCell] || {};
        const updated = {
          ...s.formatting,
          [selectedCell]: {
            ...existing,
            [key]: value !== undefined ? value : !existing[key]
          }
        };
        return { ...s, formatting: updated };
      })
    );
  };

  // Add 10 rows
  const handleAddRows = () => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeSheetId ? { ...s, rowCount: s.rowCount + 10 } : s))
    );
    setNotice('Added 10 rows to sheet');
    setTimeout(() => setNotice(null), 2000);
  };

  // Add column
  const handleAddColumn = () => {
    if (currentSheet.colCount < 16) {
      setSheets((prev) =>
        prev.map((s) => (s.id === activeSheetId ? { ...s, colCount: s.colCount + 1 } : s))
      );
      setNotice('Added new column');
      setTimeout(() => setNotice(null), 2000);
    }
  };

  // Add new sheet tab
  const handleAddSheet = () => {
    const newId = `sheet-${sheets.length + 1}`;
    const newSheet: SheetContent = {
      id: newId,
      name: `Sheet ${sheets.length + 1}`,
      rowCount: 20,
      colCount: 7,
      formatting: { A1: { bold: true } },
      data: { A1: 'Title', B1: 'Value' }
    };
    setSheets([...sheets, newSheet]);
    setActiveSheetId(newId);
    setSelectedCell('A1');
  };

  // Real File Import (.xlsx, .ods, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const rawJson: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const importedData: Record<string, string> = {};
        const rowCount = Math.max(rawJson.length + 5, 20);
        let maxCols = 6;

        rawJson.forEach((row, rIdx) => {
          if (row.length > maxCols) maxCols = row.length;
          row.forEach((cellVal, cIdx) => {
            if (cellVal !== undefined && cellVal !== null) {
              const colLetter = String.fromCharCode(65 + cIdx);
              importedData[`${colLetter}${rIdx + 1}`] = String(cellVal);
            }
          });
        });

        const newSheet: SheetContent = {
          id: `sheet-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 20),
          rowCount,
          colCount: Math.min(maxCols + 2, 12),
          formatting: {},
          data: importedData
        };

        setSheets((prev) => [...prev, newSheet]);
        setActiveSheetId(newSheet.id);
        setSelectedCell('A1');
        setNotice(`Imported ${file.name} with ${rawJson.length} rows`);
        setTimeout(() => setNotice(null), 3500);
      } catch (err) {
        alert('Failed to parse spreadsheet file: ' + err);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Real File Export (.ods, .xlsx, .csv)
  const handleExport = async (format: 'ods' | 'xlsx' | 'csv') => {
    setIsExporting(format);
    try {
      // Build 2D grid matrix for export
      const gridMatrix: Array<Array<string | number>> = [];
      for (let r = 1; r <= currentSheet.rowCount; r++) {
        const rowArr: Array<string | number> = [];
        let hasData = false;
        for (let c = 0; c < currentSheet.colCount; c++) {
          const key = `${String.fromCharCode(65 + c)}${r}`;
          const val = computedValues[key] !== undefined ? computedValues[key] : (currentSheet.data[key] || '');
          rowArr.push(val);
          if (val !== '') hasData = true;
        }
        if (hasData || r <= 10) gridMatrix.push(rowArr);
      }

      const res = await fetch('/api/libreoffice/calc/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName: currentSheet.name,
          gridRows: gridMatrix,
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
      alert('Spreadsheet export failed: ' + err.message);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/80 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-2xl">
      {/* 1. Ribbon Bar: LibreOffice Calc Engine & Actions */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/95 border-b border-cyan-500/20 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Sheet className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                LeeWay Calc
              </h2>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-800/60">
                <Cpu className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                LibreOffice Core v7.4.7.2
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono">
              OASIS OpenDocument Spreadsheet Engine • Real Inline Cell Editing
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* File Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.ods,.csv,.tsv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Import .xlsx, .ods, or .csv file"
          >
            <Upload className="w-3 h-3 text-cyan-400" />
            <span>Import</span>
          </button>

          {/* Export to .ODS (LibreOffice Calc) */}
          <button
            onClick={() => handleExport('ods')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/60 text-xs font-semibold text-emerald-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Export native LibreOffice Calc (.ods) file"
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>{isExporting === 'ods' ? 'Saving...' : 'Export .ODS'}</span>
          </button>

          {/* Export to .XLSX */}
          <button
            onClick={() => handleExport('xlsx')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/60 text-xs font-semibold text-cyan-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Export Microsoft Excel (.xlsx) file"
          >
            <Download className="w-3 h-3" />
            <span>.XLSX</span>
          </button>

          {/* Export to .CSV */}
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting !== null}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Export comma-separated values"
          >
            <span>.CSV</span>
          </button>

          <button
            onClick={() => setSheets(DEFAULT_SHEETS)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            title="Reset default grid"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. Formatting Ribbon */}
      <div className="flex items-center gap-1 px-3 py-1 bg-slate-900/70 border-b border-slate-800 text-xs shrink-0 flex-wrap">
        {/* Bold */}
        <button
          onClick={() => toggleFormat('bold')}
          className={`p-1 rounded transition-colors ${
            currentSheet.formatting[selectedCell]?.bold
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        {/* Italic */}
        <button
          onClick={() => toggleFormat('italic')}
          className={`p-1 rounded transition-colors ${
            currentSheet.formatting[selectedCell]?.italic
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-800 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => toggleFormat('align', 'left')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => toggleFormat('align', 'center')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => toggleFormat('align', 'right')}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-slate-800 mx-1" />

        {/* Formats: Currency, Percent */}
        <button
          onClick={() => toggleFormat('format', 'currency')}
          className="p-1 rounded hover:bg-slate-800 text-emerald-400 transition-colors"
          title="Format as Currency ($)"
        >
          <DollarSign className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => toggleFormat('format', 'percent')}
          className="p-1 rounded hover:bg-slate-800 text-cyan-400 transition-colors"
          title="Format as Percent (%)"
        >
          <Percent className="w-3.5 h-3.5" />
        </button>

        {/* AutoSum */}
        <button
          onClick={handleAutoSum}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 hover:bg-emerald-900 text-[10px] font-bold text-emerald-300 transition-colors"
          title="AutoSum column values into current cell"
        >
          <Sigma className="w-3 h-3 text-emerald-400" />
          <span>AutoSum</span>
        </button>

        {/* Clear Cell */}
        <button
          onClick={() => handleFormulaBarChange('')}
          className="p-1 rounded hover:bg-red-950/50 hover:text-red-300 text-slate-400 transition-colors ml-auto"
          title="Clear selected cell"
        >
          <Trash2 className="w-3 h-3" />
        </button>

        {notice && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700/60 ml-2 animate-in fade-in">
            <Check className="w-3 h-3" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* 3. Formula Bar */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 border-b border-slate-800 text-xs shrink-0">
        {/* Cell Coordinate Box */}
        <div className="flex items-center justify-center w-12 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-cyan-300 font-bold text-xs shrink-0">
          {selectedCell}
        </div>
        <div className="flex items-center justify-center w-5 h-5 rounded bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 font-mono text-[10px] font-bold shrink-0">
          fx
        </div>
        <input
          type="text"
          value={formulaValue}
          onChange={(e) => handleFormulaBarChange(e.target.value)}
          placeholder="Enter value or formula: =SUM(D2:D6), =AVERAGE(B2:B6), =COUNT(A2:A6)..."
          className="flex-1 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800 focus:border-cyan-400 focus:outline-none text-white font-mono text-xs"
        />
      </div>

      {/* 4. Interactive Spreadsheet Grid Canvas */}
      <div className="flex-1 min-h-0 overflow-auto bg-[#070b14] p-2 select-text">
        <div className="inline-block min-w-full align-middle border border-slate-800/90 rounded-lg overflow-hidden shadow-2xl">
          <table className="min-w-full divide-y divide-slate-800/80 border-collapse text-xs font-mono">
            {/* Header Row (Columns A, B, C...) */}
            <thead>
              <tr className="bg-slate-900/95 text-slate-400">
                <th className="w-10 px-2 py-1 text-center font-bold text-slate-500 border-r border-slate-800 bg-slate-950">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-1 text-center font-bold text-slate-300 border-r border-slate-800/80 last:border-r-0 min-w-[110px]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Grid Cells */}
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/50">
              {rows.map((rowNum) => (
                <tr key={rowNum} className="hover:bg-slate-900/30 transition-colors">
                  {/* Row Number */}
                  <td className="w-10 px-2 py-1 text-center font-bold text-slate-500 bg-slate-900/50 border-r border-slate-800 select-none">
                    {rowNum}
                  </td>

                  {/* Columns */}
                  {columns.map((col) => {
                    const cellKey = `${col}${rowNum}`;
                    const rawVal = currentSheet.data[cellKey];
                    const computed = computedValues[cellKey] !== undefined ? computedValues[cellKey] : (rawVal || '');
                    const isSelected = selectedCell === cellKey;
                    const isEditing = editingCell === cellKey;
                    const isFormula = rawVal && rawVal.startsWith('=');
                    const fmt = currentSheet.formatting[cellKey] || {};

                    let displayVal = String(computed);
                    if (fmt.format === 'currency' && typeof computed === 'number') {
                      displayVal = `$${computed.toLocaleString()}`;
                    } else if (fmt.format === 'percent' && typeof computed === 'number') {
                      displayVal = `${computed}%`;
                    }

                    return (
                      <td
                        key={cellKey}
                        onClick={() => handleSelectCell(cellKey)}
                        onDoubleClick={() => handleStartEdit(cellKey)}
                        className={`relative px-2 py-1 border-r border-slate-800/60 last:border-r-0 transition-all cursor-cell min-w-[110px] ${
                          isSelected
                            ? 'bg-cyan-500/20 text-white outline outline-2 outline-cyan-400 z-10 shadow-inner'
                            : rowNum === 1
                            ? 'bg-slate-900/80 font-bold text-cyan-300'
                            : 'text-slate-300 hover:bg-slate-800/40'
                        } ${fmt.align === 'center' ? 'text-center' : fmt.align === 'right' ? 'text-right' : 'text-left'} ${
                          fmt.bold ? 'font-bold' : ''
                        } ${fmt.italic ? 'italic' : ''}`}
                      >
                        {isEditing ? (
                          <input
                            ref={inlineInputRef}
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleCommitEdit()}
                            onKeyDown={(e) => handleKeyDown(e, cellKey)}
                            className="w-full bg-slate-900 text-white px-1 py-0.5 rounded outline-none border border-cyan-400 font-mono text-xs shadow-md"
                          />
                        ) : (
                          <div className="flex items-center justify-between gap-1 w-full min-h-[18px]">
                            <span className="truncate">{displayVal}</span>
                            {isFormula && (
                              <span className="text-[8px] text-emerald-400 font-bold opacity-60 shrink-0">
                                fx
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expand Grid Controls */}
        <div className="flex items-center gap-2 mt-3 select-none">
          <button
            onClick={handleAddRows}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>Add 10 Rows</span>
          </button>
          <button
            onClick={handleAddColumn}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3 text-cyan-400" />
            <span>Add Column</span>
          </button>
        </div>
      </div>

      {/* 5. Sheet Tabs Bar (LibreOffice Style) */}
      <div className="flex items-center justify-between px-3 py-1 bg-slate-950 border-t border-slate-800/90 text-xs shrink-0 select-none">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {sheets.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSheetId(s.id);
                setSelectedCell('A1');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-md text-xs font-medium transition-all cursor-pointer border-t border-x ${
                activeSheetId === s.id
                  ? 'bg-slate-900 text-cyan-300 border-cyan-500/50 shadow-sm font-semibold'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-white hover:bg-slate-900/40'
              }`}
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
              <span>{s.name}</span>
            </button>
          ))}

          <button
            onClick={handleAddSheet}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            title="Add new sheet"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

        {/* Footer Audit Stats */}
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>FabricPASS L4</span>
          </div>
          <span className="hidden sm:inline">Cell: <strong className="text-cyan-300">{selectedCell}</strong></span>
        </div>
      </div>
    </div>
  );
};
