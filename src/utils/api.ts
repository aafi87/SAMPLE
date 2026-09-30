import { StudyPlan, BossQuiz, Flashcard, ScribeMessage, UserStats } from '../types';

// Client-side API caller for Gemini full-stack endpoints with smart fallback
export async function generateStudyPlanAI(params: {
  subject: string;
  examDate: string;
  hoursPerWeek: number;
  syllabusText: string;
  intensity: string;
  realmTheme: string;
}): Promise<StudyPlan> {
  try {
    const res = await fetch('/api/gemini/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.plan && data.plan.chapters?.length) {
      const plan = data.plan;
      return {
        id: 'camp_ai_' + Date.now(),
        title: plan.title || `Campaign of ${params.subject}`,
        subject: params.subject,
        synopsis: plan.synopsis || `An enchanted study expedition to master ${params.subject}.`,
        totalEstHours: plan.totalEstHours || 20,
        difficulty: (plan.difficulty as any) || 'Adept',
        realmTheme: params.realmTheme || 'Celestial Academy',
        examDate: params.examDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        weeklyTargetHours: params.hoursPerWeek || 8,
        createdAt: new Date().toISOString().split('T')[0],
        chapters: plan.chapters.map((chap: any, cIdx: number) => ({
          id: `chap_${cIdx + 1}_${Date.now()}`,
          chapterNumber: chap.chapterNumber || cIdx + 1,
          title: chap.title || `Chapter ${cIdx + 1}`,
          flavor: chap.flavor || 'Arcane curriculum milestone',
          bossName: chap.bossName || `Guardian of Chapter ${cIdx + 1}`,
          bossHp: chap.bossHp || 100,
          bossDefeated: false,
          quests: (chap.quests || []).map((q: any, qIdx: number) => ({
            id: `quest_${cIdx + 1}_${qIdx + 1}_${Date.now()}`,
            title: q.title || `Quest ${qIdx + 1}`,
            category: q.category || 'Theory',
            estMinutes: q.estMinutes || 45,
            xpReward: q.xpReward || 120,
            shardsReward: Math.round((q.xpReward || 120) * 0.3),
            focusGoal: q.focusGoal || 'Conquer this core concept',
            completed: false,
            milestoneDay: q.milestoneDay || (cIdx * 3 + qIdx + 1),
            tasks: (q.tasks || ['Read core chapter text', 'Derive key formula', 'Practice active recall']).map((tText: string, tIdx: number) => ({
              id: `t_${cIdx}_${qIdx}_${tIdx}`,
              text: typeof tText === 'string' ? tText : (tText as any).text,
              done: false
            }))
          }))
        }))
      };
    }
  } catch (err) {
    console.warn('Backend plan generation fallback invoked:', err);
  }

  // Smart local algorithmic fallback generator
  const subjectName = params.subject.trim() || 'Cosmic Foundations';
  return {
    id: 'camp_local_' + Date.now(),
    title: `The Chronicles of ${subjectName}`,
    subject: subjectName,
    synopsis: `An arcane syllabus deconstructed into tiered questlines, active recall checkpoints, and boss encounters to conquer ${subjectName}.`,
    totalEstHours: params.hoursPerWeek * 3,
    difficulty: 'Adept',
    realmTheme: params.realmTheme || 'Astral Observatory',
    examDate: params.examDate || new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
    weeklyTargetHours: params.hoursPerWeek || 8,
    createdAt: new Date().toISOString().split('T')[0],
    chapters: [
      {
        id: 'chap_1_fb',
        chapterNumber: 1,
        title: `Pillars & First Principles of ${subjectName}`,
        flavor: 'Laying the indestructible bedrock of foundational mastery',
        bossName: `The Sentry of Core Axioms`,
        bossHp: 100,
        bossDefeated: false,
        quests: [
          {
            id: 'quest_fb_1_1',
            title: 'Deconstruction of Foundational Axioms',
            category: 'Theory',
            estMinutes: 45,
            xpReward: 100,
            shardsReward: 30,
            focusGoal: 'Extract core definitions, terminology, and foundational models',
            completed: false,
            milestoneDay: 1,
            tasks: [
              { id: 't_fb_1', text: 'Synthesize chapter overview notes into 5 atomic bullet points', done: false },
              { id: 't_fb_2', text: 'Identify the 3 most crucial equations / frameworks', done: false },
              { id: 't_fb_3', text: 'Create initial flashcards for key definitions', done: false }
            ]
          },
          {
            id: 'quest_fb_1_2',
            title: 'Active Synthesis & Diagnostic Exercises',
            category: 'Practice',
            estMinutes: 50,
            xpReward: 130,
            shardsReward: 35,
            focusGoal: 'Solve 3 representative practice problems without looking at solutions',
            completed: false,
            milestoneDay: 2,
            tasks: [
              { id: 't_fb_4', text: 'Attempt diagnostic problem set in timed conditions', done: false },
              { id: 't_fb_5', text: 'Analyze error log and pinpoint weak intuition spots', done: false }
            ]
          }
        ]
      },
      {
        id: 'chap_2_fb',
        chapterNumber: 2,
        title: `Intermediate Sorcery & Synthesis in ${subjectName}`,
        flavor: 'Interconnecting concepts into a robust mental lattice',
        bossName: `The Chimera of Applied Systems`,
        bossHp: 120,
        bossDefeated: false,
        quests: [
          {
            id: 'quest_fb_2_1',
            title: 'Cross-Topic Mechanics & Edge Cases',
            category: 'Practice',
            estMinutes: 55,
            xpReward: 150,
            shardsReward: 40,
            focusGoal: 'Stress-test your knowledge on tricky edge cases and common traps',
            completed: false,
            milestoneDay: 4,
            tasks: [
              { id: 't_fb_6', text: 'Derive secondary proofs and application variants', done: false },
              { id: 't_fb_7', text: 'Run 25-minute Pomodoro deep focus session on hardest section', done: false }
            ]
          },
          {
            id: 'quest_fb_2_2',
            title: 'Spaced Recall Crucible & Speed Drilling',
            category: 'Flashcards',
            estMinutes: 35,
            xpReward: 120,
            shardsReward: 30,
            focusGoal: 'Drill formulas and active recall items until retrieval time is under 5 seconds',
            completed: false,
            milestoneDay: 6,
            tasks: [
              { id: 't_fb_8', text: 'Complete flashcard deck review with 90%+ target accuracy', done: false }
            ]
          }
        ]
      },
      {
        id: 'chap_3_fb',
        chapterNumber: 3,
        title: `The Apex: Comprehensive Exam Simulation`,
        flavor: 'The ultimate synthesis under exam-condition pressure',
        bossName: `The Archon of the Final Trial`,
        bossHp: 150,
        bossDefeated: false,
        quests: [
          {
            id: 'quest_fb_3_1',
            title: 'Timed Mock Trial Under Pressure',
            category: 'Review',
            estMinutes: 60,
            xpReward: 200,
            shardsReward: 60,
            focusGoal: 'Simulate full exam scenario without notes or distractions',
            completed: false,
            milestoneDay: 9,
            tasks: [
              { id: 't_fb_9', text: 'Complete timed full-length practice examination', done: false },
              { id: 't_fb_10', text: 'Post-mortem review: annotate every single missed point', done: false }
            ]
          }
        ]
      }
    ]
  };
}

