import React, { useState, useEffect } from 'react';
import { Flashcard, UserStats } from '../types';
import { sound } from '../utils/soundEffects';
import { generateFlashcardsAI } from '../utils/api';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCw,
  Plus,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Layers,
  Wand2,
  Calendar,
  Zap
} from 'lucide-react';

interface AlchemicalFlashcardsViewProps {
  flashcards: Flashcard[];
  onUpdateFlashcards: (updated: Flashcard[]) => void;
  userStats: UserStats;
  onAddXpAndShards: (xp: number, shards: number) => void;
}

export const AlchemicalFlashcardsView: React.FC<AlchemicalFlashcardsViewProps> = ({
  flashcards,
  onUpdateFlashcards,
  userStats,
  onAddXpAndShards,
}) => {
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBrewModalOpen, setIsBrewModalOpen] = useState(false);
  const [brewTopic, setBrewTopic] = useState('');
  const [isBrewing, setIsBrewing] = useState(false);

  const currentCard = flashcards[currentCardIdx];

  // Flip card
  const handleFlip = () => {
    sound.playCardFlip();
    setIsFlipped(!isFlipped);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleRateCard('again');
        if (e.key === '2') handleRateCard('hard');
        if (e.key === '3') handleRateCard('good');
        if (e.key === '4') handleRateCard('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentCardIdx, flashcards]);

  // SM-2 Spaced Repetition rating
  const handleRateCard = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    sound.playClick();

    let newInterval = currentCard.interval;
    let newEase = currentCard.easeFactor;
    let newMastery: number = currentCard.masteryLevel;
    let xp = 15;
    let shards = 2;

    if (rating === 'again') {
      newInterval = 1;
      newEase = Math.max(1.3, newEase - 0.2);
      newMastery = Math.max(0, newMastery - 1);
    } else if (rating === 'hard') {
      newInterval = Math.max(1, Math.round(newInterval * 1.2));
      newEase = Math.max(1.3, newEase - 0.15);
      xp = 20;
    } else if (rating === 'good') {
      newInterval = Math.round(newInterval * newEase);
      newMastery = Math.min(5, newMastery + 1);
      xp = 30;
      shards = 4;
    } else if (rating === 'easy') {
      newInterval = Math.round(newInterval * (newEase + 0.3));
      newEase = Math.min(3.0, newEase + 0.15);
      newMastery = Math.min(5, newMastery + 2);
      xp = 45;
      shards = 8;
    }

    const nextDate = new Date(Date.now() + newInterval * 86400000).toISOString().split('T')[0];

    const updated = flashcards.map((c, idx) => {
      if (idx !== currentCardIdx) return c;
      return {
        ...c,
        interval: newInterval,
        easeFactor: newEase,
        reviews: c.reviews + 1,
        nextReviewDate: nextDate,
        masteryLevel: (newMastery as 0 | 1 | 2 | 3 | 4 | 5),
      };
    });

    onUpdateFlashcards(updated);
    onAddXpAndShards(xp, shards);

    // Advance to next card
    setIsFlipped(false);
    if (currentCardIdx + 1 < flashcards.length) {
      setCurrentCardIdx((prev) => prev + 1);
    } else {
      // Completed deck review
      sound.playQuestComplete();
      setCurrentCardIdx(0);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  // Brew AI deck
  const handleBrewDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brewTopic.trim()) return;

    sound.playClick();
    setIsBrewing(true);
    const newCards = await generateFlashcardsAI(brewTopic.trim(), 5);
    onUpdateFlashcards([...flashcards, ...newCards]);
    setIsBrewing(false);
    setIsBrewModalOpen(false);
    setBrewTopic('');
  };

  const masteryLabels = ['Untested', 'Novice', 'Apprentice', 'Scholar', 'Adept', 'Master'];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Alchemical Crucible · Spaced Repetition</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-slate-100">
            Memory Transmutation Decks
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{flashcards.length} Total Cards</span>
            <span>·</span>
            <span>Active Card {currentCardIdx + 1} of {flashcards.length}</span>
            <span>·</span>
            <span className="text-amber-400 font-semibold">SM-2 Spaced Recall</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsBrewModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Brew AI Deck with Gemini</span>
        </button>
      </div>

      {/* 3D Flashcard Stage */}
      {currentCard ? (
        <div className="flex flex-col items-center">
          <div
            onClick={handleFlip}
            className="w-full min-h-[340px] max-w-2xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 border border-amber-500/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl cursor-pointer hover:border-amber-500/60 transition-all select-none relative group"
          >
            {/* Top Card Metadata */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-amber-300 uppercase tracking-wider">
                {currentCard.topic}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono-nums text-[11px]">
                  Mastery: {masteryLabels[currentCard.masteryLevel]}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-slate-500">
                  {isFlipped ? 'Answer' : 'Question (Click or Space to flip)'}
                </span>
              </div>
            </div>

            {/* Main Card Content */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              {!isFlipped ? (
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-slate-100 leading-relaxed max-w-xl">
                    {currentCard.front}
                  </h3>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="text-sm md:text-base text-slate-200 leading-relaxed max-w-xl whitespace-pre-line text-left">
                    {currentCard.back}
                  </div>

                  {currentCard.mnemonic && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-left">
                      <span className="font-semibold uppercase tracking-wider block text-[10px] text-amber-400 mb-0.5">
                        ✨ Mnemonic Spell:
                      </span>
                      "{currentCard.mnemonic}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
              <span className="font-mono-nums">
                Next Review in {currentCard.interval} days
              </span>
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-amber-300 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </span>
            </div>
          </div>

          {/* SM-2 Recall Feedback Buttons (Visible when flipped) */}
          <div className="mt-6 w-full max-w-2xl">
            {isFlipped ? (
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleRateCard('again')}
                  className="p-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex flex-col items-center"
                >
                  <span>1. Again</span>
                  <span className="text-[10px] text-rose-300 font-mono-nums mt-0.5">1d (Reset)</span>
                </button>

                <button
                  onClick={() => handleRateCard('hard')}
                  className="p-3 rounded-xl bg-orange-950/60 hover:bg-orange-900/70 border border-orange-500/40 text-orange-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex flex-col items-center"
                >
                  <span>2. Hard</span>
                  <span className="text-[10px] text-orange-300 font-mono-nums mt-0.5">+{currentCard.interval}d</span>
                </button>

                <button
                  onClick={() => handleRateCard('good')}
                  className="p-3 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-500/40 text-indigo-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex flex-col items-center"
                >
                  <span>3. Good</span>
                  <span className="text-[10px] text-indigo-300 font-mono-nums mt-0.5">+{Math.round(currentCard.interval * 2)}d</span>
                </button>

                <button
                  onClick={() => handleRateCard('easy')}
                  className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold cursor-pointer transition-all active:scale-95 flex flex-col items-center"
                >
                  <span>4. Easy</span>
                  <span className="text-[10px] text-emerald-300 font-mono-nums mt-0.5">+{Math.round(currentCard.interval * 3)}d</span>
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-500">
                Tip: Press <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-nums">Space</kbd> to flip, then <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-nums">1</kbd>-<kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-nums">4</kbd> to rate recall difficulty.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">No flashcards found in this deck.</p>
        </div>
      )}

      {/* Brew Deck AI Modal */}
      {isBrewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                Brew AI Alchemical Flashcards
              </h3>
              <button
                onClick={() => setIsBrewModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBrewDeck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Card Deck Topic / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus (Raft/Paxos), Krebs Cycle..."
                  value={brewTopic}
                  onChange={(e) => setBrewTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <p className="text-xs text-slate-400 italic">
                Gemini will extract high-yield concept questions and author memorable mnemonic rhymes for rapid retention.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBrewModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBrewing}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isBrewing ? 'Transmuting...' : 'Brew Cards'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
