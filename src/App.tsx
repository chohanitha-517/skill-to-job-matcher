import React, { useState, useEffect } from 'react';
import { NavTab, Task, ClassSession, Exam, SkillItem, InternshipApp, ResumeBullet, RoadmapMilestone, Expense, BudgetConfig, MarketplaceItem, NoteItem, CampusEvent, DailyPlan } from './types';
import { 
  INITIAL_TASKS, 
  INITIAL_CLASSES, 
  INITIAL_EXAMS, 
  INITIAL_SKILLS, 
  INITIAL_INTERNSHIPS, 
  INITIAL_RESUME_BULLETS, 
  INITIAL_ROADMAP, 
  INITIAL_EXPENSES, 
  INITIAL_BUDGET_CONFIG, 
  INITIAL_MARKETPLACE, 
  INITIAL_NOTES, 
  INITIAL_EVENTS, 
  INITIAL_DAILY_PLAN 
} from './data/initialData';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/views/OverviewView';
import { StudyTasksView } from './components/views/StudyTasksView';
import { StudyTimetableView } from './components/views/StudyTimetableView';
import { StudyExamCountdownView } from './components/views/StudyExamCountdownView';
import { CareerSkillsView } from './components/views/CareerSkillsView';
import { CareerInternshipsView } from './components/views/CareerInternshipsView';
import { CareerResumeView } from './components/views/CareerResumeView';
import { CareerRoadmapView } from './components/views/CareerRoadmapView';
import { MoneyExpensesView } from './components/views/MoneyExpensesView';
import { MoneyBudgetView } from './components/views/MoneyBudgetView';
import { CampusMarketView } from './components/views/CampusMarketView';
import { CampusNotesView } from './components/views/CampusNotesView';
import { CampusEventsView } from './components/views/CampusEventsView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { getDaysLeft } from './utils/helpers';

