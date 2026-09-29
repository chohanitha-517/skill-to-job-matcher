import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Hourglass, 
  Sparkles, 
  Briefcase, 
  FileText, 
  Compass, 
  DollarSign, 
  PieChart, 
  ShoppingBag, 
  BookOpen, 
  CalendarDays, 
  Bot, 
  Layers, 
  RotateCcw,
  Zap,
  Code
} from 'lucide-react';
import { NavTab, Task, Exam, InternshipApp } from '../../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  tasks: Task[];
  exams: Exam[];
  internships: InternshipApp[];
  onResetData: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  tasks,
  exams,
  internships,
  onResetData,
  mobileOpen,
  setMobileOpen
}) => {
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const activeInternshipsCount = internships.filter(i => i.status === 'applied' || i.status === 'oa_screening' || i.status === 'interview').length;

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-68 bg-zinc-950 border-r border-zinc-800/80 
        flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Lockup */}
        <div className="p-4 border-b border-zinc-850">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30 font-bold text-sm tracking-wider">
                OS
              </div>
              <div>
                <h1 className="font-semibold text-sm tracking-tight text-zinc-100 flex items-center gap-1.5">
                  STUDENT LIFE OS
                </h1>
                <p className="text-[11px] text-zinc-400">
                  Alex Rivera · Fall 2026
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Advisor CTA */}
          <button
            onClick={() => handleNavClick('ai-assistant')}
            className={`mt-3 w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ai-assistant'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-zinc-900/90 text-indigo-300 hover:bg-zinc-850 hover:text-indigo-200 border border-indigo-500/20'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              What should I do today?
            </span>
            <Zap className="w-3 h-3 text-indigo-400" />
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
          {/* Main Hub */}
          <div>
            <button
              onClick={() => handleNavClick('overview')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Layers className="w-4 h-4 text-zinc-400" />
              <span>Dashboard Overview</span>
            </button>
          </div>

          {/* 📚 STUDY */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              📚 Study
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('study-tasks')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'study-tasks'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CheckSquare className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Tasks</span>
                </span>
                {pendingTasksCount > 0 && (
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {pendingTasksCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('study-timetable')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'study-timetable'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Timetable</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Weekly</span>
              </button>

              <button
                onClick={() => handleNavClick('study-exams')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'study-exams'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Hourglass className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Exam Countdown</span>
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  {exams.length} upcoming
                </span>
              </button>
            </div>
          </div>

          {/* 💼 CAREER */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              💼 Career
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('career-skills')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'career-skills'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-zinc-400" />
                <span>Skills</span>
              </button>

              <button
                onClick={() => handleNavClick('career-internships')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'career-internships'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Internships</span>
                </span>
                {activeInternshipsCount > 0 && (
                  <span className="text-[11px] text-indigo-400 font-mono">
                    {activeInternshipsCount} active
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('career-resume')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'career-resume'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Resume Builder</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">ATS</span>
              </button>

              <button
                onClick={() => handleNavClick('career-roadmap')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'career-roadmap'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-zinc-400" />
                <span>Career Roadmap</span>
              </button>
            </div>
          </div>

          {/* 💰 MONEY */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              💰 Money
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('money-expenses')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'money-expenses'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                <span>Expenses Ledger</span>
              </button>

              <button
                onClick={() => handleNavClick('money-budget')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'money-budget'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <PieChart className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Monthly Budget</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">$1,100</span>
              </button>
            </div>
          </div>

          {/* 🤝 CAMPUS */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              🤝 Campus
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('campus-market')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'campus-market'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                <span>Buy / Sell Market</span>
              </button>

              <button
                onClick={() => handleNavClick('campus-notes')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'campus-notes'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                <span>Course Notes</span>
              </button>

              <button
                onClick={() => handleNavClick('campus-events')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'campus-events'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Campus Events</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">4 live</span>
              </button>
            </div>
          </div>

          {/* 🧠 AI ASSISTANT */}
          <div>
            <div className="px-2 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              🧠 AI Assistant
            </div>
            <div>
              <button
                onClick={() => handleNavClick('ai-assistant')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors ${
                  activeTab === 'ai-assistant'
                    ? 'bg-zinc-850 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>"What should I do today?"</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer info & Reset sample data */}
        <div className="p-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400">
          <button
            onClick={onResetData}
            title="Reset to default authentic student data"
            className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
          <span className="font-mono text-[10px] text-zinc-400">
            v2.4 · 2026
          </span>
        </div>
      </aside>
    </>
  );
};
