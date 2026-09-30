import React, { useState } from 'react';
import { StudyPlan, Quest, Chapter } from '../types';
import { sound } from '../utils/soundEffects';
import {
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  Swords,
  Timer,
  BookOpen,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

interface RealmMapViewProps {
  plan: StudyPlan;
  onSelectQuest: (quest: Quest) => void;
  onStartPomodoroForQuest: (quest: Quest) => void;
  onChallengeBoss: (chapter: Chapter) => void;
}

export const RealmMapView: React.FC<RealmMapViewProps> = ({
  plan,
  onSelectQuest,
  onStartPomodoroForQuest,
  onChallengeBoss,
}) => {
  const [selectedQuest, setSelectedQuest] = useState<{ quest: Quest; chapter: Chapter } | null>(null);

  // Flatten all nodes to render an adventure route
  const chapters = plan.chapters;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-slate-950 p-4 md:p-6 lg:p-8 shadow-2xl">
      {/* Map Header & Lore Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Realm of Knowledge · {plan.realmTheme}</span>
          </div>
          <h2 className="font-cinzel text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">
            {plan.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            {plan.synopsis}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Target Date: </span>
            <span className="font-semibold text-amber-300 font-mono-nums">{plan.examDate}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-medium">
            {plan.difficulty} Campaign
          </div>
        </div>
      </div>

      {/* Interactive Fantasy World Map Canvas */}
      <div className="relative min-h-[580px] w-full rounded-xl bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-indigo-950 overflow-hidden flex flex-col justify-between p-6">
        {/* Subtle Starlight / Nebula particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />

        {/* Constellation Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Chapters & Quest Routes */}
        <div className="relative z-10 flex flex-col gap-10">
          {chapters.map((chapter, cIdx) => {
            const completedCount = chapter.quests.filter((q) => q.completed).length;
            const isChapterComplete = completedCount === chapter.quests.length && chapter.quests.length > 0;

            return (
              <div
                key={chapter.id}
                className="relative bg-slate-900/60 backdrop-blur-xs border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/30 transition-all"
              >
                {/* Chapter Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-cinzel font-bold text-amber-400 text-sm">
                      {chapter.chapterNumber}
                    </div>
                    <div>
                      <h3 className="font-cinzel text-base md:text-lg font-bold text-slate-100">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-slate-400 italic">
                        {chapter.flavor}
                      </p>
                    </div>
                  </div>

                  {/* Boss Challenge Shortcut */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono-nums">
                      {completedCount}/{chapter.quests.length} Quests Conquered
                    </span>
                    <button
                      onClick={() => {
                        sound.playClick();
                        onChallengeBoss(chapter);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        chapter.bossDefeated
                          ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-200 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>{chapter.bossDefeated ? 'Boss Vanquished' : `Duel ${chapter.bossName}`}</span>
                    </button>
                  </div>
                </div>

                {/* Quests Node Trail */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.quests.map((quest, qIdx) => {
                    const doneTasks = quest.tasks.filter((t) => t.done).length;
                    const totalTasks = quest.tasks.length;

                    return (
                      <div
                        key={quest.id}
                        onClick={() => {
                          sound.playClick();
                          setSelectedQuest({ quest, chapter });
                        }}
                        className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                          quest.completed
                            ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
                            : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 shadow-md'
                        }`}
                      >
                        {/* Status Icon & Milestone Tag */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-1.5">
                            {quest.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400/80 animate-pulse shrink-0" />
                            )}
                            <span className="font-semibold text-slate-300">
                              {quest.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono-nums">
                            Day {quest.milestoneDay} · {quest.estMinutes}m
                          </span>
                        </div>

                        {/* Quest Title */}
                        <h4 className="font-medium text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                          {quest.title}
                        </h4>

                        {/* Focus Goal */}
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {quest.focusGoal}
                        </p>

                        {/* Task Mini-Progress & Rewards */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                          <span className="text-[11px] text-slate-400 font-mono-nums">
                            {doneTasks}/{totalTasks} micro-tasks
                          </span>
                          <span className="text-amber-400 font-mono-nums font-semibold text-[11px]">
                            +{quest.xpReward} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cartouche & Legend */}
        <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conquered Realm</span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-400" />
              <span>Active Waypoint</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-rose-400" />
              <span>Exam Boss Citadel</span>
            </span>
          </div>
          <span className="italic text-slate-500">
            Click any wayward node to inspect tasks or invoke the Arcane Focus Hourglass.
          </span>
        </div>
      </div>

      {/* Quest Parchment Detail Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Chapter {selectedQuest.chapter.chapterNumber} · {selectedQuest.quest.category}
                </span>
                <h3 className="font-cinzel text-xl font-bold text-slate-100 mt-0.5">
                  {selectedQuest.quest.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuest(null)}
                className="text-slate-400 hover:text-slate-200 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Objective & Focus Goal */}
            <div className="mb-4 bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                Arcane Objective:
              </span>
              <p className="text-sm text-amber-100/90 mt-1">
                {selectedQuest.quest.focusGoal}
              </p>
            </div>

            {/* Checklist of Tasks */}
            <div className="mb-6">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider block mb-2">
                Quest Milestones:
              </span>
              <div className="flex flex-col gap-2">
                {selectedQuest.quest.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2.5 text-xs text-slate-200 bg-slate-800/40 px-3 py-2 rounded-lg border border-slate-800"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                        task.done ? 'bg-emerald-500/30 border-emerald-500 text-emerald-400' : 'border-slate-600'
                      }`}
                    >
                      {task.done && '✓'}
                    </div>
                    <span className={task.done ? 'line-through text-slate-400' : ''}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-mono-nums">
                Est: {selectedQuest.quest.estMinutes} mins · +{selectedQuest.quest.xpReward} XP
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onStartPomodoroForQuest(selectedQuest.quest);
                    setSelectedQuest(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold cursor-pointer transition-all"
                >
                  <Timer className="w-3.5 h-3.5" />
                  <span>Begin Focus Session</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectQuest(selectedQuest.quest);
                    setSelectedQuest(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer transition-all"
                >
                  <span>Open in Quest Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
