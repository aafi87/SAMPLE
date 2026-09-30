import React, { useState, useEffect } from 'react';
import { UserStats, StudyPlan, Flashcard, SkillNode, Quest, Chapter } from './types';
import {
  INITIAL_USER_STATS,
  INITIAL_CAMPAIGNS,
  INITIAL_FLASHCARDS,
  INITIAL_SKILL_TREE,
} from './data/initialData';
import { sound } from './utils/soundEffects';
import { HeaderNav } from './components/HeaderNav';
import { RealmMapView } from './components/RealmMapView';
import { QuestLogView } from './components/QuestLogView';
import { ChronosPomodoroView } from './components/ChronosPomodoroView';
import { BossArenaView } from './components/BossArenaView';
import { AlchemicalFlashcardsView } from './components/AlchemicalFlashcardsView';
import { SkillConstellationView } from './components/SkillConstellationView';
import { CampaignForgeModal } from './components/CampaignForgeModal';
import { ArchmageScribeDrawer } from './components/ArchmageScribeDrawer';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ChevronDown,
  PlusCircle,
  Share2,
  Download
} from 'lucide-react';

export default function App() {
  // Local storage initialization
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('aetheria_user_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER_STATS;
  });

  const [plans, setPlans] = useState<StudyPlan[]>(() => {
    try {
      const saved = localStorage.getItem('aetheria_study_plans');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CAMPAIGNS;
  });

  const [currentPlanId, setCurrentPlanId] = useState<string>(() => {
    return plans[0]?.id || INITIAL_CAMPAIGNS[0].id;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const saved = localStorage.getItem('aetheria_flashcards');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FLASHCARDS;
  });

  const [skills, setSkills] = useState<SkillNode[]>(() => {
    try {
      const saved = localStorage.getItem('aetheria_skills');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SKILL_TREE;
  });

  const [activeTab, setActiveTab] = useState<'map' | 'quests' | 'pomodoro' | 'boss' | 'flashcards' | 'skills'>('map');
  const [selectedQuestForPomodoro, setSelectedQuestForPomodoro] = useState<Quest | null>(null);
  const [selectedChapterForBoss, setSelectedChapterForBoss] = useState<Chapter | null>(null);

  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isScribeOpen, setIsScribeOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('aetheria_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('aetheria_study_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('aetheria_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('aetheria_skills', JSON.stringify(skills));
  }, [skills]);

  // Current active study campaign
  const currentPlan = plans.find((p) => p.id === currentPlanId) || plans[0] || null;

  // Level Up & Rewards Engine
  const addXpAndShards = (earnedXp: number, earnedShards: number) => {
    setUserStats((prev) => {
      let nextXp = prev.xp + earnedXp;
      let nextLevel = prev.level;
      let nextXpToNext = prev.xpToNextLevel;
      let didLevelUp = false;

      while (nextXp >= nextXpToNext) {
        nextXp -= nextXpToNext;
        nextLevel += 1;
        nextXpToNext = Math.round(nextXpToNext * 1.35);
        didLevelUp = true;
      }

      if (didLevelUp) {
        sound.playLevelUp();
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#fbbf24', '#f59e0b', '#8b5cf6', '#10b981'],
          });
        } catch (e) {}
      }

      // Check familiar evolution at level 5, 10
      let familiarStage = prev.familiar.stage;
      if (nextLevel >= 10) familiarStage = 'Arch-Familiar';
      else if (nextLevel >= 5) familiarStage = 'Apprentice';

      return {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        xpToNextLevel: nextXpToNext,
        shards: prev.shards + earnedShards,
        completedQuestCount: prev.completedQuestCount + 1,
        familiar: {
          ...prev.familiar,
          level: nextLevel,
          stage: familiarStage,
          happiness: Math.min(100, prev.familiar.happiness + 2),
        },
      };
    });
  };

  const handleAddFocusMinutes = (minutes: number, earnedXp: number, earnedShards: number) => {
    setUserStats((prev) => ({
      ...prev,
      totalFocusMinutes: prev.totalFocusMinutes + minutes,
    }));
    addXpAndShards(earnedXp, earnedShards);
  };

  const handleBossDefeated = (chapterId: string, earnedXp: number, earnedShards: number) => {
    if (currentPlan) {
      const updatedChapters = currentPlan.chapters.map((chap) => {
        if (chap.id === chapterId) {
          return { ...chap, bossDefeated: true };
        }
        return chap;
      });
      handleUpdatePlan({ ...currentPlan, chapters: updatedChapters });
    }

    setUserStats((prev) => ({
      ...prev,
      bossesDefeatedCount: prev.bossesDefeatedCount + 1,
    }));
    addXpAndShards(earnedXp, earnedShards);
  };

  const handleUnlockSkill = (skillId: string, cost: number) => {
    setUserStats((prev) => ({
      ...prev,
      shards: Math.max(0, prev.shards - cost),
      unlockedSkillIds: [...prev.unlockedSkillIds, skillId],
    }));

    setSkills((prev) =>
      prev.map((s) => (s.id === skillId ? { ...s, unlocked: true } : s))
    );
  };

  const handleUpdatePlan = (updated: StudyPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handlePlanCreated = (newPlan: StudyPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setCurrentPlanId(newPlan.id);
    setActiveTab('map');
  };

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  // Navigations from realm map
  const handleStartPomodoroForQuest = (quest: Quest) => {
    setSelectedQuestForPomodoro(quest);
    setActiveTab('pomodoro');
  };

  const handleChallengeBoss = (chapter: Chapter) => {
    setSelectedChapterForBoss(chapter);
    setActiveTab('boss');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans-clean antialiased selection:bg-amber-500/20 selection:text-amber-200">
      {/* Universal Top Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userStats={userStats}
        currentPlan={currentPlan}
        onOpenForge={() => setIsForgeOpen(true)}
        onOpenScribe={() => setIsScribeOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Campaign Switcher Sub-Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] shrink-0">
              Active Campaign:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {plans.map((p) => {
                const isSelected = p.id === currentPlanId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      sound.playClick();
                      setCurrentPlanId(p.id);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    {p.title}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  sound.playClick();
                  setIsForgeOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 text-xs transition-colors cursor-pointer border border-dashed border-slate-700"
                title="Create New Campaign with Gemini AI"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Campaign</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400 shrink-0 self-end sm:self-auto font-mono-nums">
            <span>Quests Conquered: <strong className="text-emerald-400">{userStats.completedQuestCount}</strong></span>
            <span>·</span>
            <span>Bosses Slain: <strong className="text-rose-400">{userStats.bossesDefeatedCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {activeTab === 'map' && currentPlan && (
          <RealmMapView
            plan={currentPlan}
            onSelectQuest={() => setActiveTab('quests')}
            onStartPomodoroForQuest={handleStartPomodoroForQuest}
            onChallengeBoss={handleChallengeBoss}
          />
        )}

        {activeTab === 'quests' && currentPlan && (
          <QuestLogView
            plan={currentPlan}
            onUpdatePlan={handleUpdatePlan}
            onAddXpAndShards={addXpAndShards}
            onStartPomodoro={handleStartPomodoroForQuest}
            onChallengeBoss={handleChallengeBoss}
          />
        )}

        {activeTab === 'pomodoro' && (
          <ChronosPomodoroView
            userStats={userStats}
            selectedQuest={selectedQuestForPomodoro}
            onAddFocusMinutes={handleAddFocusMinutes}
          />
        )}

        {activeTab === 'boss' && (
          <BossArenaView
            currentChapter={selectedChapterForBoss || currentPlan?.chapters[0] || null}
            userStats={userStats}
            onBossDefeated={handleBossDefeated}
          />
        )}

        {activeTab === 'flashcards' && (
          <AlchemicalFlashcardsView
            flashcards={flashcards}
            onUpdateFlashcards={setFlashcards}
            userStats={userStats}
            onAddXpAndShards={addXpAndShards}
          />
        )}

        {activeTab === 'skills' && (
          <SkillConstellationView
            userStats={userStats}
            skills={skills}
            onUnlockSkill={handleUnlockSkill}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-cinzel font-semibold text-slate-400">Aetheria Grimoire</span>
            <span>—</span>
            <span>Gamified AI Study Planner & Active Recall Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>·</span>
            <span>Web Audio Synthesized Acoustic Wards</span>
          </div>
        </div>
      </footer>

      {/* AI Campaign Forge Modal */}
      <CampaignForgeModal
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      {/* AI Archmage Scribe Chat Drawer */}
      <ArchmageScribeDrawer
        isOpen={isScribeOpen}
        onClose={() => setIsScribeOpen(false)}
        userStats={userStats}
        currentPlan={currentPlan}
      />
    </div>
  );
}