const STORAGE_KEY = 'student_life_os_state_v2';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Core Data States with localStorage hydration
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [classes, setClasses] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_skills`);
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [internships, setInternships] = useState<InternshipApp[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_internships`);
    return saved ? JSON.parse(saved) : INITIAL_INTERNSHIPS;
  });

  const [resumeBullets, setResumeBullets] = useState<ResumeBullet[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bullets`);
    return saved ? JSON.parse(saved) : INITIAL_RESUME_BULLETS;
  });

  const [roadmapMilestones, setRoadmapMilestones] = useState<RoadmapMilestone[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_roadmap`);
    return saved ? JSON.parse(saved) : INITIAL_ROADMAP;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [budget, setBudget] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
    return saved ? JSON.parse(saved) : INITIAL_BUDGET_CONFIG;
  });

  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_market`);
    return saved ? JSON.parse(saved) : INITIAL_MARKETPLACE;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_daily_plan`);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_PLAN;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_skills`, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_internships`, JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bullets`, JSON.stringify(resumeBullets));
  }, [resumeBullets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_roadmap`, JSON.stringify(roadmapMilestones));
  }, [roadmapMilestones]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_budget`, JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_market`, JSON.stringify(marketItems));
  }, [marketItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_daily_plan`, JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  // Global Cmd+K trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleResetData = () => {
    if (confirm('Reset Student Life OS to original sample data? This will restore realistic courses, tasks, exams, and applications.')) {
      setTasks(INITIAL_TASKS);
      setClasses(INITIAL_CLASSES);
      setExams(INITIAL_EXAMS);
      setSkills(INITIAL_SKILLS);
      setInternships(INITIAL_INTERNSHIPS);
      setResumeBullets(INITIAL_RESUME_BULLETS);
      setRoadmapMilestones(INITIAL_ROADMAP);
      setExpenses(INITIAL_EXPENSES);
      setBudget(INITIAL_BUDGET_CONFIG);
      setMarketItems(INITIAL_MARKETPLACE);
      setNotes(INITIAL_NOTES);
      setEvents(INITIAL_EVENTS);
      setDailyPlan(INITIAL_DAILY_PLAN);
    }
  };

  // Study: Tasks
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = { ...newTask, id: `task-${Date.now()}` };
    setTasks(prev => [task, ...prev]);
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // Study: Timetable
  const handleAddClass = (session: Omit<ClassSession, 'id'>) => {
    const cls: ClassSession = { ...session, id: `cls-${Date.now()}` };
    setClasses(prev => [...prev, cls]);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // Study: Exams
  const handleAddExam = (newExam: Omit<Exam, 'id'>) => {
    const exam: Exam = { ...newExam, id: `exam-${Date.now()}` };
    setExams(prev => [...prev, exam]);
  };

  const handleUpdateExam = (updated: Exam) => {
    setExams(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const handleDeleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Career: Skills
  const handleAddSkill = (skill: Omit<SkillItem, 'id'>) => {
    const newSkill: SkillItem = { ...skill, id: `sk-${Date.now()}` };
    setSkills(prev => [...prev, newSkill]);
  };

  const handleUpdateSkill = (updated: SkillItem) => {
    setSkills(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  // Career: Internships
  const handleAddInternship = (app: Omit<InternshipApp, 'id'>) => {
    const newApp: InternshipApp = { ...app, id: `int-${Date.now()}` };
    setInternships(prev => [newApp, ...prev]);
  };

  const handleUpdateInternship = (updated: InternshipApp) => {
    setInternships(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const handleDeleteInternship = (id: string) => {
    setInternships(prev => prev.filter(i => i.id !== id));
  };

  // Career: Resume
  const handleAddBullet = (bullet: Omit<ResumeBullet, 'id'>) => {
    const newBullet: ResumeBullet = { ...bullet, id: `rb-${Date.now()}` };
    setResumeBullets(prev => [newBullet, ...prev]);
  };

  const handleDeleteBullet = (id: string) => {
    setResumeBullets(prev => prev.filter(b => b.id !== id));
  };

  // Career: Roadmap
  const handleToggleMilestone = (id: string) => {
    setRoadmapMilestones(prev => prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
  };

  const handleAddMilestone = (milestone: Omit<RoadmapMilestone, 'id'>) => {
    const newM: RoadmapMilestone = { ...milestone, id: `rm-${Date.now()}` };
    setRoadmapMilestones(prev => [...prev, newM]);
  };

  const handleDeleteMilestone = (id: string) => {
    setRoadmapMilestones(prev => prev.filter(m => m.id !== id));
  };

  // Money: Expenses
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExp: Expense = { ...expense, id: `exp-${Date.now()}` };
    setExpenses(prev => [newExp, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Campus: Market
  const handleAddMarketItem = (item: Omit<MarketplaceItem, 'id'>) => {
    const newItem: MarketplaceItem = { ...item, id: `item-${Date.now()}` };
    setMarketItems(prev => [newItem, ...prev]);
  };

  const handleToggleSold = (id: string) => {
    setMarketItems(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'sold' ? 'available' : 'sold' } : m));
  };

  const handleDeleteMarketItem = (id: string) => {
    setMarketItems(prev => prev.filter(m => m.id !== id));
  };

  // Campus: Notes
  const handleAddNote = (note: Omit<NoteItem, 'id' | 'downloadsCount'>) => {
    const newNote: NoteItem = { ...note, id: `note-${Date.now()}`, downloadsCount: 1 };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Campus: Events
  const handleToggleRsvp = (id: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const nextRsvp = !ev.isRsvpd;
        return {
          ...ev,
          isRsvpd: nextRsvp,
          attendeesCount: nextRsvp ? ev.attendeesCount + 1 : Math.max(0, ev.attendeesCount - 1)
        };
      }
      return ev;
    }));
  };

  const handleAddEvent = (event: Omit<CampusEvent, 'id' | 'isRsvpd' | 'attendeesCount'>) => {
    const newEv: CampusEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      isRsvpd: true,
      attendeesCount: 1
    };
    setEvents(prev => [newEv, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Compute nearest exam
  const sortedExams = [...exams].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));
  const nearestExam = sortedExams[0];
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tasks={tasks}
        exams={exams}
        internships={internships}
        onResetData={handleResetData}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onOpenCommand={() => setIsCommandOpen(true)}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          onTriggerAi={() => setActiveTab('ai-assistant')}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          nearestExam={nearestExam}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Dashboard Hub */}
          {activeTab === 'overview' && (
            <OverviewView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              classes={classes}
              exams={exams}
              internships={internships}
              expenses={expenses}
              budget={budget}
              events={events}
              dailyPlan={dailyPlan}
              onNavigate={setActiveTab}
              onOpenQuickTask={() => setIsQuickAddOpen(true)}
              onOpenQuickExpense={() => setIsQuickAddOpen(true)}
            />
          )}

          {/* 📚 STUDY */}
          {activeTab === 'study-tasks' && (
            <StudyTasksView
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'study-timetable' && (
            <StudyTimetableView
              classes={classes}
              onAddClass={handleAddClass}
              onDeleteClass={handleDeleteClass}
            />
          )}

          {activeTab === 'study-exams' && (
            <StudyExamCountdownView
              exams={exams}
              onAddExam={handleAddExam}
              onUpdateExam={handleUpdateExam}
              onDeleteExam={handleDeleteExam}
            />
          )}

          {/* 💼 CAREER */}
          {activeTab === 'career-skills' && (
            <CareerSkillsView
              skills={skills}
              onAddSkill={handleAddSkill}
              onDeleteSkill={handleDeleteSkill}
              onUpdateSkill={handleUpdateSkill}
            />
          )}

          {activeTab === 'career-internships' && (
            <CareerInternshipsView
              internships={internships}
              onAddInternship={handleAddInternship}
              onUpdateInternship={handleUpdateInternship}
              onDeleteInternship={handleDeleteInternship}
            />
          )}

          {activeTab === 'career-resume' && (
            <CareerResumeView
              bullets={resumeBullets}
              onAddBullet={handleAddBullet}
              onDeleteBullet={handleDeleteBullet}
            />
          )}

          {activeTab === 'career-roadmap' && (
            <CareerRoadmapView
              milestones={roadmapMilestones}
              onToggleMilestone={handleToggleMilestone}
              onAddMilestone={handleAddMilestone}
              onDeleteMilestone={handleDeleteMilestone}
            />
          )}

          {/* 💰 MONEY */}
          {activeTab === 'money-expenses' && (
            <MoneyExpensesView
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'money-budget' && (
            <MoneyBudgetView
              budget={budget}
              expenses={expenses}
              onUpdateBudget={setBudget}
            />
          )}

          {/* 🤝 CAMPUS */}
          {activeTab === 'campus-market' && (
            <CampusMarketView
              items={marketItems}
              onAddItem={handleAddMarketItem}
              onToggleSold={handleToggleSold}
              onDeleteItem={handleDeleteMarketItem}
            />
          )}

          {activeTab === 'campus-notes' && (
            <CampusNotesView
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activeTab === 'campus-events' && (
            <CampusEventsView
              events={events}
              onToggleRsvp={handleToggleRsvp}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {/* 🧠 AI ASSISTANT */}
          {activeTab === 'ai-assistant' && (
            <AIAssistantView
              tasks={tasks}
              classes={classes}
              exams={exams}
              budget={budget}
              totalSpent={totalSpent}
              dailyPlan={dailyPlan}
              onUpdateDailyPlan={setDailyPlan}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPaletteModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={setActiveTab}
        tasks={tasks}
        exams={exams}
        marketItems={marketItems}
        notes={notes}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTask={handleAddTask}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
}
