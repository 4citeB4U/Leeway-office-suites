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
 * LeeWay Office Suites — AGPU Workstation
 * Unifying browser-local Office authoring & Open Notebook Grounded Synthesis
 * Governed by LeeWay Standards Architecture (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useEffect, useState } from 'react';
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
import { createGroundedTransform } from './leeway/groundedTransforms';

export default function App() {
  const [activeModule, setActiveModule] = useState<SuiteModuleId>('pdf');
  const [activeDockTab, setActiveDockTab] = useState<SystemDockId>('office');
  const [sources, setSources] = useState<GroundedSource[]>(() => {
    if (typeof window === 'undefined') return INITIAL_SOURCES;
    try {
      const stored = window.localStorage.getItem('leeway-office-sources-v1');
      if (stored) {
        const parsed = JSON.parse(stored) as GroundedSource[];
        if (Array.isArray(parsed) && parsed.every((source) => source && typeof source.id === 'string' && typeof source.title === 'string')) return parsed;
      }
    } catch {
      // Use the shipped source set when browser storage is unavailable or invalid.
    }
    return INITIAL_SOURCES;
  });
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

  useEffect(() => {
    try {
      window.localStorage.setItem('leeway-office-sources-v1', JSON.stringify(sources));
    } catch {
      // Source work remains usable in browsers that block local storage.
    }
  }, [sources]);

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

  const handleExecuteTransform = (transformType: TransformActionId) => {
    setIsGenerating(true);
    const activeSources = sources.filter((s) => s.checked);
    setTransformResult(createGroundedTransform(transformType, activeSources));
    setIsGenerating(false);
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
      <div className="agpu-workspace flex-1 flex flex-col p-4 gap-3 overflow-hidden min-h-0">
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
        <div className="agpu-workspace-grid flex-1 flex gap-3 overflow-hidden min-h-0">
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

            {activeModule === 'draw' && <DrawModule sources={sources.filter((source) => source.checked)} />}

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
            sources={sources}
            onToggleSource={handleToggleSource}
            onAddSource={() => setIsAddSourceOpen(true)}
            onOpenContentVault={() => {
              setActiveModule('sources');
              window.alert('The canonical Continuum Content Vault is not connected to this deployment. Showing existing local sources only; no Vault files have been fetched or copied.');
            }}
          />
        </div>
      </div>

      {/* 3. Bottom system dock — shared workstation navigation */}
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
