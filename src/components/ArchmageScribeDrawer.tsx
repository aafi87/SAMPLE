import React, { useState, useRef, useEffect } from 'react';
import { UserStats, StudyPlan, ScribeMessage } from '../types';
import { sound } from '../utils/soundEffects';
import { askScribeChat } from '../utils/api';
import {
  Sparkles,
  Send,
  Wand2,
  BookOpen,
  MessageSquare,
  Bot,
  User,
  X
} from 'lucide-react';

interface ArchmageScribeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  currentPlan: StudyPlan | null;
}

export const ArchmageScribeDrawer: React.FC<ArchmageScribeDrawerProps> = ({
  isOpen,
  onClose,
  userStats,
  currentPlan,
}) => {
  const [messages, setMessages] = useState<ScribeMessage[]>([
    {
      id: 'msg_welcome',
      role: 'model',
      content: `Greetings, Apprentice! I am Archmage Aurelius, aided by Pip the scholar owl. Whether you need a concept deconstructed, a mnemonic rhyme forged, or your study schedule rebalanced—speak, and the scrolls shall answer.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputVal).trim();
    if (!content || isThinking) return;

    sound.playClick();
    const userMsg: ScribeMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content,
      timestamp: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);

    try {
      const userContext = {
        level: userStats.level,
        currentPlanTitle: currentPlan?.title || 'General Studies',
        totalFocusMinutes: userStats.totalFocusMinutes,
        streak: userStats.streakDays,
      };

      const reply = await askScribeChat([...messages, userMsg], userContext);
      sound.playSpellCast();

      const modelMsg: ScribeMessage = {
        id: 'msg_reply_' + Date.now(),
        role: 'model',
        content: reply,
        timestamp: 'Now'
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const quickPrompts = [
    'How do I master active recall for my exam?',
    'Give me a mnemonic spell to remember hard concepts',
    'I fell behind on study time, help me rebalance my plan',
    'Explain the Feynman Technique simply'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-amber-500/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cinzel text-base font-bold text-slate-100">
              Archmage Aurelius & Pip
            </h3>
            <p className="text-[11px] text-slate-400">
              AI Study Companion & Academic Oracle
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-indigo-950 border border-indigo-500/40 text-indigo-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[82%] border ${
                  isUser
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-100 rounded-tr-none'
                    : 'bg-slate-950/90 border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-3 text-xs leading-relaxed">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Scrying the cosmic grimoire...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto flex gap-1.5 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors border border-slate-700/60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask the Archmage anything..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isThinking}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
