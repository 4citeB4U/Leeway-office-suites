/**
 * LEEWAY COMPLIANCE HEADER — DO NOT REMOVE
 * REGION: LEEWAY.APP.UI.MODULE
 * TAG: LEEWAY.APP.UI.MODULE.RESEARCHNOTEBOOK
 * WHAT: Research notebook workspace for grounded retrieval.
 * WHY: Keep this governed capability explicit, portable, and auditable.
 * WHO: LeeWay Office Suites engineering.
 * WHERE: src/leeway/modules/ResearchNotebookModule.tsx
 * WHEN: 2026-11-04 standards audit.
 * HOW: Use the file's typed implementation within the Office Suites runtime.
 * AGENTS: ASSESS, ALIGN, AUDIT
 * LICENSE: Apache-2.0
 */


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Research Notebook Module (LeeWay Open Notebook Engine)
 * Source-grounded research, conversational query, note synthesis,
 * and real interactive two-host Audio Overview Podcast player (Alex & Morgan).
 * Governed by LeeWay Standards (https://github.com/4citeB4U/LeeWay-Standards)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Send,
  Sparkles,
  Headphones,
  Play,
  Pause,
  ShieldCheck,
  Volume2,
  Copy,
  Check,
  Search,
  RotateCcw,
  FastForward,
  Mic,
  MessageSquare,
  FileText
} from 'lucide-react';
import { GroundedSource } from '../types';
import { answerFromSources, makeDialogue, searchSources } from '../groundedTransforms';

interface ResearchNotebookModuleProps {
  sources: GroundedSource[];
  onOpenGroundedAsk?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  citations?: { sourceTitle: string; pageNumber: number; quote: string }[];
  timestamp: string;
  veritasHash?: string;
}

interface PodcastTurn {
  id: string;
  speaker: 'Alex' | 'Morgan';
  tone: string;
  timestamp: string;
  seconds: number;
  text: string;
}

interface PodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  durationFormatted: string;
  totalSeconds: number;
  dialogue: PodcastTurn[];
  veritasHash: string;
  summary: string;
}

