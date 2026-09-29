import React from 'react';
import { 
  Calendar, 
  Hourglass, 
  DollarSign, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  MapPin,
  TrendingUp,
  Tag
} from 'lucide-react';
import { 
  Task, 
  ClassSession, 
  Exam, 
  InternshipApp, 
  Expense, 
  BudgetConfig, 
  CampusEvent,
  DailyPlan,
  NavTab
} from '../../types';
import { formatCurrency, getDaysLeft, getDaysLeftInCurrentMonth } from '../../utils/helpers';

interface OverviewViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  classes: ClassSession[];
  exams: Exam[];
  internships: InternshipApp[];
  expenses: Expense[];
  budget: BudgetConfig;
  events: CampusEvent[];
  dailyPlan: DailyPlan;
  onNavigate: (tab: NavTab) => void;
  onOpenQuickTask: () => void;
  onOpenQuickExpense: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tasks,
  onToggleTask,
  classes,
  exams,
  internships,
  expenses,
  budget,
  events,
  dailyPlan,
  onNavigate,
  onOpenQuickTask,
  onOpenQuickExpense
}) => {
  // Filter today's classes (Monday for demo / current day)
  const todayName = 'Monday'; // default demo day
  const todayClasses = classes.filter(c => c.dayOfWeek === todayName);

  // Urgent pending tasks
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');

  // Nearest exam
  const sortedExams = [...exams].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));
  const nearestExam = sortedExams[0];
  const nearestExamDays = nearestExam ? getDaysLeft(nearestExam.date) : 0;

  // Monthly budget math
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = Math.max(0, budget.monthlyLimit - totalSpent);
  const daysLeftInMonth = getDaysLeftInCurrentMonth();
  const dailyAllowance = remainingBudget / daysLeftInMonth;

  // Active internships
  const activeInterviews = internships.filter(i => i.status === 'interview' || i.status === 'oa_screening');

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-850 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
            Welcome back, Alex
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monday, September 29, 2026 · Fall Semester · B.S. Computer Science & Economics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-sm shadow-indigo-600/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Today's Action Plan</span>
          </button>
        </div>
      </div>

      {/* 2. "What Should I Do Today?" AI Briefing Hero Card */}
      <div className="p-5 rounded-xl bg-zinc-900/90 border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Advisor Briefing</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{dailyPlan.generatedAt}</span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-zinc-100 tracking-tight leading-snug">
              "{dailyPlan.headline}"
            </p>

            {/* Top 3 Priorities preview */}
            <div className="pt-1 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-zinc-300">
              {dailyPlan.topPriorities.slice(0, 3).map((priority, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-md bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-[11px] font-mono text-indigo-400 font-bold shrink-0">0{idx + 1}.</span>
                  <span className="line-clamp-2 leading-relaxed">{priority}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex items-center lg:self-center">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-750 hover:text-white rounded-lg transition-colors border border-zinc-700/60"
            >
              <span>View Full Schedule & Chat</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Metric Strip (Tabular figures, high clarity) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric: Today's Classes */}
        <div 
          onClick={() => onNavigate('study-timetable')}
          className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Today's Classes</span>
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-zinc-100 tabular-nums">
            {todayClasses.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 truncate">
            {todayClasses[0] ? `Next: ${todayClasses[0].courseCode} at ${todayClasses[0].startTime}` : 'No more classes today'}
          </div>
        </div>

        {/* Metric: Urgent Tasks */}
        <div 
          onClick={() => onNavigate('study-tasks')}
          className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Pending Tasks</span>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-zinc-100 tabular-nums">
            {pendingTasks.length}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            {highPriorityTasks.length} high priority
          </div>
        </div>

        {/* Metric: Nearest Exam */}
        <div 
          onClick={() => onNavigate('study-exams')}
          className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Nearest Exam</span>
            <Hourglass className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-amber-400 tabular-nums">
            {nearestExamDays <= 0 ? 'Today!' : `${nearestExamDays} Days`}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 truncate">
            {nearestExam ? `${nearestExam.courseCode} Midterm` : 'None'}
          </div>
        </div>

        {/* Metric: Safe Daily Spend */}
        <div 
          onClick={() => onNavigate('money-budget')}
          className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Daily Allowance</span>
            <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {formatCurrency(dailyAllowance)}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {formatCurrency(remainingBudget)} left this month
          </div>
        </div>
      </div>

      {/* 4. Core Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Today's Schedule & Interactive Tasks */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Schedule Card */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Today's Classes ({todayName})</span>
              </h2>
              <button
                onClick={() => onNavigate('study-timetable')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Full Week
              </button>
            </div>

            <div className="space-y-2">
              {todayClasses.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  No classes scheduled for today. Enjoy your study sprint!
                </div>
              ) : (
                todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-10 rounded-full bg-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-zinc-100 font-mono">
                            {cls.courseCode}
                          </span>
                          <span className="text-[11px] text-zinc-400">·</span>
                          <span className="text-xs text-zinc-200">{cls.title}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {cls.room}
                          </span>
                          <span>·</span>
                          <span>{cls.lecturer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-medium text-zinc-300 tabular-nums">
                        {cls.startTime} - {cls.endTime}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        {cls.type}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Priority Tasks Checklist Card */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Priority Assignments ({pendingTasks.length} pending)</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenQuickTask}
                  className="text-xs text-zinc-300 hover:text-white px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  + Add Task
                </button>
                <button
                  onClick={() => onNavigate('study-tasks')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  View All
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {pendingTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 flex items-start justify-between gap-3 group hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${
                        task.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                        <span className="font-mono text-zinc-300">{task.course}</span>
                        <span>·</span>
                        <span>Due {task.dueDate}</span>
                        {task.estimatedHours && (
                          <>
                            <span>·</span>
                            <span>{task.estimatedHours}h est.</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono shrink-0 uppercase tracking-wider ${
                    task.priority === 'high' ? 'text-rose-400' : task.priority === 'medium' ? 'text-amber-400' : 'text-zinc-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Exam Spotlight + Career Pipeline + Campus Spotlight */}
        <div className="lg:col-span-5 space-y-6">
          {/* Nearest Exam Card */}
          {nearestExam && (
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                  <Hourglass className="w-4 h-4 text-amber-400" />
                  <span>Countdown: {nearestExam.courseCode} Midterm</span>
                </h2>
                <button
                  onClick={() => onNavigate('study-exams')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  All Exams
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{nearestExam.title}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{nearestExam.date} · {nearestExam.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                      {nearestExamDays}d
                    </div>
                    <div className="text-[10px] text-zinc-400">remaining</div>
                  </div>
                </div>

                {/* Syllabus Coverage */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Syllabus Coverage</span>
                    <span className="font-mono text-zinc-200">{nearestExam.syllabusCoverage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${nearestExam.syllabusCoverage}%` }}
                    />
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span className="truncate">{nearestExam.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Internship Pipeline */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Internship Tracker</span>
              </h2>
              <button
                onClick={() => onNavigate('career-internships')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Pipeline ({internships.length})
              </button>
            </div>

            <div className="space-y-2">
              {activeInterviews.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">{item.company}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{item.role}</div>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">
                      {item.status}
                    </span>
                  </div>

                  {item.nextAction && (
                    <div className="mt-2 text-[11px] text-zinc-300 bg-zinc-900/80 p-2 rounded border border-zinc-850">
                      <span className="font-semibold text-zinc-200">Next: </span>
                      {item.nextAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Campus Events Spotlight */}
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Campus Spotlight</span>
              </h2>
              <button
                onClick={() => onNavigate('campus-events')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                All Events
              </button>
            </div>

            {events[0] && (
              <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 space-y-2">
                <div className="text-xs font-semibold text-zinc-100">{events[0].title}</div>
                <div className="text-[11px] text-zinc-400">
                  {events[0].date} · {events[0].time}
                </div>
                <div className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                  {events[0].description}
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{events[0].attendeesCount} RSVP'd</span>
                  <button
                    onClick={() => onNavigate('campus-events')}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    View details →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
