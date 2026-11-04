/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.COMPONENT
 * TAG: LEEWAY.APP.UI.COMPONENT.TRANSFORMRESULT
 * WHAT: In-app source transformation artifact viewer.
 * WHY: Show the artifact created by each Turn Sources Into action without a fake handoff.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/components/TransformResultModal.tsx
 * WHEN: 2026-11-04 source transformation repair.
 * HOW: Render grounded text, tables, slides, maps, audio, and video directly in the browser.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Check,
  Copy,
  Download,
  Headphones,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { TransformArtifact, TransformResult, TransformSlide } from '../types';
import {
  createHtmlDeckBlob,
  createOdpBlob,
  createSpreadsheetBlob,
  downloadBlob,
  downloadText
} from '../officeExports';

interface TransformResultModalProps {
  result: TransformResult | null;
  onClose: () => void;
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  text.split(/\s+/).forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  });
  if (line) lines.push(line);
  return lines;
}

async function renderVideo(slides: TransformSlide[]): Promise<Blob> {
  if (!('MediaRecorder' in window) || !HTMLCanvasElement.prototype.captureStream) {
    throw new Error('This browser does not support browser video rendering.');
  }
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 540;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas rendering is unavailable.');
  const stream = canvas.captureStream(30);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
  const stopped = new Promise<void>((resolve) => { recorder.onstop = () => resolve(); });
  recorder.start();

  for (const slide of slides) {
    const started = performance.now();
    while (performance.now() - started < 1800) {
      ctx.fillStyle = '#071324';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 38px Arial';
      ctx.fillText(slide.title.slice(0, 40), 70, 100);
      ctx.fillStyle = '#a5f3fc';
      ctx.font = '20px Arial';
      ctx.fillText(slide.subtitle.slice(0, 70), 70, 145);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '22px Arial';
      slide.bullets.slice(0, 5).forEach((bullet, index) => {
        const lines = wrapCanvasText(ctx, `• ${bullet}`, 780);
        lines.forEach((line, lineIndex) => ctx.fillText(line, 90, 215 + index * 55 + lineIndex * 27));
      });
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Arial';
      ctx.fillText('Created in LeeWay Office Suites from selected sources', 70, 500);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  }
  recorder.stop();
  await stopped;
  stream.getTracks().forEach((track) => track.stop());
  return new Blob(chunks, { type: 'video/webm' });
}

const VideoArtifact: React.FC<{ slides: TransformSlide[] }> = ({ slides }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoUrlRef = useRef<string | null>(null);

  const createVideo = async () => {
    setRendering(true);
    setError(null);
    try {
      const blob = await renderVideo(slides);
      setVideoUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        const nextUrl = URL.createObjectURL(blob);
        videoUrlRef.current = nextUrl;
        return nextUrl;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video rendering failed.');
    } finally {
      setRendering(false);
    }
  };

  useEffect(() => {
    void createVideo();
    return () => {
      if (videoUrlRef.current) URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4">
        {videoUrl ? <video className="w-full rounded-lg bg-black" controls src={videoUrl} /> : <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">{rendering ? 'Rendering source-grounded video…' : 'Video preview unavailable'}</div>}
      </div>
      <div className="flex items-center gap-2">
        {videoUrl && <a className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white" href={videoUrl} download="leeway-video-overview.webm">Download .WEBM</a>}
        <button onClick={() => void createVideo()} disabled={rendering} className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 disabled:opacity-50">{rendering ? 'Rendering…' : 'Render again'}</button>
      </div>
      {error && <p className="text-xs text-amber-300">{error} The storyboard remains available below.</p>}
      <div className="grid gap-2 sm:grid-cols-2">{slides.map((slide) => <div key={slide.title} className="rounded-lg border border-slate-800 bg-slate-950 p-3"><strong className="text-cyan-300">{slide.title}</strong><p className="mt-1 text-[11px] text-slate-400">{slide.subtitle}</p></div>)}</div>
    </div>
  );
};

const MindMapArtifact: React.FC<{ artifact: TransformArtifact }> = ({ artifact }) => {
  const nodes = artifact.nodes || [];
  const sourceNodes = nodes.filter((node) => node.parentId === 'root');
  return (
    <svg viewBox="0 0 900 520" className="w-full rounded-xl border border-purple-500/30 bg-slate-950 p-3" role="img" aria-label="Generated source-grounded mind map">
      <line x1="450" y1="70" x2="450" y2="150" stroke="#22d3ee" strokeWidth="3" />
      <rect x="330" y="25" width="240" height="70" rx="18" fill="#0e7490" stroke="#67e8f9" />
      <text x="450" y="67" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Selected sources</text>
      {sourceNodes.map((source, index) => {
        const x = sourceNodes.length === 1 ? 450 : 100 + index * (700 / Math.max(1, sourceNodes.length - 1));
        const topics = nodes.filter((node) => node.parentId === source.id);
        return <g key={source.id}><line x1="450" y1="95" x2={x} y2="150" stroke="#a855f7" strokeWidth="2" /><rect x={x - 100} y="150" width="200" height="52" rx="12" fill="#312e81" stroke="#c4b5fd" /><text x={x} y="182" textAnchor="middle" fill="white" fontSize="14">{source.label.slice(0, 24)}</text>{topics.map((topic, topicIndex) => <g key={topic.id}><line x1={x} y1="202" x2={x - 70 + topicIndex * 70} y2="270" stroke="#64748b" /><rect x={x - 130 + topicIndex * 70} y="270" width="120" height="42" rx="10" fill="#172554" stroke="#60a5fa" /><text x={x - 70 + topicIndex * 70} y="296" textAnchor="middle" fill="#dbeafe" fontSize="10">{topic.label.slice(0, 17)}</text></g>)}</g>;
      })}
    </svg>
  );
};

const ArtifactBody: React.FC<{ artifact: TransformArtifact }> = ({ artifact }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const slides = artifact.slides || [];

  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  if (artifact.kind === 'video') return <VideoArtifact slides={slides} />;
  if (artifact.kind === 'mindmap') return <MindMapArtifact artifact={artifact} />;
  if (artifact.kind === 'audio') {
    const dialogue = artifact.dialogue || [];
    const play = () => {
      if (!('speechSynthesis' in window)) return;
      if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
      const utterance = new SpeechSynthesisUtterance(dialogue.map((turn) => `${turn.speaker}: ${turn.text}`).join(' '));
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    };
    return <div className="space-y-3"><div className="flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-950/30 p-4"><Headphones className="h-7 w-7 text-purple-300" /><div className="flex-1"><strong className="text-white">Browser-local audio overview</strong><p className="text-xs text-slate-400">Two-host source briefing using the selected source text.</p></div><button onClick={play} className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white">{isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{isSpeaking ? 'Pause' : 'Play'}</button></div>{dialogue.map((turn) => <div key={turn.timestamp + turn.speaker} className="rounded-lg border border-slate-800 bg-slate-950 p-3"><div className="mb-1 flex justify-between text-[10px] font-mono text-purple-300"><span>{turn.speaker}</span><span>{turn.timestamp}</span></div><p className="text-xs text-slate-200">{turn.text}</p></div>)}</div>;
  }
  if (artifact.kind === 'slides') {
    const slide = slides[slideIndex] || slides[0];
    return <div className="space-y-3"><div className="min-h-64 rounded-xl border border-rose-500/30 bg-gradient-to-br from-[#071324] to-slate-950 p-8"><h4 className="text-2xl font-black text-cyan-300">{slide?.title}</h4><p className="mt-2 text-sm text-cyan-100">{slide?.subtitle}</p><ul className="mt-8 space-y-3 text-sm text-slate-200">{slide?.bullets.map((bullet) => <li key={bullet}>• {bullet}</li>)}</ul></div><div className="flex items-center justify-between"><button onClick={() => setSlideIndex((index) => Math.max(index - 1, 0))} disabled={slideIndex === 0} className="rounded-lg bg-slate-800 px-3 py-2 text-xs disabled:opacity-40">Previous</button><span className="text-xs text-slate-400">Slide {slideIndex + 1} of {slides.length}</span><button onClick={() => setSlideIndex((index) => Math.min(index + 1, slides.length - 1))} disabled={slideIndex >= slides.length - 1} className="rounded-lg bg-slate-800 px-3 py-2 text-xs disabled:opacity-40">Next</button></div></div>;
  }
  if (artifact.kind === 'table' || artifact.kind === 'timeline') return <div className="overflow-auto rounded-xl border border-blue-500/30"><table className="min-w-full text-left text-xs"><thead className="bg-blue-950/50 text-blue-200"><tr>{['Source', 'Type', 'Pages', 'Updated', 'Category', 'Summary'].map((heading) => <th key={heading} className="px-3 py-2">{heading}</th>)}</tr></thead><tbody>{(artifact.rows || []).map((row) => <tr key={row.source} className="border-t border-slate-800"><td className="px-3 py-2 text-cyan-200">{row.source}</td><td className="px-3 py-2">{row.type}</td><td className="px-3 py-2">{row.pages}</td><td className="px-3 py-2">{row.updated}</td><td className="px-3 py-2">{row.category}</td><td className="px-3 py-2 text-slate-400">{row.summary}</td></tr>)}</tbody></table></div>;
  if (artifact.kind === 'infographic') return <div className="grid gap-3 sm:grid-cols-2">{(artifact.metrics || []).map((metric) => <div key={metric.label} className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-slate-950 p-5"><BarChart3 className="mb-3 h-5 w-5 text-amber-300" /><div className="text-3xl font-black text-white">{metric.value}</div><div className="mt-1 text-sm font-bold text-amber-200">{metric.label}</div><div className="mt-2 text-[11px] text-slate-400">{metric.detail}</div></div>)}</div>;
  if (artifact.kind === 'cards') return <div className="grid gap-3 sm:grid-cols-2">{(artifact.cards || []).map((card) => <details key={card.question} className="rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-4"><summary className="cursor-pointer text-sm font-bold text-yellow-100">{card.question}</summary><p className="mt-3 text-xs text-slate-200">{card.answer}</p><p className="mt-2 text-[10px] text-cyan-300">{card.source}</p></details>)}</div>;
  if (artifact.kind === 'quiz') return <div className="space-y-3">{(artifact.questions || []).map((question) => <details key={question.question} className="rounded-xl border border-cyan-500/30 bg-slate-950 p-4"><summary className="cursor-pointer text-sm font-bold text-white">{question.question}</summary><ul className="mt-3 space-y-1 text-xs text-slate-300">{question.options.map((option) => <li key={option}>○ {option}</li>)}</ul><p className="mt-3 text-xs font-bold text-emerald-300">Answer: {question.answer}</p></details>)}</div>;
  return <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">{artifact.text || artifact.description}</pre>;
};

export const TransformResultModal: React.FC<TransformResultModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!result) return null;
  const artifact = result.artifact || { kind: 'text' as const, title: result.transformType, description: 'Grounded output', text: result.content };
  const artifactText = artifact.text || result.content;
  const handleCopy = () => {
    void navigator.clipboard.writeText(artifactText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  const handleDownload = async () => {
    const safeName = result.transformType.toLowerCase().replace(/\s+/g, '-');
    if (artifact.kind === 'slides' && artifact.slides) {
      downloadBlob(createHtmlDeckBlob(artifact.title, artifact.slides), `leeway-${safeName}.html`);
      return;
    }
    if (artifact.kind === 'table' && artifact.rows) {
      const rows = [['Source', 'Type', 'Pages', 'Updated', 'Category', 'Summary'], ...artifact.rows.map((row) => [row.source, row.type, row.pages, row.updated, row.category, row.summary])];
      downloadBlob(createSpreadsheetBlob('Sources', rows, 'xlsx'), `leeway-${safeName}.xlsx`);
      return;
    }
    downloadText(artifactText, `leeway-${safeName}.txt`);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"><div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl"><div className="flex items-center justify-between border-b border-cyan-500/20 bg-slate-950 px-6 py-3.5"><div className="flex items-center gap-2.5"><Sparkles className="h-4 w-4 text-cyan-400" /><div><h3 className="text-sm font-bold tracking-wide text-white">{artifact.title}</h3><p className="text-[10px] text-slate-400">{artifact.description}</p></div></div><button aria-label="Close generated artifact" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-4 w-4" /></button></div><div className="flex items-center justify-between border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-slate-950 px-6 py-2 text-[11px] font-mono text-cyan-300"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-400" />Grounded receipt: {result.veritas.hash}</span><span>Sources: <strong>{result.veritas.groundedSourcesCount}</strong></span></div><div className="flex-1 overflow-y-auto bg-slate-900/60 p-6"><ArtifactBody artifact={artifact} /></div><div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-3 text-xs"><div className="flex items-center gap-2"><button aria-label="Copy generated artifact" onClick={handleCopy} className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-medium text-slate-200">{copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}{copied ? 'Copied' : 'Copy'}</button><button aria-label="Download generated artifact" onClick={() => void handleDownload()} className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 font-medium text-slate-200"><Download className="h-3.5 w-3.5 text-slate-400" />Download artifact</button>{artifact.kind === 'slides' && artifact.slides && <button onClick={async () => downloadBlob(await createOdpBlob(artifact.title, artifact.slides || []), 'leeway-slide-deck.odp')} className="rounded-lg bg-rose-950 px-3 py-1.5 font-medium text-rose-200">Download .ODP</button>}</div><span className="text-[10px] text-slate-500">Created directly from selected sources</span></div></div></div>;
};
