/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI
 * TAG: LEEWAY.APP.UI.SHELL.APP
 * WHAT: Application shell composing Office Suites modules and governance controls.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/App.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LeeWay Office Suites — Agent Tablet
 * Unifying LibreOffice Core Engine & Open Notebook Grounded Synthesis
 * Governed by LeeWay Standards Architecture (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useState } from 'react';
import { TabletFrame } from './leeway/components/TabletFrame';
import { OfficeSuitesBanner } from './leeway/components/OfficeSuitesBanner';
import { UnifiedSuiteSidebar } from './leeway/components/UnifiedSuiteSidebar';
import { SystemDock } from './leeway/components/SystemDock';

// Modules
import { PDFAnnotationModule } from './leeway/modules/PDFAnnotationModule';
import { DocumentsModule } from './leeway/modules/DocumentsModule';
import { SpreadsheetsModule } from './leeway/modules/SpreadsheetsModule';
import { PresentationsModule } from './leeway/modules/PresentationsModule';
import { DrawModule } from './leeway/modules/DrawModule';
import { ResearchNotebookModule } from './leeway/modules/ResearchNotebookModule';
import { SourcesManagerModule } from './leeway/modules/SourcesManagerModule';
import { NotesModule } from './leeway/modules/NotesModule';

// Modals
import { TransformResultModal } from './leeway/components/TransformResultModal';
import { GroundedAskModal } from './leeway/components/GroundedAskModal';
import { AddSourceModal } from './leeway/components/AddSourceModal';
import { DiagnosticsModal } from './leeway/components/DiagnosticsModal';
import { ContinuumModal } from './leeway/components/ContinuumModal';
import { MasterToolsPalette } from './leeway/components/MasterToolsPalette';
import { ActiveToolType } from './leeway/components/OfficeSuitesBanner';

import {
  SuiteModuleId,
  SystemDockId,
  TransformActionId,
  GroundedActionId,
  GroundedSource,
  TransformResult
} from './leeway/types';
import { INITIAL_SOURCES } from './leeway/data/defaultSources';

