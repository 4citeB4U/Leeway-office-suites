/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.RUNTIME
 * TAG: LEEWAY.APP.RUNTIME.GROUNDED_TRANSFORMS
 * WHAT: Browser-local source-to-artifact transformation engine.
 * WHY: Make every Turn Sources Into action produce its named artifact from selected sources.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/groundedTransforms.ts
 * WHEN: 2026-11-04 source transformation repair.
 * HOW: Derive deterministic, source-cited artifacts without a server, provider key, or handoff.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */

import {
  GroundedSource,
  TransformActionId,
  TransformArtifact,
  TransformResult,
  TransformSlide,
  TransformTableRow
} from './types';
import { generateVeritasReceipt } from './governance/leewayCompliance';

const clean = (text: string, limit = 260): string =>
  text.replace(/\s+/g, ' ').trim().slice(0, limit);

const sourceLabel = (source: GroundedSource): string => `${source.title} (p. 1-${Math.max(1, source.pageCount)})`;

const sourceDigest = (sources: GroundedSource[]): string =>
  sources.map((source) => `${source.title}|${source.content}`).join('||');

const getMetrics = (sources: GroundedSource[]) => {
  const combined = sources.map((source) => source.content).join('\n');
  const percentages = Array.from(combined.matchAll(/(\d{1,3})%\s*([A-Za-z][A-Za-z ]{0,28})/g)).slice(0, 6);
  const resourceMatch = combined.match(/(\d+)\s+(?:new\s+)?(?:verified\s+)?(?:resources|assets|modules)/i);
  const metrics = percentages.map((match) => ({
    label: clean(match[2], 34),
    value: `${match[1]}%`,
    detail: 'Extracted from selected source text'
  }));
  if (resourceMatch) metrics.push({ label: 'Grounded resources', value: resourceMatch[1], detail: 'Extracted from selected source text' });
  return metrics.length ? metrics : [{ label: 'Selected sources', value: `${sources.length}`, detail: 'Available for grounded synthesis' }];
};

const makeSlides = (sources: GroundedSource[]): TransformSlide[] => {
  const slides: TransformSlide[] = [{
    title: 'Source-grounded briefing',
    subtitle: `${sources.length} selected source${sources.length === 1 ? '' : 's'}`,
    bullets: sources.slice(0, 4).map((source) => source.title),
    notes: 'Generated in LeeWay Office Suites from the selected source set.'
  }];
  sources.slice(0, 6).forEach((source) => {
    slides.push({
      title: source.title,
      subtitle: `${source.category} • ${source.pageCount} pages • updated ${source.updatedAt}`,
      bullets: [clean(source.summary, 150), ...clean(source.content, 300).split(/(?<=[.!?])\s+/).slice(0, 3)],
      notes: `Grounded citation: ${sourceLabel(source)}`
    });
  });
  return slides;
};

const makeRows = (sources: GroundedSource[]): TransformTableRow[] => sources.map((source) => ({
  source: source.title,
  type: source.type.toUpperCase(),
  pages: source.pageCount,
  updated: source.updatedAt,
  category: source.category,
  summary: clean(source.summary, 180)
}));

const makeDialogue = (sources: GroundedSource[]) => {
  const selected = sources.map((source) => `${source.title}: ${clean(source.summary, 220)}`).join(' ');
  return [
    { speaker: 'Alex' as const, timestamp: '00:00', text: `Welcome to the LeeWay source briefing. We are reviewing ${sources.length} selected source${sources.length === 1 ? '' : 's'}.` },
    { speaker: 'Morgan' as const, timestamp: '00:12', text: selected || 'No source text is currently selected.' },
    { speaker: 'Alex' as const, timestamp: '00:35', text: 'The source set is now available as a playable browser-local audio overview. Citations remain attached to the source list.' }
  ];
};

const makeMindMapNodes = (sources: GroundedSource[]) => {
  const nodes: Array<{ id: string; label: string; parentId?: string }> = [{ id: 'root', label: 'Selected sources' }];
  sources.forEach((source, index) => {
    const id = `source-${index}`;
    nodes.push({ id, label: source.title, parentId: 'root' });
    const topics = clean(source.content, 220).split(/[,.;:]/).map((part) => clean(part, 48)).filter(Boolean).slice(0, 3);
    topics.forEach((topic, topicIndex) => nodes.push({ id: `${id}-${topicIndex}`, label: topic, parentId: id }));
  });
  return nodes;
};

export function answerFromSources(question: string, sources: GroundedSource[]): { text: string; citations: { sourceTitle: string; pageNumber: number; quote: string }[] } {
  const active = sources.length ? sources : [];
  const citations = active.slice(0, 3).map((source) => ({ sourceTitle: source.title, pageNumber: 1, quote: clean(source.summary || source.content, 160) }));
  const relevant = active.filter((source) => `${source.title} ${source.content}`.toLowerCase().includes(question.toLowerCase().split(/\s+/).find((word) => word.length > 4)?.toLowerCase() || ''));
  const selected = relevant.length ? relevant : active;
  const answer = selected.map((source) => `${source.title}: ${clean(source.summary || source.content, 220)}`).join('\n');
  return {
    text: answer ? `Based on the selected sources, here is the grounded answer to “${question}”:\n\n${answer}` : 'Select at least one source to begin grounded research.',
    citations
  };
}