export async function generateBossQuizAI(topic: string, bossName: string, difficulty: string): Promise<BossQuiz> {
  try {
    const res = await fetch('/api/gemini/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, bossName, difficulty })
    });
    const data = await res.json();
    if (data.success && data.quiz && data.quiz.rounds?.length) {
      return data.quiz;
    }
  } catch (err) {
    console.warn('Boss quiz API fallback:', err);
  }

  // Fallback high-yield quiz
  return {
    bossName: bossName || 'The Guardian of Knowledge',
    introDialogue: `Who dares approach my domain without reviewing the sacred axioms? Prepare to be tested!`,
    defeatDialogue: `Remarkable intellect, apprentice! You have dismantled my defenses with rigorous logic. Take your spoils!`,
    rounds: [
      {
        id: 'r_fb_1',
        question: `When analyzing worst-case computational complexity for an algorithm with input size N, what does Big-O notation strictly represent?`,
        options: [
          'An asymptotic upper bound on the growth rate of runtime or space',
          'The exact number of CPU clock cycles required on x86 hardware',
          'The average time taken over randomized input distributions',
          'A lower bound describing the fastest possible execution path'
        ],
        correctIndex: 0,
        explanation: 'Big-O describes an asymptotic upper bound (f(n) <= c * g(n) for large n), bounding worst-case growth rate without hardware dependencies.',
        damageToBoss: 35,
        bossAttackFlavor: 'The boss hurls an infinite loop of temporal distortion!'
      },
      {
        id: 'r_fb_2',
        question: `Which fundamental technique prevents redundant re-computation of overlapping sub-problems in Dynamic Programming?`,
        options: [
          'Memoization / Tabulation storage of solved states',
          'Linear probing in open addressing hash tables',
          'Greedy immediate coin selection',
          'Depth-first post-order stack unwinding'
        ],
        correctIndex: 0,
        explanation: 'Dynamic Programming caches sub-problem results in a memo table (top-down) or array (bottom-up tabulation) to avoid recalculating overlapping subproblems.',
        damageToBoss: 35,
        bossAttackFlavor: 'The boss summons a branching combinatorial explosion!'
      },
      {
        id: 'r_fb_3',
        question: `In Spaced Repetition systems (like the SM-2 algorithm), why does increasing the interval between successful reviews strengthen long-term memory?`,
        options: [
          'Desirable difficulty during active retrieval triggers stronger synaptic consolidation before memory decays',
          'It allows the brain to completely forget the material so it can be re-learned from scratch',
          'Short-term memory stores become overloaded if reviewed more than once a month',
          'It reduces the amount of total information stored in cerebral cortex'
        ],
        correctIndex: 0,
        explanation: 'The spacing effect and active retrieval right as a memory trace begins to weaken creates "desirable difficulty," maximizing synaptic consolidation and durable retention.',
        damageToBoss: 35,
        bossAttackFlavor: 'The boss unleashes the Fog of Forgetfulness!'
      }
    ]
  };
}