export default function App() {
  const [activeModule, setActiveModule] = useState<SuiteModuleId>('pdf');
  const [activeDockTab, setActiveDockTab] = useState<SystemDockId>('office');
  const [sources, setSources] = useState<GroundedSource[]>(INITIAL_SOURCES);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [transformResult, setTransformResult] = useState<TransformResult | null>(null);
  const [groundedAskAction, setGroundedAskAction] = useState<GroundedActionId | null>(null);

  // Collapsible unified taskbar on the right
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Active Office Tools & Zoom state (controlled from top banner & master tools)
  const [activeTool, setActiveTool] = useState<ActiveToolType>('select');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [highlightColor, setHighlightColor] = useState<string>('#fef08a');
  const [penColor, setPenColor] = useState<string>('#22d3ee');
  const [isMasterToolsOpen, setIsMasterToolsOpen] = useState<boolean>(false);

  // Modals state
  const [isAddSourceOpen, setIsAddSourceOpen] = useState<boolean>(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isContinuumOpen, setIsContinuumOpen] = useState<boolean>(false);

  // Cross-module doc editor sync
  const [documentContent, setDocumentContent] = useState<string>('');

  const handleToggleSource = (sourceId: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === sourceId ? { ...s, checked: !s.checked } : s))
    );
  };

  const handleAddSource = (newSource: GroundedSource) => {
    setSources((prev) => [newSource, ...prev]);
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
  };

  const handleExecuteTransform = async (transformType: TransformActionId) => {
    setIsGenerating(true);
    const activeSources = sources.filter((s) => s.checked);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transformType,
          sources: activeSources
        })
      });

      if (!response.ok) throw new Error(`Transform API unavailable (HTTP ${response.status})`);
      const data = await response.json();
      if (typeof data.result !== 'string' || !data.result.trim()) {
        throw new Error('Transform service returned no usable output');
      }

      setTransformResult({
        transformType,
        content: data.result,
        // Only a separately verified backend may supply an attestation.
        // Never synthesize a receipt or score in the client.
        sourcesUsed: activeSources.map((s) => s.title)
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      setTransformResult({
        transformType,
        content: `Unavailable: ${reason}. No content was generated. Configure a governed transformation runtime before using this action.`,
        error: true,
        sourcesUsed: activeSources.map((s) => s.title)
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecuteGroundedAction = (actionType: GroundedActionId) => {
    setGroundedAskAction(actionType);
  };

  const handleInsertIntoDoc = (text: string) => {
    setDocumentContent((prev) => prev + '\n\n' + text);
    setActiveModule('documents');
  };

  return (
    <TabletFrame>
      {/* Main App Container */}
      <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden min-h-0">
        {/* Banner: LeeWay Office Suites with Top-Right Tool Section */}
        <OfficeSuitesBanner
          activeModuleTitle={activeModule}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          zoomLevel={zoomLevel}
          onZoomIn={() => setZoomLevel((z) => Math.min(z + 10, 160))}
          onZoomOut={() => setZoomLevel((z) => Math.max(z - 10, 50))}
          onZoomReset={() => setZoomLevel(100)}
          onZoomFit={() => setZoomLevel(85)}
          onOpenMasterTools={() => setIsMasterToolsOpen(true)}
          highlightColor={highlightColor}
          onSelectHighlightColor={setHighlightColor}
          penColor={penColor}
          onSelectPenColor={setPenColor}
        />

        {/* Studio Workspace: Full Expansive Preview on Left, Unified Taskbar on Right */}
        <div className="flex-1 flex gap-2 overflow-hidden min-h-0">
          {/* Dominant Left Canvas: Active Module Preview (Documents, Spreadsheets, Presentations, Draw, PDF, Research, Notes, Sources) */}
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            {activeModule === 'pdf' && (
              <PDFAnnotationModule
                activeTool={activeTool}
                onSelectTool={setActiveTool}
                zoomLevel={zoomLevel}
                highlightColor={highlightColor}
                penColor={penColor}
                onSendToBrief={(c) => handleInsertIntoDoc(c)}
                onOpenGroundedAsk={() => setGroundedAskAction('Ask a Question')}
              />
            )}

            {activeModule === 'documents' && (
              <DocumentsModule initialContent={documentContent} />
            )}

            {activeModule === 'spreadsheets' && <SpreadsheetsModule />}

            {activeModule === 'presentations' && <PresentationsModule />}

            {activeModule === 'draw' && <DrawModule />}

            {activeModule === 'research' && (
              <ResearchNotebookModule sources={sources} />
            )}

            {activeModule === 'notes' && (
              <NotesModule onSendToDoc={handleInsertIntoDoc} />
            )}

            {activeModule === 'sources' && (
              <SourcesManagerModule
                sources={sources}
                onToggleSource={handleToggleSource}
                onAddSource={() => setIsAddSourceOpen(true)}
                onDeleteSource={handleDeleteSource}
              />
            )}
          </main>

          {/* Unified Right Taskbar: Office Tools Dropdown + Turn Sources Into Dropdown */}
          <UnifiedSuiteSidebar
            activeModule={activeModule}
            onSelectModule={(mod) => {
              setActiveModule(mod);
              setActiveDockTab('office');
            }}
            onExecuteTransform={handleExecuteTransform}
            isGenerating={isGenerating}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            sourcesCount={sources.length}
            activeSourcesCount={sources.filter((s) => s.checked).length}
          />
        </div>
      </div>

      {/* 3. Bottom System Dock (Tablet OS) — Redundant second bottom bar removed as requested */}
      <SystemDock
        activeDockTab={activeDockTab}
        onSelectDockTab={(tab) => {
          setActiveDockTab(tab);
          if (tab === 'office') setActiveModule('pdf');
          if (tab === 'blackboard') setActiveModule('draw');
          if (tab === 'workforce') setActiveModule('spreadsheets');
          if (tab === 'preview') setActiveModule('presentations');
          if (tab === 'apps') setActiveModule('research');
        }}
        onOpenContinuum={() => setIsContinuumOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />

      {/* Interactive Modals */}
      <TransformResultModal
        result={transformResult}
        onClose={() => setTransformResult(null)}
        onInsertIntoDoc={handleInsertIntoDoc}
      />

      <GroundedAskModal
        initialAction={groundedAskAction}
        sources={sources}
        onClose={() => setGroundedAskAction(null)}
        onInsertIntoDoc={handleInsertIntoDoc}
      />

      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAdd={handleAddSource}
      />

      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      <ContinuumModal
        isOpen={isContinuumOpen}
        onClose={() => setIsContinuumOpen(false)}
      />

      {/* Master Tools Palette for all Office Suites (Docs, Calc, Impress, Draw, PDF, Research) */}
      <MasterToolsPalette
        isOpen={isMasterToolsOpen}
        onClose={() => setIsMasterToolsOpen(false)}
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setActiveDockTab('office');
        }}
        onApplyToolAction={(mod, actionId) => {
          if (actionId === 'pdf-highlighter') setActiveTool('highlight');
          if (actionId === 'pdf-pen') setActiveTool('pen');
          if (actionId === 'pdf-note') setActiveTool('note');
          if (actionId === 'pdf-text') setActiveTool('text');
          if (actionId === 'pdf-crop') setActiveTool('crop');
        }}
      />
    </TabletFrame>
  );
}
