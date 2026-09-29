import React from 'react';
import { 
  Menu, 
  Search, 
  Sparkles, 
  Plus, 
  Hourglass
} from 'lucide-react';
import { NavTab, Exam } from '../../types';
import { getDaysLeft } from '../../utils/helpers';

interface HeaderProps {
  activeTab: NavTab;
  onOpenCommand: () => void;
  onQuickAdd: () => void;
  onTriggerAi: () => void;
  onOpenMobileMenu: () => void;
  nearestExam?: Exam;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenCommand,
  onQuickAdd,
  onTriggerAi,
  onOpenMobileMenu,
  nearestExam
}) => {
  // Breadcrumb mapping
  const getBreadcrumb = (tab: NavTab) => {
    switch (tab) {
      case 'overview': return { section: 'Command Center', title: 'Dashboard Overview' };
      case 'study-tasks': return { section: 'Study', title: 'Tasks & Assignments' };
      case 'study-timetable': return { section: 'Study', title: 'Weekly Timetable' };
      case 'study-exams': return { section: 'Study', title: 'Exam Countdown' };
      case 'career-skills': return { section: 'Career', title: 'Skills & Technical Mastery' };
      case 'career-internships': return { section: 'Career', title: 'Internship Pipeline' };
      case 'career-resume': return { section: 'Career', title: 'Resume Bullet Builder' };
      case 'career-roadmap': return { section: 'Career', title: '4-Year Career Roadmap' };
      case 'money-expenses': return { section: 'Money', title: 'Expenses Ledger' };
      case 'money-budget': return { section: 'Money', title: 'Monthly Budget Breakdown' };
      case 'campus-market': return { section: 'Campus', title: 'Peer-to-Peer Buy & Sell' };
      case 'campus-notes': return { section: 'Campus', title: 'Course Notes & Study Guides' };
      case 'campus-events': return { section: 'Campus', title: 'Campus Events & Hackathons' };
      case 'ai-assistant': return { section: 'AI Assistant', title: '"What should I do today?"' };
      default: return { section: 'Student OS', title: 'Dashboard' };
    }
  };

  const breadcrumb = getBreadcrumb(activeTab);
  const examDays = nearestExam ? getDaysLeft(nearestExam.date) : null;

  return (
    <header className="sticky top-0 z-30 h-14 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs truncate">
          <span className="text-zinc-400 font-medium hidden sm:inline">
            {breadcrumb.section}
          </span>
          <span className="text-zinc-500 hidden sm:inline" aria-hidden="true">/</span>
          <h2 className="font-semibold text-zinc-100 truncate text-sm">
            {breadcrumb.title}
          </h2>
        </div>
      </div>

      {/* Zone 2: Live Status Ticker */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-zinc-400 font-medium">
        {nearestExam && examDays !== null && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Hourglass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-48">{nearestExam.courseCode} Midterm</span>
            <span className="text-amber-400 font-mono font-semibold">
              {examDays <= 0 ? 'Today' : `${examDays}d left`}
            </span>
          </div>
        )}
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Command Search button */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-400 bg-zinc-900 hover:bg-zinc-850 hover:text-zinc-200 rounded-md border border-zinc-800 transition-colors"
          title="Search or jump to module (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded">
            ⌘K
          </kbd>
        </button>

        {/* AI Action button */}
        <button
          onClick={onTriggerAi}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs shadow-indigo-600/30 whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">What should I do?</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Quick Add button */}
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-750 hover:text-white rounded-md transition-colors border border-zinc-700/60"
          title="Quick add task or expense"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Quick Add</span>
        </button>
      </div>
    </header>
  );
};
