import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Hourglass, 
  DollarSign, 
  Send, 
  RefreshCw,
  Lightbulb,
  Zap,
  User,
  Calendar
} from 'lucide-react';
import { 
  Task, 
  ClassSession, 
  Exam, 
  BudgetConfig, 
  DailyPlan,
  DailyPlanScheduleBlock
} from '../../types';
import { fetchDailyPlan, sendChatToAi } from '../../services/geminiService';
import { formatCurrency, getDaysLeft } from '../../utils/helpers';

interface AIAssistantViewProps {
  tasks: Task[];
  classes: ClassSession[];
  exams: Exam[];
  budget: BudgetConfig;
  totalSpent: number;
  dailyPlan: DailyPlan;
  onUpdateDailyPlan: (plan: DailyPlan) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  tasks,
  classes,
  exams,
  budget,
  totalSpent,
  dailyPlan,
  onUpdateDailyPlan,
}) => {
  const [customFocus, setCustomFocus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: "Hello Alex! I am your Student Life OS AI Advisor. I have analyzed your schedule for today (CS201, MATH240, and CS240 Lab), your pending Problem Set 4, and your CS201 Midterm in 4 days. Ask me anything, or generate an updated daily action plan above!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Calculate live context
  const todayClasses = classes.filter(c => c.dayOfWeek === 'Monday');
  const sortedExams = [...exams].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));
  const nearestExam = sortedExams[0];
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const remainingBudget = Math.max(0, budget.monthlyLimit - totalSpent);
  const dailyAllowance = remainingBudget / 25; // approximate days remaining

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await fetchDailyPlan({
        studentName: 'Alex Rivera',
        todayDay: 'Monday',
        todayDate: 'September 29, 2026',
        classes: todayClasses.map(c => ({
          time: `${c.startTime} - ${c.endTime}`,
          code: c.courseCode,
          title: c.title,
          room: c.room,
          type: c.type
        })),
        tasks: pendingTasks.map(t => ({
          title: t.title,
          course: t.course,
          dueDate: t.dueDate,
          priority: t.priority
        })),
        exams: sortedExams.slice(0, 2).map(e => ({
          title: e.title,
          date: e.date,
          daysLeft: getDaysLeft(e.date),
          syllabusCoverage: e.syllabusCoverage
        })),
        budget: {
          monthlyLimit: budget.monthlyLimit,
          spent: totalSpent,
          dailyAllowance: Math.round(dailyAllowance)
        },
        customFocus: customFocus.trim()
      });

      onUpdateDailyPlan(plan);
    } catch (err) {
      console.error(err);
      // Fallback
      onUpdateDailyPlan({
        headline: 'Tactical Study Sprint: Conquer Algorithms DP & System Architecture Lab',
        topPriorities: [
          'Attend CS240 Lab and verify POSIX thread buffer mutex safety.',
          'Complete subproblems 2 & 3 of CS201 Problem Set 4 (Due in 3 days).',
          'Review matrix diagonalization eigenvalues for MATH240 Midterm (12 days left).'
        ],
        tacticalSchedule: [
          { time: '09:00 - 10:30', activity: 'CS201 Lecture', notes: 'Turing Hall 104. Focus on DAG topological ordering.' },
          { time: '11:00 - 12:30', activity: 'MATH240 Lecture', notes: 'Euler Science 210. Linear transformations and eigenspaces.' },
          { time: '14:00 - 16:00', activity: 'CS240 Systems Lab', notes: 'Silicon Lab 302. Concurrent thread buffer implementation.' },
          { time: '16:30 - 18:30', activity: 'Deep Work: Problem Set 4', notes: 'Library 3rd floor. Knock out the topological sort recurrence.' }
        ],
        examStudyTip: 'Use active recall: sketch state transition tables without looking at solutions.',
        financialTip: `Keep today's spend under $${Math.round(dailyAllowance)}. Pack a quick lunch or grab dining hall fuel.`,
        motivation: 'Small disciplined efforts compound into massive semester victories.',
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsChatLoading(true);

    try {
      const response = await sendChatToAi(userMessage, messages, {
        nearestExam: nearestExam ? `${nearestExam.courseCode} (${getDaysLeft(nearestExam.date)} days)` : 'None',
        pendingTasksCount: pendingTasks.length,
        dailyAllowance: Math.round(dailyAllowance)
      });

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `For your schedule today, I strongly recommend locking in 2 hours for ${pendingTasks[0]?.title || 'your highest priority task'} right after classes conclude. Let me know if you need specific technical concept breakdowns!`
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>AI Assistant: "What should I do today?"</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time daily schedule synthesis balancing classes, imminent problem sets, exam countdowns, and budget limits.
          </p>
        </div>
      </div>

      {/* Synthesis Trigger Control Box */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-indigo-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Custom focus (e.g. 'Feeling fatigued, give me an easy day' or 'Exam prep heavy')..."
              value={customFocus}
              onChange={(e) => setCustomFocus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-xs shadow-indigo-600/30 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Today's Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate "What should I do today?"</span>
              </>
            )}
          </button>
        </div>

        {/* Live Ingested Context Pills / Stats */}
        <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap pt-1 font-mono">
          <span>Ingesting:</span>
          <span className="text-zinc-300">{todayClasses.length} Classes Today</span>
          <span>·</span>
          <span className="text-zinc-300">{pendingTasks.length} Pending Tasks</span>
          <span>·</span>
          <span className="text-amber-400">{nearestExam ? `${nearestExam.courseCode} Midterm (${getDaysLeft(nearestExam.date)}d)` : 'No exams'}</span>
          <span>·</span>
          <span className="text-emerald-400">{formatCurrency(dailyAllowance)} Daily Allowance</span>
        </div>
      </div>

      {/* The Synthesized Daily Plan Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
        {/* Mission Headline */}
        <div className="space-y-1.5 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Zap className="w-4 h-4" />
            <span>Today's Tactical Directive · {dailyPlan.generatedAt}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100 leading-snug">
            "{dailyPlan.headline}"
          </h2>
        </div>

        {/* Top 3 Non-Negotiables */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Top 3 High-Impact Priorities</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {dailyPlan.topPriorities.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5"
              >
                <div className="text-xs font-mono font-bold text-indigo-400">
                  PRIORITY 0{idx + 1}
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Schedule Blocks */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Hour-by-Hour Tactical Execution Timeline</span>
          </div>

          <div className="space-y-2">
            {dailyPlan.tacticalSchedule.map((block, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold text-indigo-300 shrink-0 tabular-nums">
                    {block.time}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-100">
                      {block.activity}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      {block.notes}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Tips (Exam & Money) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Exam Strategy */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Hourglass className="w-3.5 h-3.5" />
              <span>Exam Tactic (CS201 in {getDaysLeft(nearestExam?.date || '')}d)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {dailyPlan.examStudyTip}
            </p>
          </div>

          {/* Budget & Lifestyle */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Financial & Health Guardrail</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {dailyPlan.financialTip}
            </p>
          </div>
        </div>

        {/* Motivational Footnote */}
        <div className="pt-2 border-t border-zinc-850 flex items-center gap-2 text-xs text-zinc-400 italic">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span>"{dailyPlan.motivation}"</span>
        </div>
      </div>

      {/* Interactive AI Chat / Advisor */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Interactive Academic & Career Advisor
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Powered by Gemini 3.8 Flash
          </span>
        </div>

        {/* Messages Stream */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-200'
                }`}
              >
                {msg.text}
              </div>

              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 italic pl-8">
              <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
              <span>Advisor is thinking...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask anything (e.g. 'How do I solve Bellman-Ford recurrence?', 'What should I wear to the career fair?')..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="px-3.5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
