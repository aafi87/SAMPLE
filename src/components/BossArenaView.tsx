import React, { useState, useEffect } from 'react';
import { Chapter, BossQuiz, BossQuizRound, UserStats } from '../types';
import { sound } from '../utils/soundEffects';
import { generateBossQuizAI } from '../utils/api';
import confetti from 'canvas-confetti';
import {
  Swords,
  Shield,
  Sparkles,
  Heart,
  RotateCcw,
  Zap,
  Award,
  AlertTriangle,
  Wand2,
  ChevronRight
} from 'lucide-react';

interface BossArenaViewProps {
  currentChapter: Chapter | null;
  userStats: UserStats;
  onBossDefeated: (chapterId: string, earnedXp: number, earnedShards: number) => void;
}

export const BossArenaView: React.FC<BossArenaViewProps> = ({
  currentChapter,
  userStats,
  onBossDefeated,
}) => {
  const [bossQuiz, setBossQuiz] = useState<BossQuiz | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  // Combat State
  const [bossHp, setBossHp] = useState(100);
  const [maxBossHp, setMaxBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);

  // Custom Topic Generator Input
  const [customTopic, setCustomTopic] = useState('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Load quiz for chapter
  const loadQuiz = async (topic: string, bossName: string) => {
    setIsLoadingQuiz(true);
    const quiz = await generateBossQuizAI(topic, bossName, 'Adept');
    setBossQuiz(quiz);
    setMaxBossHp(quiz.rounds.length * 35);
    setBossHp(quiz.rounds.length * 35);
    setPlayerHp(100);
    setCurrentRoundIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerSubmitted(false);
    setIsVictory(false);
    setIsDefeated(false);
    setBattleLog([
      `⚔️ Boss duel initiated with ${quiz.bossName}!`,
      `"${quiz.introDialogue}"`
    ]);
    setIsLoadingQuiz(false);
  };

  useEffect(() => {
    const topic = currentChapter?.title || 'Data Structures & Algorithms';
    const bName = currentChapter?.bossName || 'The Chrono-Dragon of Calculus';
    loadQuiz(topic, bName);
  }, [currentChapter]);

  const currentRound: BossQuizRound | undefined = bossQuiz?.rounds[currentRoundIdx];

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    sound.playClick();
    setSelectedAnswerIdx(idx);
  };

  const handleCastAnswer = () => {
    if (selectedAnswerIdx === null || !currentRound || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswerIdx === currentRound.correctIndex;

    if (isCorrect) {
      sound.playBossHit();
      const dmg = currentRound.damageToBoss;
      const nextHp = Math.max(0, bossHp - dmg);
      setBossHp(nextHp);
      setBattleLog((prev) => [
        `💥 CRITICAL HIT! Your spell shattered the boss's defenses for ${dmg} damage!`,
        ...prev
      ]);

      if (nextHp <= 0) {
        handleVictory();
      }
    } else {
      sound.playSpellCast();
      const dmg = 30;
      const nextPlayerHp = Math.max(0, playerHp - dmg);
      setPlayerHp(nextPlayerHp);
      setBattleLog((prev) => [
        `⚠️ INCANTATION MISFIRE! ${currentRound.bossAttackFlavor} You took ${dmg} damage!`,
        ...prev
      ]);

      if (nextPlayerHp <= 0) {
        setIsDefeated(true);
        setBattleLog((prev) => [
          `💀 Your focus was broken! Retreat, rest, and review the sacred texts before challenging again.`,
          ...prev
        ]);
      }
    }
  };

  const handleNextRound = () => {
    sound.playClick();
    if (!bossQuiz) return;
    if (currentRoundIdx + 1 < bossQuiz.rounds.length) {
      setCurrentRoundIdx((prev) => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswerSubmitted(false);
    } else if (bossHp <= 0) {
      handleVictory();
    } else {
      // If questions finished but boss still has hp
      handleVictory();
    }
  };

  const handleVictory = () => {
    sound.playLevelUp();
    setIsVictory(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
      });
    } catch (e) {}

    const xp = 350;
    const shards = 80;
    if (currentChapter) {
      onBossDefeated(currentChapter.id, xp, shards);
    }
    setBattleLog((prev) => [
      `🏆 VICTORY! You defeated ${bossQuiz?.bossName}!`,
      `"${bossQuiz?.defeatDialogue || 'You have proven your academic mastery.'}"`,
      ...prev
    ]);
  };

  const handleSpawnCustomBoss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setIsCustomModalOpen(false);
    await loadQuiz(customTopic.trim(), `The Archon of ${customTopic.trim()}`);
    setCustomTopic('');
  };

  const bossHpPercent = Math.max(0, Math.min(100, Math.round((bossHp / maxBossHp) * 100)));
  const playerHpPercent = Math.max(0, Math.min(100, playerHp));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider mb-1">
            <Swords className="w-4 h-4 text-rose-400" />
            <span>Colosseum of Knowledge · Exam Boss Battle</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-slate-100">
            {bossQuiz?.bossName || 'Summoning Exam Boss...'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dismantle the boss's barriers by casting accurate conceptual counter-spells.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsCustomModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold cursor-pointer transition-all active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5 text-indigo-300" />
          <span>Summon Custom AI Boss</span>
        </button>
      </div>

      {isLoadingQuiz ? (
        <div className="min-h-[420px] flex flex-col items-center justify-center bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
          <h3 className="font-cinzel text-lg font-bold text-slate-200">
            Summoning Exam Boss via Archmage Gemini...
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Synthesizing conceptual trial rounds, weak points, and combat formulas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Battle Arena & Question Card (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Visual Boss Table & Meters */}
            <div className="relative bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-950 border border-rose-950/60 rounded-2xl p-6 shadow-xl overflow-hidden">
              {/* Boss Sprite & HP */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Whimsical Clockwork Dragon / Boss Sprite in SVG */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 border border-rose-500/40 flex items-center justify-center p-2 relative shadow-lg">
                    <svg viewBox="0 0 64 64" className="w-full h-full animate-float-slow">
                      {/* Dragon Horns & Crest */}
                      <path d="M18 12 L24 22 L20 28" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                      <path d="M46 12 L40 22 L44 28" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
                      {/* Head */}
                      <polygon points="32,20 44,32 38,48 26,48 20,32" fill="#881337" stroke="#e11d48" strokeWidth="1.5" />
                      {/* Fiery Eyes */}
                      <ellipse cx="28" cy="32" rx="3" ry="2" fill="#fbbf24" />
                      <ellipse cx="36" cy="32" rx="3" ry="2" fill="#fbbf24" />
                      {/* Clockwork gears */}
                      <circle cx="32" cy="40" r="4" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-slate-100">
                      {bossQuiz?.bossName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-rose-400 font-mono-nums font-semibold">
                        HP: {bossHp} / {maxBossHp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boss HP Bar */}
                <div className="w-full sm:w-48 bg-slate-950 h-3.5 rounded-full overflow-hidden border border-rose-900/60 p-0.5">
                  <div
                    className="bg-gradient-to-r from-rose-600 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${bossHpPercent}%` }}
                  />
                </div>
              </div>

              {/* Player HP & Mana Bar */}
              <div className="flex items-center justify-between gap-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-xs">
                  <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span className="font-semibold text-slate-200">Apprentice Shield</span>
                  <span className="text-emerald-400 font-mono-nums font-semibold">({playerHp}%)</span>
                </div>
                <div className="w-36 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${playerHpPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Victory / Defeat Overlays */}
            {isVictory ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-emerald-200">
                  Exam Boss Vanquished!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  "{bossQuiz?.defeatDialogue}"
                </p>
                <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-mono-nums">
                  <span className="text-amber-400 font-bold">+350 XP Gained</span>
                  <span>·</span>
                  <span className="text-violet-300 font-bold">+80 Arcane Shards</span>
                </div>
                <div>
                  <button
                    onClick={() => {
                      const topic = currentChapter?.title || 'Data Structures';
                      loadQuiz(topic, currentChapter?.bossName || 'Exam Boss');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Duel Another Boss
                  </button>
                </div>
              </div>
            ) : isDefeated ? (
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-rose-200">
                  Shield Depleted!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  The boss overwhelmed your barriers. Review your flashcards and return with restored mana!
                </p>
                <button
                  onClick={() => {
                    const topic = currentChapter?.title || 'Data Structures';
                    loadQuiz(topic, currentChapter?.bossName || 'Exam Boss');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Retry Duel
                </button>
              </div>
            ) : currentRound ? (
              /* Active Combat Question Card */
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-amber-400">
                    Round {currentRoundIdx + 1} of {bossQuiz?.rounds.length}
                  </span>
                  <span className="text-slate-500 font-mono-nums">
                    Damage to Boss: +{currentRound.damageToBoss} HP
                  </span>
                </div>

                <h4 className="text-sm md:text-base font-medium text-slate-100 leading-relaxed">
                  {currentRound.question}
                </h4>

                {/* 4 Choices */}
                <div className="space-y-2.5">
                  {currentRound.options.map((opt, idx) => {
                    let optStyle = 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40 text-slate-200';

                    if (selectedAnswerIdx === idx) {
                      optStyle = 'bg-amber-500/10 border-amber-500 text-amber-200';
                    }

                    if (isAnswerSubmitted) {
                      if (idx === currentRound.correctIndex) {
                        optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                      } else if (selectedAnswerIdx === idx) {
                        optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(idx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all cursor-pointer flex items-start gap-3 ${optStyle}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-xs font-semibold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Post-Answer Explanation Box */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-in fade-in">
                    <span className="font-semibold uppercase tracking-wider text-amber-400 block">
                      Archmage Codex Insight:
                    </span>
                    <p className="leading-relaxed">
                      {currentRound.explanation}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-end pt-2">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleCastAnswer}
                      disabled={selectedAnswerIdx === null}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                        selectedAnswerIdx !== null
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Cast Counter-Spell
                    </button>
                  ) : (
                    <button
                      onClick={handleNextRound}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      <span>Next Combat Phase</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Battle Combat Log (1 Column) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Combat Chronicle
                </span>
                <span className="text-[11px] text-slate-500 font-mono-nums">
                  Live Battle
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 text-xs">
                {battleLog.map((log, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300 leading-relaxed font-sans-clean"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 italic">
                Defeating chapter bosses unlocks rare Arcane Shards & character titles.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom AI Boss Summon Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                Summon Custom AI Exam Boss
              </h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSpawnCustomBoss} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Exam / Subject Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Electrodynamics, Organic Chemistry Mechanisms..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <p className="text-xs text-slate-400 italic">
                Gemini will dynamically spawn a themed exam boss with custom dialogues, attack flavors, and conceptual quiz rounds.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Summon Boss
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
