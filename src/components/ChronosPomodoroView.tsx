import React, { useState, useEffect, useRef } from 'react';
import { UserStats, Quest } from '../types';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CloudRain,
  Flame,
  Radio,
  VolumeX,
  Volume2,
  CheckCircle,
  Coffee,
  BrainCircuit
} from 'lucide-react';

interface ChronosPomodoroViewProps {
  userStats: UserStats;
  selectedQuest: Quest | null;
  onAddFocusMinutes: (minutes: number, xp: number, shards: number) => void;
}

type TimerMode = 'FOCUS' | 'BREAK';
type AmbientSound = 'none' | 'rain' | 'fire' | 'drone';

export const ChronosPomodoroView: React.FC<ChronosPomodoroViewProps> = ({
  userStats,
  selectedQuest,
  onAddFocusMinutes,
}) => {
  const [mode, setMode] = useState<TimerMode>('FOCUS');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAmbient, setActiveAmbient] = useState<AmbientSound>('none');
  const [familiarComment, setFamiliarComment] = useState(
    selectedQuest
      ? `Hoot! Focus your mind upon "${selectedQuest.title}", apprentice!`
      : 'Hoot! Enter the Sanctuary of Chronos. Every second of focus weaves powerful cognitive runes.'
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set preset duration
  const setTimerPreset = (mins: number, targetMode: TimerMode) => {
    sound.playClick();
    setIsRunning(false);
    setMode(targetMode);
    setTotalSeconds(mins * 60);
    setSecondsRemaining(mins * 60);
  };

  // Timer tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, totalSeconds]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === 'FOCUS') {
      const minutesCompleted = Math.round(totalSeconds / 60);
      const earnedXp = minutesCompleted * 4;
      const earnedShards = Math.round(minutesCompleted * 1.2);

      sound.playLevelUp();
      onAddFocusMinutes(minutesCompleted, earnedXp, earnedShards);

      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setFamiliarComment(`Brilliant work! You completed a ${minutesCompleted}m focus incantation and gained +${earnedXp} XP! Time for mana regeneration.`);
      // Switch to break
      setMode('BREAK');
      setTotalSeconds(5 * 60);
      setSecondsRemaining(5 * 60);
    } else {
      sound.playQuestComplete();
      setFamiliarComment('Mana fully restored! Whenever you are ready, summon your next study focus spell.');
      setMode('FOCUS');
      setTotalSeconds(25 * 60);
      setSecondsRemaining(25 * 60);
    }
  };

  // Ambient sound handler
  const handleAmbientChange = (ambient: AmbientSound) => {
    sound.playClick();
    sound.stopAllAmbient();

    if (ambient === activeAmbient || ambient === 'none') {
      setActiveAmbient('none');
      return;
    }

    setActiveAmbient(ambient);
    if (ambient === 'rain') sound.startRainAmbient();
    if (ambient === 'fire') sound.startFireAmbient();
    if (ambient === 'drone') sound.startDroneAmbient();
  };

  // Stop ambient on unmount
  useEffect(() => {
    return () => {
      sound.stopAllAmbient();
    };
  }, []);

  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)));
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span>Sanctuary of Chronos · Deep Work Hourglass</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-slate-100">
            {selectedQuest ? selectedQuest.title : 'Arcane Deep Focus Chamber'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {selectedQuest ? selectedQuest.focusGoal : 'Weave unshakeable concentration with interval spells and synthesized acoustic wards.'}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimerPreset(25, 'FOCUS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              totalSeconds === 25 * 60 && mode === 'FOCUS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => setTimerPreset(50, 'FOCUS')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              totalSeconds === 50 * 60 && mode === 'FOCUS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            50m Deep
          </button>
          <button
            onClick={() => setTimerPreset(5, 'BREAK')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              totalSeconds === 5 * 60 && mode === 'BREAK'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5m Rest
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Hourglass Center (2 columns) */}
        <div className="lg:col-span-2 relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-xl overflow-hidden min-h-[460px]">
          {/* Subtle magical halo */}
          <div className="absolute w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

          {/* Mode Pill Indicator */}
          <div className="mb-4">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 border ${
                mode === 'FOCUS'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {mode === 'FOCUS' ? 'Spell Incantation (Focus)' : 'Mana Well Regeneration (Break)'}
            </span>
          </div>

          {/* Arcane Circular Timer & Hourglass Visual */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 my-2 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-800"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-1000 ${
                  mode === 'FOCUS' ? 'stroke-amber-400' : 'stroke-emerald-400'
                }`}
                strokeWidth="5"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <div className="font-mono-nums text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
                {timeFormatted}
              </div>
              <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono-nums">
                {progressPercent}% channeled
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-4 mt-6 z-10">
            <button
              onClick={() => {
                sound.playClick();
                setSecondsRemaining(totalSeconds);
                setIsRunning(false);
              }}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsRunning(!isRunning);
              }}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
                isRunning
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:shadow-amber-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Incantation</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Channel Focus Spell</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Familiar Companion & Ambient Ward Sidebar (1 column) */}
        <div className="space-y-6">
          {/* Familiar Companion Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-3">
              {/* Whimsical SVG Scholar Owl Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950/40 border border-amber-500/40 flex items-center justify-center p-2 relative shadow-md">
                <svg viewBox="0 0 64 64" className="w-full h-full">
                  {/* Owl body */}
                  <ellipse cx="32" cy="36" rx="20" ry="24" fill="#312e81" />
                  {/* Belly feathers */}
                  <ellipse cx="32" cy="40" rx="13" ry="16" fill="#fef3c7" opacity="0.9" />
                  <path d="M26 36 Q32 39 38 36" stroke="#d97706" strokeWidth="1.5" fill="none" />
                  <path d="M26 42 Q32 45 38 42" stroke="#d97706" strokeWidth="1.5" fill="none" />
                  {/* Eyes & Spectacles */}
                  <circle cx="24" cy="24" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                  <circle cx="40" cy="24" r="7" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="3.5" fill="#0f172a" />
                  <circle cx="40" cy="24" r="3.5" fill="#0f172a" />
                  <line x1="31" y1="24" x2="33" y2="24" stroke="#78350f" strokeWidth="2" />
                  {/* Beak */}
                  <polygon points="32,27 28,32 36,32" fill="#f59e0b" />
                  {/* Tiny Scholar Cap */}
                  <polygon points="32,6 46,14 32,18 18,14" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                  <line x1="46" y1="14" x2="48" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
                </svg>
                {/* Floating particle */}
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping opacity-75" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-cinzel font-bold text-sm text-slate-100">
                    {userStats.familiar.name}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono-nums">
                    Lv.{userStats.familiar.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {userStats.familiar.species} · {userStats.familiar.stage}
                </p>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="relative bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 italic leading-relaxed">
              "{familiarComment}"
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono-nums">
              <span>Happiness: {userStats.familiar.happiness}%</span>
              <span>Total Channeled: {userStats.totalFocusMinutes}m</span>
            </div>
          </div>

          {/* Acoustic Wards (Ambient Soundscape generator) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Acoustic Focus Wards
              </span>
              <span className="text-[11px] text-slate-500 font-mono-nums">
                Synthesized in Browser
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleAmbientChange('rain')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 transition-all cursor-pointer ${
                  activeAmbient === 'rain'
                    ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <CloudRain className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Glass Rain</span>
              </button>

              <button
                onClick={() => handleAmbientChange('fire')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 transition-all cursor-pointer ${
                  activeAmbient === 'fire'
                    ? 'bg-orange-950/40 border-orange-500/50 text-orange-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="font-medium">Hearth Fire</span>
              </button>

              <button
                onClick={() => handleAmbientChange('drone')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs gap-1.5 transition-all cursor-pointer ${
                  activeAmbient === 'drone'
                    ? 'bg-violet-950/40 border-violet-500/50 text-violet-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Radio className="w-5 h-5 text-violet-400" />
                <span className="font-medium">Alpha Waves</span>
              </button>
            </div>

            {activeAmbient !== 'none' && (
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Playing ambient sound
                </span>
                <button
                  onClick={() => handleAmbientChange('none')}
                  className="text-xs text-rose-400 hover:underline cursor-pointer"
                >
                  Turn Off
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
