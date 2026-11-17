/**
 * LEEWAY HEADER — DO NOT REMOVE
 * REGION: LEEWAY.OFFICE.PRESENTATION_TEST
 * TAG: LEEWAY.OFFICE.HOST_SURFACE_TEST_V1
 * 5WH: WHAT=Test pure presentation-mode selection and the nested-shell regression.
 * WHY=Keep Office embedded views free of duplicate desktop chrome without affecting standalone.
 * WHO=Creator-directed W01; WHERE=tests/presentation-mode.test.mjs.
 * WHEN=2026-11-17; HOW=Node test runner + source guard.
 * AUTHORITY=Source test only; no physical desktop execution.
 * LICENSE=Apache-2.0.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveOfficePresentationMode } from '../src/leeway/presentationMode.ts';

test('normal Office standalone route keeps standalone shell', () => {
  assert.equal(resolveOfficePresentationMode('', false), 'standalone');
  assert.equal(resolveOfficePresentationMode('?view=pdf', false), 'standalone');
  assert.equal(resolveOfficePresentationMode('?leewaySurface=unexpected', false), 'standalone');
});

test('native tablet/widget explicit modes display capability without nested shell', () => {
  for (const mode of ['tablet', 'widget', 'embedded']) {
    assert.equal(resolveOfficePresentationMode('?leewaySurface=' + mode, false), 'embedded');
  }
});

test('Office inside any iframe uses the embedded view, even without query hint', () => {
  assert.equal(resolveOfficePresentationMode('', true), 'embedded');
  assert.equal(resolveOfficePresentationMode('?view=pdf', true), 'embedded');
});

test('embedded Office rendering removes global SystemDock and outer fake title bar', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const frame = readFileSync(new URL('../src/leeway/components/TabletFrame.tsx', import.meta.url), 'utf8');
  assert.match(app, /!embeddedSurface\s*&&\s*\(\s*<SystemDock/);
  assert.match(app, /<TabletFrame embedded=\{embeddedSurface\}>/);
  assert.match(frame, /!embedded\s*&&\s*\(\s*<div className="agpu-window-bar/);
  assert.match(frame, /w-full h-full min-w-0 min-h-0/);
});
