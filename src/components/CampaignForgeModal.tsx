import React, { useState } from 'react';
import { StudyPlan } from '../types';
import { sound } from '../utils/soundEffects';
import { generateStudyPlanAI } from '../utils/api';
import confetti from 'canvas-confetti';
import {
  Wand2,
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  Compass,
  AlertCircle
} from 'lucide-react';

interface CampaignForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: StudyPlan) => void;
}

export const CampaignForgeModal: React.FC<CampaignForgeModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0]
  );
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [intensity, setIntensity] = useState('Balanced Adventurer');
  const [realmTheme, setRealmTheme] = useState('Celestial Spire');
  const [syllabusText, setSyllabusText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    sound.playSpellCast();
    setIsGenerating(true);

    try {
      const generated = await generateStudyPlanAI({
        subject: subject.trim(),
        examDate,
        hoursPerWeek: Number(hoursPerWeek),
        syllabusText: syllabusText.trim(),
        intensity,
        realmTheme,
      });

      sound.playLevelUp();
      onPlanCreated(generated);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {}

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-amber-500/30 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl font-bold text-slate-100">
                The Arcane Study Plan Forge
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Powered by Gemini AI · Deconstruct any exam or textbook into an epic RPG questline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {isGenerating ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto" />
            <h4 className="font-cinzel text-lg font-bold text-slate-200">
              Archmage Aurelius is Weaving Your Curriculum...
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Synthesizing chapter milestones, calculating active recall spacing, drafting micro-tasks, and summoning the final exam boss monster.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subject or Examination Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Quantum Mechanics, Bar Exam Constitutional Law, AP Biology..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Exam / Completion Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Weekly Study Target ({hoursPerWeek} hrs/week)
                </label>
                <input
                  type="range"
                  min="3"
                  max="35"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-amber-500 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campaign Intensity
                </label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Casual Scholar">Casual Scholar (Gentle pacing)</option>
                  <option value="Balanced Adventurer">Balanced Adventurer (Optimal spaced retention)</option>
                  <option value="Intense Grimoire Rush">Intense Grimoire Rush (Cramming & high speed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Realm Theme & Lore Style
                </label>
                <select
                  value={realmTheme}
                  onChange={(e) => setRealmTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Celestial Spire">Celestial Spire (High Magic & Astronomy)</option>
                  <option value="Alchemical Citadel">Alchemical Citadel (Potion brews & runes)</option>
                  <option value="Enchanted Biome">Enchanted Biome (Nature & organic genetics)</option>
                  <option value="Chrono-Spire">Chrono-Spire (Clockwork time dilation)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Syllabus Topics, Textbook Chapters, or Raw Notes (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Paste your professor's syllabus, textbook table of contents, or messy list of exam topics here. Gemini will organize it into clean, spaced chapters and quests."
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 italic">
                Generates actionable quests with realistic time estimates.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Forge Campaign with AI</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
