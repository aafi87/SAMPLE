export type CharacterClass = 'Cosmic Scribe' | 'Alchemist of Logic' | 'Rune Weaver' | 'Chronos Scholar';

export type EvolutionStage = 'Egg' | 'Fledgling' | 'Apprentice' | 'Arch-Familiar';

export interface Familiar {
  id: string;
  name: string;
  species: string;
  stage: EvolutionStage;
  level: number;
  happiness: number; // 0 - 100
  favoriteStudyHabit: string;
  currentSpeech: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  shards: number; // Arcane currency
  mana: number; // 0 to 100
  streakDays: number;
  lastActiveDate: string;
  characterClass: CharacterClass;
  familiar: Familiar;
  completedQuestCount: number;
  totalFocusMinutes: number;
  bossesDefeatedCount: number;
  unlockedSkillIds: string[];
}

export type QuestCategory = 'Theory' | 'Practice' | 'Review' | 'Flashcards';
export type CampaignDifficulty = 'Novice' | 'Adept' | 'Master' | 'Mythic';

export interface QuestTask {
  id: string;
  text: string;
  done: boolean;
}

export interface Quest {
  id: string;
  title: string;
  category: QuestCategory;
  estMinutes: number;
  xpReward: number;
  shardsReward: number;
  focusGoal: string;
  tasks: QuestTask[];
  completed: boolean;
  milestoneDay: number;
  scheduledDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  flavor: string;
  bossName: string;
  bossHp: number;
  bossDefeated: boolean;
  quests: Quest[];
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  synopsis: string;
  totalEstHours: number;
  difficulty: CampaignDifficulty;
  realmTheme: string;
  examDate: string;
  weeklyTargetHours: number;
  createdAt: string;
  chapters: Chapter[];
}

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
  mnemonic?: string;
  interval: number; // days
  easeFactor: number; // default 2.5
  reviews: number;
  nextReviewDate: string;
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface BossQuizRound {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  damageToBoss: number;
  bossAttackFlavor: string;
}

export interface BossQuiz {
  bossName: string;
  introDialogue: string;
  defeatDialogue: string;
  rounds: BossQuizRound[];
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  tier: 1 | 2 | 3;
  category: 'Focus' | 'Memory' | 'Speed' | 'Wisdom';
  effectText: string;
  unlocked: boolean;
}

export interface ScribeMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