export async function generateFlashcardsAI(topic: string, count: number = 5): Promise<Flashcard[]> {
  try {
    const res = await fetch('/api/gemini/generate-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, count })
    });
    const data = await res.json();
    if (data.success && data.deck && data.deck.cards?.length) {
      return data.deck.cards.map((c: any) => ({
        id: 'fc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        topic: topic,
        front: c.front,
        back: c.back,
        mnemonic: c.mnemonic || '',
        interval: 1,
        easeFactor: 2.5,
        reviews: 0,
        nextReviewDate: new Date().toISOString().split('T')[0],
        masteryLevel: 0
      }));
    }
  } catch (err) {
    console.warn('Flashcard generation API fallback:', err);
  }

  // Fallback cards for the topic
  return [
    {
      id: 'fc_fb_1_' + Date.now(),
      topic,
      front: `What is the core principle or definition of: ${topic}?`,
      back: `A foundational conceptual structure governing behavior, derivation, and application within this domain.`,
      mnemonic: 'Remember the roots before climbing the branches!',
      interval: 1,
      easeFactor: 2.5,
      reviews: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      masteryLevel: 0
    },
    {
      id: 'fc_fb_2_' + Date.now(),
      topic,
      front: `What is the most common mistake or pitfall students make when applying: ${topic}?`,
      back: `Failing to check underlying assumptions, boundary conditions, or edge cases before invoking formulas.`,
      mnemonic: 'Inspect the foundation before casting the spell!',
      interval: 1,
      easeFactor: 2.5,
      reviews: 0,
      nextReviewDate: new Date().toISOString().split('T')[0],
      masteryLevel: 0
    }
  ];
}

export async function askScribeChat(
  messages: ScribeMessage[],
  userContext: { level: number; currentPlanTitle: string; totalFocusMinutes: number; streak: number }
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/scribe-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userContext })
    });
    const data = await res.json();
    if (data.reply) {
      return data.reply;
    }
  } catch (err) {
    console.warn('Scribe chat API error:', err);
  }
  return "Greetings, Apprentice! I am tuning into the cosmic grimoire. What concept shall we decipher, or what quest needs rebalancing today?";
}
