import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckSquare, 
  Calendar, 
  Hourglass, 
  Code, 
  Briefcase, 
  FileText, 
  Compass, 
  DollarSign, 
  PieChart, 
  ShoppingBag, 
  BookOpen, 
  CalendarDays, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { NavTab, Task, Exam, MarketplaceItem, NoteItem } from '../../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  tasks: Task[];
  exams: Exam[];
  marketItems: MarketplaceItem[];
  notes: NoteItem[];
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  tasks,
  exams,
  marketItems,
  notes,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems: { tab: NavTab; label: string; group: string; icon: React.ReactNode }[] = [
    { tab: 'overview', label: 'Dashboard Overview', group: 'Navigation', icon: <Layers className="w-3.5 h-3.5" /> },
    { tab: 'ai-assistant', label: 'AI Assistant ("What should I do today?")', group: 'AI', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> },
    { tab: 'study-tasks', label: 'Study / Tasks & Assignments', group: 'Study', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { tab: 'study-timetable', label: 'Study / Weekly Timetable', group: 'Study', icon: <Calendar className="w-3.5 h-3.5" /> },
    { tab: 'study-exams', label: 'Study / Exam Countdown', group: 'Study', icon: <Hourglass className="w-3.5 h-3.5" /> },
    { tab: 'career-skills', label: 'Career / Technical Skills', group: 'Career', icon: <Code className="w-3.5 h-3.5" /> },
    { tab: 'career-internships', label: 'Career / Internship Pipeline', group: 'Career', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { tab: 'career-resume', label: 'Career / ATS Resume Builder', group: 'Career', icon: <FileText className="w-3.5 h-3.5" /> },
    { tab: 'career-roadmap', label: 'Career / 4-Year Roadmap', group: 'Career', icon: <Compass className="w-3.5 h-3.5" /> },
    { tab: 'money-expenses', label: 'Money / Expenses Ledger', group: 'Money', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { tab: 'money-budget', label: 'Money / Monthly Budget Breakdown', group: 'Money', icon: <PieChart className="w-3.5 h-3.5" /> },
    { tab: 'campus-market', label: 'Campus / Peer-to-Peer Buy & Sell', group: 'Campus', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
    { tab: 'campus-notes', label: 'Campus / Course Notes & Study Guides', group: 'Campus', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { tab: 'campus-events', label: 'Campus / Events & Hackathons', group: 'Campus', icon: <CalendarDays className="w-3.5 h-3.5" /> },
  ];

  const filteredNav = navItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.group.toLowerCase().includes(query.toLowerCase())
  );

  const matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
  const matchedExams = exams.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.courseCode.toLowerCase().includes(query.toLowerCase())).slice(0, 2);
  const matchedMarket = marketItems.filter(m => m.title.toLowerCase().includes(query.toLowerCase())).slice(0, 2);

  const handleSelectNav = (tab: NavTab) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search tasks, exams, marketplace, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4">
          {/* Navigation Items */}
          <div>
            <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
              Modules & Views
            </div>
            <div className="space-y-0.5">
              {filteredNav.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => handleSelectNav(item.tab)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors text-left"
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">{item.group}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Matching Content */}
          {query.trim() !== '' && (
            <>
              {matchedTasks.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                    Matching Assignments
                  </div>
                  {matchedTasks.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectNav('study-tasks')}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="truncate">{t.title}</span>
                      <span className="font-mono text-[10px] text-indigo-400">{t.course}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedExams.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                    Matching Exams
                  </div>
                  {matchedExams.map(e => (
                    <button
                      key={e.id}
                      onClick={() => handleSelectNav('study-exams')}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="truncate">{e.title}</span>
                      <span className="font-mono text-[10px] text-amber-400">{e.date}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedMarket.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
                    Campus Marketplace Items
                  </div>
                  {matchedMarket.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectNav('campus-market')}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="truncate">{m.title}</span>
                      <span className="font-mono text-[10px] text-emerald-400">${m.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
