import React from 'react';
import { UserStats, SkillNode } from '../types';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
  Award,
  Flame,
  Shield,
  Clock,
  BookOpen
} from 'lucide-react';

interface SkillConstellationViewProps {
  userStats: UserStats;
  skills: SkillNode[];
  onUnlockSkill: (skillId: string, cost: number) => void;
}

export const SkillConstellationView: React.FC<SkillConstellationViewProps> = ({
  userStats,
  skills,
  onUnlockSkill,
}) => {
  const handleUnlock = (skill: SkillNode) => {
    if (skill.unlocked) return;
    if (userStats.shards < skill.cost) return;

    sound.playLevelUp();
    onUnlockSkill(skill.id, skill.cost);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {}
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Character Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-950 via-slate-900 to-amber-950/40 border border-amber-500/40 flex items-center justify-center p-2 shadow-lg">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-cinzel text-xl md:text-2xl font-bold text-slate-100">
                {userStats.characterClass}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-cinzel font-bold">
                Level {userStats.level}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Apprentice to the Grand Archmage of Aetheria. Constellation attuned.
            </p>
          </div>
        </div>

        {/* Shards & Stats */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">Arcane Shards</span>
            <span className="font-mono-nums font-bold text-violet-300 text-base flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
              {userStats.shards}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">Study Streak</span>
            <span className="font-mono-nums font-bold text-orange-400 text-base flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              {userStats.streakDays}d
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">Focus Logged</span>
            <span className="font-mono-nums font-bold text-emerald-400 text-base flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {userStats.totalFocusMinutes}m
            </span>
          </div>
        </div>
      </div>

      {/* Constellation Nodes Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-slate-100">
              Constellation of Academic Mastery
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Attune passive cognitive boons by transmuting your hard-earned Arcane Shards.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono-nums">
            {skills.filter((s) => s.unlocked).length} / {skills.length} Attuned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {skills.map((skill) => {
            const canAfford = userStats.shards >= skill.cost;

            return (
              <div
                key={skill.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  skill.unlocked
                    ? 'bg-violet-950/20 border-violet-500/40 shadow-sm'
                    : 'bg-slate-950/80 border-slate-800/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-medium text-[11px]">
                      {skill.category} · Tier {skill.tier}
                    </span>
                    {skill.unlocked ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attuned</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-500 text-[11px] font-mono-nums">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{skill.cost} Shards</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-cinzel text-base font-bold text-slate-100 mt-1 mb-1">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {skill.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono-nums font-semibold text-amber-400">
                    {skill.effectText}
                  </span>

                  {!skill.unlocked && (
                    <button
                      onClick={() => handleUnlock(skill)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                        canAfford
                          ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Attune' : 'Need Shards'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
