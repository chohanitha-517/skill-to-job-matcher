import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Task } from '../../types';
import { getRelativeDateBadge } from '../../utils/helpers';

interface StudyTasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const StudyTasksView: React.FC<StudyTasksViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS201');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newHours, setNewHours] = useState(2);
  const [newNotes, setNewNotes] = useState('');

  // Unique courses for filter
  const uniqueCourses = Array.from(new Set(tasks.map(t => t.course)));

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (courseFilter !== 'all' && task.course !== courseFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return task.title.toLowerCase().includes(q) || (task.notes && task.notes.toLowerCase().includes(q));
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      course: newCourse,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      priority: newPriority,
      status: 'todo',
      estimatedHours: Number(newHours) || 1,
      notes: newNotes,
      subtasks: []
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (taskId: string, subtaskTitle: string) => {
    if (!subtaskTitle.trim()) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newSt = {
      id: `st-${Date.now()}`,
      title: subtaskTitle.trim(),
      completed: false
    };

    onUpdateTask({ ...task, subtasks: [...task.subtasks, newSt] });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <span>Tasks & Assignments</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track coursework, problem sets, and study milestones with subtask breakdowns.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['all', 'todo', 'in_progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {status === 'all' && `All (${tasks.length})`}
              {status === 'todo' && `To Do (${tasks.filter(t => t.status === 'todo').length})`}
              {status === 'in_progress' && `In Progress (${tasks.filter(t => t.status === 'in_progress').length})`}
              {status === 'completed' && `Completed (${tasks.filter(t => t.status === 'completed').length})`}
            </button>
          ))}
        </div>

        {/* Search & Course Filter */}
        <div className="flex items-center gap-2">
          {/* Course select */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-lg focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 w-36 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/80">
            <CheckSquare className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 font-medium">No tasks found matching your filters</p>
            <p className="text-[11px] text-zinc-500 mt-1">Add a new assignment or clear your filter criteria.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const dateBadge = getRelativeDateBadge(task.dueDate);
            const isExpanded = expandedTaskId === task.id;
            const completedSubtasks = task.subtasks.filter(st => st.completed).length;

            return (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className={`text-sm font-semibold ${
                          task.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-100'
                        }`}>
                          {task.title}
                        </h3>
                      </div>

                      {/* Clean Metadata without pill boxes (Frontend-Design Section 1.A) */}
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400 flex-wrap">
                        <span className="font-mono text-zinc-300 font-medium">{task.course}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-mono ${
                          dateBadge.urgency === 'overdue' ? 'text-rose-400 font-semibold' :
                          dateBadge.urgency === 'today' ? 'text-amber-400 font-semibold' :
                          'text-zinc-400'
                        }`}>
                          {dateBadge.label} ({task.dueDate})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{task.estimatedHours}h est.</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-mono uppercase text-[10px] ${
                          task.priority === 'high' ? 'text-rose-400 font-bold' :
                          task.priority === 'medium' ? 'text-amber-400' :
                          'text-zinc-400'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {task.subtasks.length > 0 && (
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-950 rounded border border-zinc-800"
                      >
                        <span className="font-mono text-[11px]">{completedSubtasks}/{task.subtasks.length}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Task Notes */}
                {task.notes && (
                  <p className="text-xs text-zinc-400 pl-8 leading-relaxed">
                    {task.notes}
                  </p>
                )}

                {/* Expanded Subtasks */}
                {isExpanded && (
                  <div className="mt-3 pl-8 pt-3 border-t border-zinc-800/80 space-y-2">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Subtasks & Acceptance Steps
                    </div>

                    <div className="space-y-1.5">
                      {task.subtasks.map((st) => (
                        <div key={st.id} className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => handleToggleSubtask(task.id, st.id)}
                            className="text-zinc-500 hover:text-emerald-400 transition-colors"
                          >
                            {st.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Circle className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className={st.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}>
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick add subtask input */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const input = form.elements.namedItem('subtaskInput') as HTMLInputElement;
                        handleAddSubtask(task.id, input.value);
                        input.value = '';
                      }}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        name="subtaskInput"
                        placeholder="+ Add subtask step..."
                        className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 flex-1"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded"
                      >
                        Add
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Create New Task / Assignment</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Problem Set 5: Graph Shortest Path"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS201"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Key theorems, rubric points, test cases..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