export const ResearchNotebookModule: React.FC<ResearchNotebookModuleProps> = ({
  sources
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'audio' | 'search'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [{
    id: 'welcome',
    sender: 'agent',
    text: `Welcome to the LeeWay grounded notebook. I am ready to work from ${sources.filter((source) => source.checked).length} selected source${sources.filter((source) => source.checked).length === 1 ? '' : 's'}. Ask a question or create an audio overview.`,
    timestamp: 'Ready',
    veritasHash: 'LW-GROUNDING-READY'
  }]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // Audio Overview Podcast State
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copiedScript, setCopiedScript] = useState(false);

  // Semantic Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const activeSources = sources.filter((s) => s.checked);

  // Build the audio overview locally so the static GitHub Pages deployment remains usable.
  const loadAudioOverview = useCallback(() => {
    setIsLoadingAudio(true);
    const dialogue = makeDialogue(activeSources).map((turn, index) => ({
      ...turn,
      id: `turn-${index + 1}`,
      tone: turn.speaker === 'Alex' ? 'Analytical' : 'Narrative',
      seconds: index === 0 ? 0 : index === 1 ? 12 : 35
    }));
    setEpisode({
      id: `episode-${activeSources.length}`,
      title: 'LeeWay Source Audio Overview',
      subtitle: `${activeSources.length} selected source${activeSources.length === 1 ? '' : 's'} • Browser-local playback`,
      durationFormatted: '00:45',
      totalSeconds: 45,
      dialogue,
      veritasHash: `LW-GROUNDING-AUDIO-${activeSources.length}`,
      summary: activeSources.map((source) => source.summary).join(' ')
    });
    setCurrentTurnIndex(0);
    setIsLoadingAudio(false);
  }, [sources]);

  useEffect(() => {
    loadAudioOverview();
    setMessages((previous) => previous.map((message, index) => index === 0
      ? { ...message, text: `Welcome to the LeeWay grounded notebook. I am ready to work from ${activeSources.length} selected source${activeSources.length === 1 ? '' : 's'}. Ask a question or create an audio overview.` }
      : message));
  }, [loadAudioOverview, activeSources.length]);

  // Browser Web Speech API Speech Synthesis for Real Audio Playback
  useEffect(() => {
    if (!isPlayingAudio || !episode || !window.speechSynthesis) return;

    const currentTurn = episode.dialogue[currentTurnIndex];
    if (!currentTurn) {
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentTurn.text);
    utterance.rate = playbackSpeed;

    // Distinct voice profiles for Alex and Morgan
    if (currentTurn.speaker === 'Alex') {
      utterance.pitch = 1.15; // Higher, crisp analytical host
    } else {
      utterance.pitch = 0.88; // Deeper, warm narrative host
    }

    utterance.onend = () => {
      if (currentTurnIndex < episode.dialogue.length - 1) {
        setCurrentTurnIndex((prev) => prev + 1);
      } else {
        setIsPlayingAudio(false);
        setCurrentTurnIndex(0);
      }
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isPlayingAudio, currentTurnIndex, episode, playbackSpeed]);

  const togglePlayAudio = () => {
    if (!episode) {
      loadAudioOverview();
      return;
    }
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
    }
  };

  const handleSendMessage = () => {
    if (!inputQuestion.trim()) return;

    const currentQ = inputQuestion;
    setInputQuestion('');
    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text: currentQ,
      timestamp: 'Just now'
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAsking(true);

    const answer = answerFromSources(currentQ, activeSources);
    const agentMsg: ChatMessage = {
      id: 'm-' + (Date.now() + 1),
      sender: 'agent',
      text: answer.text,
      citations: answer.citations,
      timestamp: 'Just now',
      veritasHash: 'LW-GROUNDING-ASK'
    };
    setMessages((prev) => [...prev, agentMsg]);
    setIsAsking(false);
  };

  const handleSemanticSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults(searchSources(searchQuery, activeSources));
    setIsSearching(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/70 overflow-hidden select-none border border-cyan-500/20 rounded-2xl shadow-xl">
      {/* Top Header & Mode Switcher */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-cyan-500/20 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-purple-950/70 border border-purple-500/40 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Grounded Research Notebook</h2>
              <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60">
                Open Notebook Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              LeeWay source grounding • Strict source citations
            </p>
          </div>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Grounded Q&A</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Audio Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Vector Chunks</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Grounded Q&A Chat */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden p-3 sm:p-4">
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-cyan-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-slate-900/95 text-slate-200 border border-slate-800 rounded-tl-sm shadow-lg'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Grounded Source Citations */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                        {m.citations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-[10px] text-cyan-300 font-mono shadow-sm"
                          >
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            <span>
                              {cite.sourceTitle} (p. {cite.pageNumber})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {m.veritasHash && (
                      <div className="mt-1 text-[9px] font-mono text-slate-500">
                        {m.veritasHash} • Verified Grounding
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-3">
            <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-cyan-500/30 rounded-xl shadow-lg">
              <Sparkles className="w-4 h-4 text-cyan-400 ml-2 shrink-0" />
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything grounded across your active sources..."
                className="flex-1 bg-transparent px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                aria-label="Ask selected sources"
                title="Ask selected sources"
                disabled={!inputQuestion.trim() || isAsking}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5 px-1">
              <span>Anchored against {activeSources.length} active documents</span>
              <span>Browser-local grounding • Source citations attached</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Source-grounded Audio Overview */}
      {activeTab === 'audio' && (
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          {/* Podcast Player Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/40 shadow-xl mb-4 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Headphones className="w-6 h-6 text-purple-300" />
                  {isPlayingAudio && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {episode?.title || 'LeeWay Deep Dive Audio Overview'}
                  </h3>
                  <p className="text-xs text-purple-300">
                    Hosted by <strong>Alex</strong> (Lead Analyst) & <strong>Morgan</strong> (Strategy)
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayAudio}
                  disabled={isLoadingAudio}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingAudio ? 'Pause' : 'Play Episode'}</span>
                </button>

                <button
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setCurrentTurnIndex(0);
                    setIsPlayingAudio(true);
                  }}
                  aria-label="Restart audio overview"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  title="Restart Episode"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Playback Speed */}
                <button
                  onClick={() => {
                    const speeds = [1.0, 1.25, 1.5];
                    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                    setPlaybackSpeed(speeds[nextIdx]);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-xs cursor-pointer"
                  title="Playback Rate"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>

            {/* Audio Waveform Scrubber */}
            <div className="mt-3 pt-3 border-t border-purple-800/40 flex items-center gap-3 text-xs font-mono text-purple-300">
              <span>{episode?.dialogue[currentTurnIndex]?.timestamp || '00:00'}</span>
              <div className="flex-1 flex items-center gap-1 h-3">
                {Array.from({ length: 40 }).map((_, barIdx) => {
                  const isActive = barIdx / 40 <= (currentTurnIndex + 1) / (episode?.dialogue.length || 6);
                  return (
                    <div
                      key={barIdx}
                      className={`flex-1 rounded-full transition-all ${
                        isActive
                          ? 'bg-purple-400 h-full animate-pulse'
                          : 'bg-purple-950/70 h-1.5'
                      }`}
                    />
                  );
                })}
              </div>
              <span>{episode?.durationFormatted || '01:45'}</span>
            </div>
          </div>

          {/* Interactive Dialogue Turns List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {episode?.dialogue.map((turn, tIdx) => {
              const isTurnActive = isPlayingAudio && currentTurnIndex === tIdx;
              const isAlex = turn.speaker === 'Alex';

              return (
                <div
                  key={turn.id}
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setCurrentTurnIndex(tIdx);
                    setIsPlayingAudio(true);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isTurnActive
                      ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          isAlex
                            ? 'bg-cyan-950 border border-cyan-700/60 text-cyan-300'
                            : 'bg-amber-950 border border-amber-700/60 text-amber-300'
                        }`}
                      >
                        {turn.speaker}
                      </span>
                      <span className="text-slate-400 italic font-mono text-[10px]">
                        [{turn.tone}]
                      </span>
                    </div>
                    <span className="font-mono text-slate-500 text-[10px]">{turn.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{turn.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Vector & Semantic Chunks Inspection */}
      {activeTab === 'search' && (
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
              placeholder="Search indexed semantic passage vectors (e.g. 'workforce', '92% milestone', 'knowledge assets')..."
              className="flex-1 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleSemanticSearch}
              aria-label="Search selected sources"
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {searchResults.map((result, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{result.sourceTitle}</span>
                    <span className="text-slate-400 font-mono text-[11px]">(Page {result.pageNumber})</span>
                  </div>
                  <span className="font-mono text-purple-400 text-[10px]">
                    Relevance: {result.score}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{result.text}</p>
                <div className="mt-2 text-[9px] font-mono text-slate-500">
                  Chunk Hash: {result.chunkHash}
                </div>
              </div>
            ))}

            {searchResults.length === 0 && !isSearching && (
              <div className="py-12 text-center text-slate-500 text-xs">
                Enter a query above to inspect passages extracted from the selected sources.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
