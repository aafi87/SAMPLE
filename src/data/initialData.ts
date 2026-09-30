import { StudyPlan, UserStats, Flashcard, SkillNode } from '../types';

export const INITIAL_USER_STATS: UserStats = {
  level: 3,
  xp: 380,
  xpToNextLevel: 500,
  shards: 145,
  mana: 85,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  characterClass: 'Alchemist of Logic',
  familiar: {
    id: 'fam_pip',
    name: 'Pip',
    species: 'Celestial Scholar Owl',
    stage: 'Apprentice',
    level: 3,
    happiness: 92,
    favoriteStudyHabit: 'Pomodoro with chamomile tea',
    currentSpeech: 'Hoot! The stars align for active recall today, Apprentice!'
  },
  completedQuestCount: 7,
  totalFocusMinutes: 185,
  bossesDefeatedCount: 1,
  unlockedSkillIds: ['skill_focus_1', 'skill_recall_1']
};

export const INITIAL_CAMPAIGNS: StudyPlan[] = [
  {
    id: 'camp_algo_1',
    title: 'The Citadel of Computational Alchemy',
    subject: 'Algorithms, Data Structures & Complexity',
    synopsis: 'Ascend the ancient stone spire of algorithms. Decipher asymptotic runes, conquer tree traversals, and duel the dreaded Chrono-Dragon of Big-O.',
    totalEstHours: 24,
    difficulty: 'Master',
    realmTheme: 'Celestial Spire',
    examDate: '2026-10-28',
    weeklyTargetHours: 8,
    createdAt: '2026-09-25',
    chapters: [
      {
        id: 'chap_1_alg',
        chapterNumber: 1,
        title: 'Runes of Asymptotic Time & Memory',
        flavor: 'Understanding the temporal cost of spell invocations',
        bossName: 'The Chrono-Chimera of Big-O',
        bossHp: 100,
        bossDefeated: true,
        quests: [
          {
            id: 'quest_1_1',
            title: 'Deciphering Big-O, Omega & Theta',
            category: 'Theory',
            estMinutes: 30,
            xpReward: 90,
            shardsReward: 25,
            focusGoal: 'Derive worst and average runtime for nested loops & recursion',
            completed: true,
            milestoneDay: 1,
            tasks: [
              { id: 't1', text: 'Derive recurrence relation for binary search (T(n) = T(n/2) + O(1))', done: true },
              { id: 't2', text: 'Map polynomial vs logarithmic growth curves on graph', done: true },
              { id: 't3', text: 'Solve 3 leetcode complexity derivation exercises', done: true }
            ]
          },
          {
            id: 'quest_1_2',
            title: 'Memory Footprints & Call-Stack Scrying',
            category: 'Practice',
            estMinutes: 45,
            xpReward: 120,
            shardsReward: 35,
            focusGoal: 'Master auxiliary space complexity vs input space allocations',
            completed: true,
            milestoneDay: 2,
            tasks: [
              { id: 't4', text: 'Trace call stack frames in recursive Fibonacci tree', done: true },
              { id: 't5', text: 'Compare pointer overhead in Linked Lists vs dynamic contiguous arrays', done: true },
              { id: 't6', text: 'Implement in-place array partition without extra allocations', done: true }
            ]
          }
        ]
      },
      {
        id: 'chap_2_alg',
        chapterNumber: 2,
        title: 'The Labyrinth of Branching Arboreals',
        flavor: 'Traversing the binary groves and balancing AVL totems',
        bossName: 'Archon of the Red-Black Thicket',
        bossHp: 120,
        bossDefeated: false,
        quests: [
          {
            id: 'quest_2_1',
            title: 'Binary Search Trees & Re-balancing Magic',
            category: 'Practice',
            estMinutes: 50,
            xpReward: 150,
            shardsReward: 40,
            focusGoal: 'Master left/right AVL tree rotations and invariants',
            completed: false,
            milestoneDay: 4,
            priority: 'High',
            tasks: [
              { id: 't7', text: 'Draw step-by-step LL and LR rotation for unbalanced tree', done: true },
              { id: 't8', text: 'Code iterative in-order DFS traversal using an explicit stack', done: false },
              { id: 't9', text: 'Prove why balanced tree search is strictly O(log n)', done: false }
            ]
          },
          {
            id: 'quest_2_2',
            title: 'Heap Sorcery & Priority Convocations',
            category: 'Flashcards',
            estMinutes: 35,
            xpReward: 110,
            shardsReward: 30,
            focusGoal: 'Active recall for min-heap array index math & heapify sift-downs',
            completed: false,
            milestoneDay: 5,
            priority: 'Medium',
            tasks: [
              { id: 't10', text: 'Derive children index formulas: 2i + 1 and 2i + 2', done: false },
              { id: 't11', text: 'Demonstrate why building a heap takes O(n) instead of O(n log n)', done: false },
              { id: 't12', text: 'Review 8 heap flashcards with 100% accuracy', done: false }
            ]
          },
          {
            id: 'quest_2_3',
            title: 'Trie Weaving & Prefix Spellcraft',
            category: 'Practice',
            estMinutes: 40,
            xpReward: 130,
            shardsReward: 35,
            focusGoal: 'Construct prefix search tree for instant autocomplete lookups',
            completed: false,
            milestoneDay: 6,
            tasks: [
              { id: 't13', text: 'Design TrieNode struct with 26-child map and end-of-word flag', done: false },
              { id: 't14', text: 'Implement startsWith() prefix query method', done: false }
            ]
          }
        ]
      },
      {
        id: 'chap_3_alg',
        chapterNumber: 3,
        title: 'The Graph Realms & Dynamic Divinations',
        flavor: 'Finding shortest paths through astral planes and memoizing destiny',
        bossName: 'The Shadow Dijkstra & The DP Matrix',
        bossHp: 150,
        bossDefeated: false,
        quests: [
          {
            id: 'quest_3_1',
            title: 'BFS, DFS & Topological Enchantments',
            category: 'Theory',
            estMinutes: 45,
            xpReward: 140,
            shardsReward: 40,
            focusGoal: 'Detect cycles in directed graphs using Kahn algorithm / in-degree tracking',
            completed: false,
            milestoneDay: 8,
            tasks: [
              { id: 't15', text: 'Trace course schedule dependency resolution cycle', done: false },
              { id: 't16', text: 'Implement shortest path on unweighted graph using queue BFS', done: false }
            ]
          },
          {
            id: 'quest_3_2',
            title: 'Dijkstra & A* Astral Navigation',
            category: 'Practice',
            estMinutes: 55,
            xpReward: 170,
            shardsReward: 45,
            focusGoal: 'Master greedy relaxation and heuristic distance bounds',
            completed: false,
            milestoneDay: 10,
            tasks: [
              { id: 't17', text: 'Hand-trace priority queue state for 6-node weighted graph', done: false },
              { id: 't18', text: 'Explain why Dijkstra fails with negative edge weights', done: false }
            ]
          },
          {
            id: 'quest_3_3',
            title: 'Dynamic Programming: The Knapsack Sanctuary',
            category: 'Review',
            estMinutes: 60,
            xpReward: 200,
            shardsReward: 50,
            focusGoal: 'Formulate state transitions: Top-down memoization vs bottom-up tabulation',
            completed: false,
            milestoneDay: 12,
            tasks: [
              { id: 't19', text: 'Define DP state dp[i][w] = max value using first i items and weight w', done: false },
              { id: 't20', text: 'Optimize 2D matrix table down to 1D sliding array for O(W) space', done: false }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'camp_bio_2',
    title: 'The Bio-Chamber of Living Runes',
    subject: 'Cellular Biology & Molecular Genetics',
    synopsis: 'Unlock the secret helical grimoire of life. Transcribe mRNA spells, regulate enzyme catalysts, and defeat the Mutagenic Hydra.',
    totalEstHours: 18,
    difficulty: 'Adept',
    realmTheme: 'Enchanted Biome',
    examDate: '2026-11-04',
    weeklyTargetHours: 6,
    createdAt: '2026-09-27',
    chapters: [
      {
        id: 'chap_1_bio',
        chapterNumber: 1,
        title: 'The Central Dogma Transcription Spells',
        flavor: 'From DNA master scrolls to enzymatic mRNA couriers',
        bossName: 'The Mutagenic Hydra of Replication',
        bossHp: 100,
        bossDefeated: false,
        quests: [
          {
            id: 'quest_b_1',
            title: 'Replication Forks & Polymerase Wardens',
            category: 'Theory',
            estMinutes: 40,
            xpReward: 110,
            shardsReward: 30,
            focusGoal: 'Compare leading vs lagging strand Okazaki fragments and ligase seals',
            completed: false,
            milestoneDay: 1,
            tasks: [
              { id: 'bt1', text: 'Sketch replication bubble with helicase, topoisomerase and SSB proteins', done: false },
              { id: 'bt2', text: 'Memorize proofreading exonuclease 3-to-5 prime mechanism', done: false }
            ]
          },
          {
            id: 'quest_b_2',
            title: 'Codon Altar: Translation & Ribosome Forges',
            category: 'Practice',
            estMinutes: 45,
            xpReward: 130,
            shardsReward: 35,
            focusGoal: 'Trace tRNA anticodon binding, A-P-E sites, and peptide synthesis',
            completed: false,
            milestoneDay: 3,
            tasks: [
              { id: 'bt3', text: 'Translate 18-nucleotide mRNA sequence into hexapeptide chain', done: false },
              { id: 'bt4', text: 'Describe post-translational folding in chaperone barrels', done: false }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_1',
    topic: 'Algorithms & Complexity',
    front: 'What is the time complexity of building a Binary Heap from an arbitrary array of n elements?',
    back: 'O(n) time complexity (Linear time) — NOT O(n log n). This is proven by summing heights: sum of n/(2^(h+1)) * O(h) which converges geometrically.',
    mnemonic: 'Building a heap is cheap: bottom leaves have height zero and do no work!',
    interval: 3,
    easeFactor: 2.6,
    reviews: 4,
    nextReviewDate: '2026-10-01',
    masteryLevel: 3
  },
  {
    id: 'fc_2',
    topic: 'Algorithms & Complexity',
    front: 'Why does Dijkstra’s algorithm fail or loop infinitely if negative edge weights exist?',
    back: 'Dijkstra greedily marks nodes as "finalized" (visited) assuming once extracted from the priority queue, no shorter path can ever be discovered. Negative edges violate this greedy invariant.',
    mnemonic: 'Greedy eyes close too soon; negative weights bring dark doom! Use Bellman-Ford instead.',
    interval: 2,
    easeFactor: 2.5,
    reviews: 2,
    nextReviewDate: '2026-09-30',
    masteryLevel: 2
  },
  {
    id: 'fc_3',
    topic: 'Data Structures',
    front: 'In an AVL Tree, what balance factor trigger requires a Double Rotation (Left-Right or Right-Left)?',
    back: 'When a node has balance factor ±2 and its child has the OPPOSITE sign balance factor (e.g. Node is +2, left child is -1, indicating a "zigzag" or interior kink).',
    mnemonic: 'Straight stick = single flick; Zig-zag branch = double dance!',
    interval: 5,
    easeFactor: 2.7,
    reviews: 5,
    nextReviewDate: '2026-10-03',
    masteryLevel: 4
  },
  {
    id: 'fc_4',
    topic: 'Operating Systems & Concurrency',
    front: 'Name the four Coffman conditions required for a Deadlock to occur.',
    back: '1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait\nBreaking any ONE of these four prevents deadlock.',
    mnemonic: 'Many Hands Never Circle (M-H-N-C)',
    interval: 1,
    easeFactor: 2.4,
    reviews: 1,
    nextReviewDate: '2026-09-30',
    masteryLevel: 1
  }
];

export const INITIAL_SKILL_TREE: SkillNode[] = [
  {
    id: 'skill_focus_1',
    name: 'Hourglass Attunement',
    description: 'Increases Pomodoro focus session XP gain by +15%.',
    cost: 50,
    tier: 1,
    category: 'Focus',
    effectText: '+15% Pomodoro XP',
    unlocked: true
  },
  {
    id: 'skill_recall_1',
    name: 'Alchemical Memory Flask',
    description: 'Flashcard mastery bonus: +5 Mana on every "Easy" recall.',
    cost: 60,
    tier: 1,
    category: 'Memory',
    effectText: '+5 Mana on Easy review',
    unlocked: true
  },
  {
    id: 'skill_speed_1',
    name: 'Haste Inscription',
    description: 'Micro-tasks checked off grant +10 bonus XP on days with 3+ completions.',
    cost: 100,
    tier: 2,
    category: 'Speed',
    effectText: '+10 XP per Task streak',
    unlocked: false
  },
  {
    id: 'skill_boss_1',
    name: 'Aegis of the Exam Scholar',
    description: 'Boss battle shield: Take 50% less damage from wrong answers in quiz duels.',
    cost: 140,
    tier: 2,
    category: 'Wisdom',
    effectText: '-50% Boss damage taken',
    unlocked: false
  },
  {
    id: 'skill_chrono_master',
    name: 'Chronos Transmutation',
    description: 'Ultimate spell: Unlocks deep spaced repetition prediction & double loot drops.',
    cost: 250,
    tier: 3,
    category: 'Wisdom',
    effectText: '2x Boss Relic Shards',
    unlocked: false
  }
];
