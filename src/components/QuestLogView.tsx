import React, { useState } from 'react';
import { StudyPlan, Quest, Chapter, UserStats } from '../types';
import { sound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Filter,
  Flame,
  Timer,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Swords
} from 'lucide-react';

interface QuestLogViewProps {
  plan: StudyPlan;
  onUpdatePlan: (updated: StudyPlan) => void;
  onAddXpAndShards: (xp: number, shards: number) => void;
  onStartPomodoro: (quest: Quest) => void;
  onChallengeBoss: (chapter: Chapter) => void;
}

export const QuestLogView: React.FC<QuestLogViewProps> = ({
  plan,
  onUpdatePlan,
  onAddXpAndShards,
  onStartPomodoro,
  onChallengeBoss,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'in_progress' | 'completed' | 'high_priority'>('all');
  const [expandedQuestIds, setExpandedQuestIds] = useState<{ [id: string]: boolean }>({});
  const [isAddQuestOpen, setIsAddQuestOpen] = useState(false);
  const [selectedChapterIdForAdd, setSelectedChapterIdForAdd] = useState(plan.chapters[0]?.id || '');

  // Form state for adding custom quest
  const [newTitle, setNewTitle] = useState('');
  const [newFocusGoal, setNewFocusGoal] = useState('');
  const [newMinutes, setNewMinutes] = useState(30);
  const [newCategory, setNewCategory] = useState<'Theory' | 'Practice' | 'Review' | 'Flashcards'>('Practice');
  const [newTasksRaw, setNewTasksRaw] = useState('');

  // Toggle quest accordion
  const toggleExpand = (questId: string) => {
    setExpandedQuestIds((prev) => ({ ...prev, [questId]: !prev[questId] }));
  };

  // Toggle single micro-task
  const handleToggleTask = (chapterId: string, questId: string, taskId: string) => {
    sound.playClick();

    let gainedXp = 0;
    let gainedShards = 0;
    let isQuestNewlyCompleted = false;

    const updatedChapters = plan.chapters.map((chap) => {
      if (chap.id !== chapterId) return chap;

      const updatedQuests = chap.quests.map((q) => {
        if (q.id !== questId) return q;

        const updatedTasks = q.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const nextDone = !t.done;
          if (nextDone) {
            gainedXp += 20; // XP per micro-task
          }
          return { ...t, done: nextDone };
        });

        const allDone = updatedTasks.every((t) => t.done) && updatedTasks.length > 0;
        if (allDone && !q.completed) {
          isQuestNewlyCompleted = true;
          gainedXp += q.xpReward;
          gainedShards += q.shardsReward;
        }

        return { ...q, tasks: updatedTasks, completed: allDone };
      });

      return { ...chap, quests: updatedQuests };
    });

    onUpdatePlan({ ...plan, chapters: updatedChapters });

    if (gainedXp > 0 || gainedShards > 0) {
      onAddXpAndShards(gainedXp, gainedShards);
    }

    if (isQuestNewlyCompleted) {
      sound.playQuestComplete();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#f59e0b', '#10b981', '#8b5cf6', '#3b82f6'],
        });
      } catch (e) {}
    }
  };

  // Submit adding custom quest
  const handleAddQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playClick();
    const taskLines = newTasksRaw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const generatedTasks = (taskLines.length > 0 ? taskLines : ['Review core study material', 'Complete active exercises']).map(
      (text, idx) => ({
        id: `t_${Date.now()}_${idx}`,
        text,
        done: false,
      })
    );

    const newQuest: Quest = {
      id: `quest_custom_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      estMinutes: Number(newMinutes) || 30,
      xpReward: Math.round(Number(newMinutes) * 3) || 90,
      shardsReward: Math.round(Number(newMinutes) * 0.8) || 25,
      focusGoal: newFocusGoal.trim() || 'Deep focus on this customized study objective.',
      completed: false,
      milestoneDay: 1,
      tasks: generatedTasks,
    };

    const updatedChapters = plan.chapters.map((chap) => {
      if (chap.id === selectedChapterIdForAdd) {
        return { ...chap, quests: [...chap.quests, newQuest] };
      }
      return chap;
    });

    onUpdatePlan({ ...plan, chapters: updatedChapters });

    // Reset form
    setNewTitle('');
    setNewFocusGoal('');
    setNewTasksRaw('');
    setIsAddQuestOpen(false);
  };

  // Calculate high-level metrics
  let totalQuests = 0;
  let completedQuests = 0;
  plan.chapters.forEach((chap) => {
    chap.quests.forEach((q) => {
      totalQuests++;
      if (q.completed) completedQuests++;
    });
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Planner Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Tome of Quests & Spaced Repetition</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-slate-100">
            {plan.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{totalQuests} Total Quests</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">{completedQuests} Conquered</span>
            <span>·</span>
            <span>{plan.totalEstHours}h Estimated Study Volume</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setIsAddQuestOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Inscribe Custom Quest</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quests by title, concept, or goal..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => {
              sound.playClick();
              setFilterState('all');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterState === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalQuests})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilterState('in_progress');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterState === 'in_progress'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilterState('completed');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              filterState === 'completed'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conquered
          </button>
        </div>
      </div>

      {/* Chapters & Quests List */}
      <div className="space-y-6">
        {plan.chapters.map((chapter) => {
          // Filter quests in this chapter
          const matchingQuests = chapter.quests.filter((q) => {
            const matchesSearch =
              !searchQuery.trim() ||
              q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.focusGoal.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (filterState === 'completed') return q.completed;
            if (filterState === 'in_progress') return !q.completed;
            return true;
          });

          if (matchingQuests.length === 0 && searchQuery.trim()) {
            return null;
          }

          const chapterQuestsTotal = chapter.quests.length;
          const chapterQuestsDone = chapter.quests.filter((q) => q.completed).length;

          return (
            <div
              key={chapter.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4"
            >
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-cinzel font-bold text-amber-400 text-xs">
                    {chapter.chapterNumber}
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base md:text-lg font-bold text-slate-100">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic">{chapter.flavor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono-nums">
                    {chapterQuestsDone}/{chapterQuestsTotal} Conquered
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onChallengeBoss(chapter);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      chapter.bossDefeated
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>{chapter.bossDefeated ? 'Boss Vanquished' : `Duel ${chapter.bossName}`}</span>
                  </button>
                </div>
              </div>

              {/* Quests in Chapter */}
              <div className="space-y-3">
                {matchingQuests.map((quest) => {
                  const isExpanded = expandedQuestIds[quest.id] ?? !quest.completed;
                  const doneTasks = quest.tasks.filter((t) => t.done).length;
                  const totalTasks = quest.tasks.length;
                  const taskPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

                  return (
                    <div
                      key={quest.id}
                      className={`border rounded-xl transition-all ${
                        quest.completed
                          ? 'bg-emerald-950/15 border-emerald-500/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Quest Row Top Banner */}
                      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div
                          className="flex items-start gap-3 cursor-pointer flex-1"
                          onClick={() => toggleExpand(quest.id)}
                        >
                          <div className="mt-0.5 shrink-0">
                            {quest.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-amber-500/60" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                              <span className="font-semibold text-amber-300">
                                {quest.category}
                              </span>
                              <span>·</span>
                              <span className="font-mono-nums">Day {quest.milestoneDay}</span>
                              <span>·</span>
                              <span className="font-mono-nums">{quest.estMinutes} mins</span>
                              {quest.priority === 'High' && (
                                <>
                                  <span>·</span>
                                  <span className="text-rose-400 font-semibold">High Priority</span>
                                </>
                              )}
                            </div>
                            <h4
                              className={`font-medium text-sm md:text-base ${
                                quest.completed ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {quest.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {quest.focusGoal}
                            </p>
                          </div>
                        </div>

                        {/* Actions on right */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <span className="text-xs font-mono-nums font-semibold text-amber-400 mr-2">
                            +{quest.xpReward} XP
                          </span>

                          <button
                            onClick={() => {
                              sound.playClick();
                              onStartPomodoro(quest);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold cursor-pointer transition-all active:scale-95"
                            title="Start Focus Timer"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            <span>Focus</span>
                          </button>

                          <button
                            onClick={() => toggleExpand(quest.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Micro-Tasks Checklist */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-800/80">
                          {/* Mini Progress */}
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                            <span>Checklist ({doneTasks}/{totalTasks} steps completed)</span>
                            <span className="font-mono-nums">{taskPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                            <div
                              className="bg-amber-400 h-full rounded-full transition-all duration-300"
                              style={{ width: `${taskPercent}%` }}
                            />
                          </div>

                          {/* Task items */}
                          <div className="space-y-2">
                            {quest.tasks.map((task) => (
                              <label
                                key={task.id}
                                className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-xs text-slate-200 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={task.done}
                                  onChange={() => handleToggleTask(chapter.id, quest.id, task.id)}
                                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer"
                                />
                                <span className={task.done ? 'line-through text-slate-500' : 'text-slate-200'}>
                                  {task.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Quest Modal */}
      {isAddQuestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                Inscribe Custom Quest
              </h3>
              <button
                onClick={() => setIsAddQuestOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assign to Chapter
                </label>
                <select
                  value={selectedChapterIdForAdd}
                  onChange={(e) => setSelectedChapterIdForAdd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {plan.chapters.map((chap) => (
                    <option key={chap.id} value={chap.id}>
                      Chapter {chap.chapterNumber}: {chap.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quest Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Matrix Multiplications & Dot Products"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Practice">Practice</option>
                    <option value="Theory">Theory</option>
                    <option value="Review">Review</option>
                    <option value="Flashcards">Flashcards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Est. Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Arcane Focus Goal
                </label>
                <input
                  type="text"
                  placeholder="What concrete capability or understanding will be unlocked?"
                  value={newFocusGoal}
                  onChange={(e) => setNewFocusGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Micro-Tasks (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Solve 3 textbook derivation problems\nCheck solution manual\nReview errors`}
                  value={newTasksRaw}
                  onChange={(e) => setNewTasksRaw(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddQuestOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Save Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
