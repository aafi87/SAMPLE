import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client safely
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// 1. Generate Full Gamified Study Quest Plan
app.post('/api/gemini/generate-plan', async (req, res) => {
  try {
    const { subject, examDate, hoursPerWeek, syllabusText, intensity, realmTheme } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY found, using local arcane grimoire generator.'
      });
    }

    const prompt = `You are the Grand Archmage of Aetheria, an advanced study planner that gamifies learning into an RPG campaign.
Deconstruct the following study goals/syllabus into a structured, high-impact gamified study campaign.

Subject: ${subject || 'Computer Science & Algorithms'}
Exam / Goal Date: ${examDate || 'In 4 weeks'}
Target Study Hours / Week: ${hoursPerWeek || 10} hours
Study Intensity: ${intensity || 'Balanced Adventurer'}
Realm Theme: ${realmTheme || 'Celestial Academy'}
Syllabus / Topics provided by student:
"""
${syllabusText || 'Core principles, active recall, foundational practice, advanced problem solving, mock exam tests.'}
"""

Return a pure JSON object (NO markdown fences, NO extra text) matching this EXACT schema:
{
  "title": "Campaign Title (e.g. Siege of the Binary Citadel)",
  "synopsis": "A 2-sentence whimsical heroic description of this study campaign.",
  "subject": "${subject || 'General Study'}",
  "totalEstHours": number,
  "difficulty": "Novice" | "Adept" | "Master" | "Mythic",
  "chapters": [
    {
      "id": "chap_1",
      "chapterNumber": 1,
      "title": "Chapter name",
      "flavor": "Whimsical lore subtitle",
      "bossName": "Name of chapter exam boss (e.g. Chimera of Asymptotic Time)",
      "bossHp": 100,
      "quests": [
        {
          "id": "quest_1_1",
          "title": "Quest / topic name",
          "estMinutes": 45,
          "xpReward": 120,
          "category": "Theory" | "Practice" | "Review" | "Flashcards",
          "focusGoal": "Specific actionable study outcome",
          "tasks": [
            "Specific step 1",
            "Specific step 2",
            "Specific step 3"
          ],
          "milestoneDay": 1
        }
      ]
    }
  ]
}
Generate 3 to 4 distinct chapters, with 2 to 3 practical quests per chapter, carefully sequenced from fundamentals to mastery.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, plan: parsed });
  } catch (err: any) {
    console.error('Error generating plan with Gemini:', err);
    return res.status(200).json({
      fallback: true,
      error: err.message,
    });
  }
});

// 2. Generate RPG Boss Battle Quiz
app.post('/api/gemini/generate-quiz', async (req, res) => {
  try {
    const { topic, bossName, difficulty } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const prompt = `You are creating an RPG boss battle study quiz for the topic: "${topic}".
Boss: "${bossName || 'The Guardian of Knowledge'}". Difficulty: "${difficulty || 'Adept'}".

Generate 4 challenging, high-quality multiple choice questions that test deep conceptual understanding.
Return a pure JSON object (NO markdown fences):
{
  "bossName": "${bossName || 'The Guardian of Knowledge'}",
  "introDialogue": "A dramatic 1-line quote from the boss challenging the apprentice.",
  "defeatDialogue": "A gracious 1-line quote upon defeating the boss.",
  "rounds": [
    {
      "id": "round_1",
      "question": "Clear conceptual question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct and what spell/concept it aligns with.",
      "damageToBoss": 25,
      "bossAttackFlavor": "How the boss counterattacks if the student misses."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, quiz: parsed });
  } catch (err: any) {
    console.error('Error generating quiz:', err);
    return res.status(200).json({ fallback: true, error: err.message });
  }
});

// 3. Generate Spaced Repetition Flashcards
app.post('/api/gemini/generate-flashcards', async (req, res) => {
  try {
    const { topic, count } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(200).json({ fallback: true });
    }

    const prompt = `Create ${count || 6} high-yield alchemical flashcards for rapid spaced-repetition active recall on the topic: "${topic}".
Return a pure JSON object (NO markdown fences):
{
  "topic": "${topic}",
  "cards": [
    {
      "id": "card_1",
      "front": "Concise prompt or concept question",
      "back": "Clear, precise explanation with key takeaway",
      "mnemonic": "A short, memorable whimsical rhyme or memory hook",
      "masteryLevel": 0
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, deck: parsed });
  } catch (err: any) {
    console.error('Error generating flashcards:', err);
    return res.status(200).json({ fallback: true, error: err.message });
  }
});

// 4. Archmage Scribe Chat / AI Tutor & Study Companion
app.post('/api/gemini/scribe-chat', async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.status(200).json({
        reply: "Greetings, Apprentice! I am in offline mode, but remember: consistency casts the strongest enchantments. Review your flashcards and conquer one quest today!"
      });
    }

    const systemInstruction = `You are 'Pip & Archmage Aurelius', the whimsical and brilliant AI study companion in Aetheria.
Your personality is charming, wise, scholarly, encouraging, and slightly whimsical (mentioning grimoires, mana, spells, and cosmic study tea).
Current Student Context:
- Current Level: ${userContext?.level || 1}
- Current Campaign: ${userContext?.currentPlanTitle || 'Novice Journey'}
- Focus minutes logged: ${userContext?.totalFocusMinutes || 0} min
- Streak: ${userContext?.streak || 1} days

Guidelines:
1. Provide accurate, clear, and high-yield academic explanations.
2. Break complex concepts into intuitive analogies or mnemonic formulas.
3. If the student asks how to fix a schedule or feels overwhelmed, provide a calm 3-step prioritized triage.
4. Keep responses punchy, engaging, and well-structured with bullet points where appropriate.`;

    const chatMessages = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatMessages,
      config: {
        systemInstruction,
      }
    });

    return res.json({ reply: response.text || 'The scrolls are silent at this moment.' });
  } catch (err: any) {
    console.error('Error in scribe chat:', err);
    return res.status(200).json({
      reply: "A brief cosmic storm disrupted our magical link! Try asking again in a moment."
    });
  }
});

// Serve frontend with Vite in dev, static in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`✨ Aetheria Grimoire Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
