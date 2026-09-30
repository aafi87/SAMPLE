import React from 'react';
import { UserStats, StudyPlan } from '../types';
import { sound } from '../utils/soundEffects';
import { Volume2, VolumeX, Sparkles, Flame, Zap, ShieldAlert, BookOpen } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'map' | 'quests' | 'pomodoro' | 'boss' | 'flashcards' | 'skills';
  setActiveTab: (tab: 'map' | 'quests' | 'pomodoro' | 'boss' | 'flashcards' | 'skills') => void;
  userStats: UserStats;
  currentPlan: StudyPlan | null;
  onOpenForge: () => void;
  onOpenScribe: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  userStats,
  currentPlan,
  onOpenForge,
  onOpenScribe,
  isMuted,
  onToggleMute,
}) => {
  const xpPercent = Math.min(100, Math.round((userStats.xp / userStats.xpToNextLevel) * 100));

  const navItems: { id: HeaderNavProps['activeTab']; label: string }[] = [
    { id: 'map', label: 'Realm Map' },
    { id: 'quests', label: 'Quest Log' },
    { id: 'pomodoro', label: 'Focus Sanctuary' },
    { id: 'boss', label: 'Boss Arena' },
    { id: 'flashcards', label: 'Alchemical Cards' },
    { id: 'skills', label: 'Skill Tree' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
              Aetheria
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(item.id);
                }}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Character HUD & Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Streak Indicator */}
          <div
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-semibold tabular-nums"
            title={`${userStats.streakDays} Day Study Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{userStats.streakDays}d Streak</span>
          </div>

          {/* Level & XP Bar */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs">
            <span className="font-cinzel font-bold text-amber-400 whitespace-nowrap">
              Lv.{userStats.level}
            </span>
            <div className="w-16 hidden md:block bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="font-mono-nums text-[10px] text-slate-400 hidden xl:inline">
              {userStats.xp}/{userStats.xpToNextLevel}
            </span>
          </div>

          {/* Shards (Currency) */}
          <div
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-mono-nums"
            title="Arcane Shards"
          >
            <Zap className="w-3 h-3 text-violet-400 fill-violet-400" />
            <span>{userStats.shards}</span>
          </div>

          {/* AI Archmage Scribe Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenScribe();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium cursor-pointer transition-all hover:scale-105 active:scale-95"
            title="Consult Archmage AI Companion"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span className="hidden sm:inline">Archmage AI</span>
          </button>

          {/* AI Study Plan Forge Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenForge();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold cursor-pointer transition-all shadow-sm hover:shadow-amber-500/20 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Forge Plan</span>
          </button>

          {/* Mute Audio Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex lg:hidden overflow-x-auto gap-2 mt-2 pt-2 border-t border-slate-800/80 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(item.id);
              }}
              className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