export function searchSources(query: string, sources: GroundedSource[]) {
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);
  return sources.flatMap((source) => {
    const haystack = `${source.title} ${source.summary} ${source.content}`.toLowerCase();
    const score = terms.reduce((count, term) => count + (haystack.includes(term) ? 1 : 0), 0);
    if (!score) return [];
    return [{ sourceTitle: source.title, pageNumber: 1, text: clean(source.content, 360), score, chunkHash: `LW-${source.id}-${score}` }];
  }).sort((left, right) => right.score - left.score);
}

function buildArtifact(transformType: TransformActionId, sources: GroundedSource[]): TransformArtifact {
  const rows = makeRows(sources);
  const slides = makeSlides(sources);
  const metrics = getMetrics(sources);
  const dialogue = makeDialogue(sources);
  const nodes = makeMindMapNodes(sources);
  const sourceLines = sources.map((source) => `- ${source.title}: ${clean(source.summary || source.content, 220)} [${sourceLabel(source)}]`).join('\n');

  switch (transformType) {
    case 'Slide Deck':
      return { kind: 'slides', title: 'Source-grounded slide deck', description: 'A slide deck created directly from the selected sources.', slides };
    case 'Video Overview':
      return { kind: 'video', title: 'Source-grounded video overview', description: 'A browser-rendered video storyboard generated from the selected sources.', slides };
    case 'Audio Overview':
      return { kind: 'audio', title: 'Source-grounded audio overview', description: 'A playable two-host overview using the browser audio runtime.', dialogue };
    case 'Mind Map':
      return { kind: 'mindmap', title: 'Source-grounded mind map', description: 'A visual map of the selected source set and its key passages.', nodes };
    case 'Infographic':
      return { kind: 'infographic', title: 'Source-grounded infographic', description: 'A visual summary of metrics extracted from the selected source text.', metrics };
    case 'Data Table':
      return { kind: 'table', title: 'Source-grounded data table', description: 'A structured table of the selected sources.', rows };
    case 'Timeline':
      return { kind: 'timeline', title: 'Source-grounded timeline', description: 'A chronological source index built from the selected source dates.', rows: [...rows].sort((a, b) => a.updated.localeCompare(b.updated)) };
    case 'Flashcards':
      return { kind: 'cards', title: 'Source-grounded flashcards', description: 'Study cards generated from the selected source summaries.', cards: sources.map((source) => ({ question: `What is the main point of ${source.title}?`, answer: clean(source.summary || source.content, 260), source: sourceLabel(source) })) };
    case 'Quiz':
      return { kind: 'quiz', title: 'Source-grounded quiz', description: 'A quiz generated from the selected source text.', questions: sources.map((source) => ({ question: `Which source contains this grounded summary? ${clean(source.summary || source.content, 140)}`, options: [source.title, ...sources.filter((candidate) => candidate.id !== source.id).slice(0, 2).map((candidate) => candidate.title)], answer: source.title })) };
    case 'FAQ':
      return { kind: 'faq', title: 'Source-grounded FAQ', description: 'Frequently asked questions derived from the selected sources.', text: sources.map((source) => `Q: What should I know about ${source.title}?\nA: ${clean(source.summary || source.content, 260)}\nCitation: ${sourceLabel(source)}`).join('\n\n') };
    case 'Extract':
      return { kind: 'extract', title: 'Source-grounded extracts', description: 'Key excerpts extracted from the selected source text.', text: sources.map((source) => `${source.title}\n${clean(source.content, 500)}\nCitation: ${sourceLabel(source)}`).join('\n\n') };
    case 'Summary':
      return { kind: 'text', title: 'Source-grounded summary', description: 'A concise summary of the selected sources.', text: sourceLines };
    case 'Reports':
      return { kind: 'text', title: 'Source-grounded report', description: 'An executive report created directly from the selected sources.', text: `# Source-grounded report\n\n## Selected sources\n${sourceLines}\n\n## Extracted metrics\n${metrics.map((metric) => `- ${metric.label}: ${metric.value}`).join('\n')}\n\n## Working conclusion\nThis report is derived from the selected source text and includes citations to the source records used.` };
    default:
      return { kind: 'text', title: 'Source-grounded output', description: 'An artifact created from the selected sources.', text: sourceLines };
  }
}

export function createGroundedTransform(transformType: TransformActionId, sources: GroundedSource[]): TransformResult {
  const artifact = buildArtifact(transformType, sources);
  const content = artifact.text || artifact.description;
  const veritas = generateVeritasReceipt(transformType, sources.length, `${transformType}|${sourceDigest(sources)}|${content}`);
  return {
    transformType,
    content,
    artifact,
    veritas,
    sourcesUsed: sources.map((source) => source.title)
  };
}

export { makeDialogue };
