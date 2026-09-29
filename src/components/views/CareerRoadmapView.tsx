import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Calendar,
  Award
} from 'lucide-react';
import { RoadmapMilestone } from '../../types';

interface CareerRoadmapViewProps {
  milestones: RoadmapMilestone[];
  onToggleMilestone: (id: string) => void;
  onAddMilestone: (milestone: Omit<RoadmapMilestone, 'id'>) => void;
  onDeleteMilestone: (id: string) => void;
}

const YEARS: RoadmapMilestone['year'][] = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({
  milestones,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<RoadmapMilestone['year']>('Year 3');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState<RoadmapMilestone['year']>('Year 3');
  const [newSemester, setNewSemester] = useState<RoadmapMilestone['semester']>('Fall');
  const [newCategory, setNewCategory] = useState<RoadmapMilestone['category']>('Academics');
  const [newTargetDate, setNewTargetDate] = useState('Dec 2026');

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddMilestone({
      title: newTitle.trim(),
      year: newYear,
      semester: newSemester,
      category: newCategory,
      completed: false,
      targetDate: newTargetDate.trim()
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>4-Year Undergraduate Career Roadmap</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Macro timeline balancing GPA, hackathon prototypes, sophomore internships, and senior conversion.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Degree Progress Banner */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>Undergraduate Milestone Execution</span>
          </span>
          <span className="font-mono text-zinc-300">
            {completedCount} of {milestones.length} Milestones Achieved ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Year Tabs */}
      <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
        {YEARS.map((yr) => {
          const yrMilestones = milestones.filter(m => m.year === yr);
          const yrCompleted = yrMilestones.filter(m => m.completed).length;

          return (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors text-center ${
                selectedYear === yr
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div>{yr}</div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                {yrCompleted}/{yrMilestones.length} done
              </div>
            </button>
          );
        })}
      </div>

      {/* Milestones for Selected Year (Split by Semester) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['Fall', 'Spring'] as const).map((sem) => {
          const semMilestones = milestones.filter(
            m => m.year === selectedYear && m.semester === sem
          );

          return (
            <div
              key={sem}
              className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <span className="font-semibold text-xs text-zinc-200 uppercase tracking-wider">
                  {selectedYear} · {sem} Semester
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {semMilestones.length} goals
                </span>
              </div>

              <div className="space-y-2">
                {semMilestones.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-400 italic">
                    No milestones added for this semester yet.
                  </div>
                ) : (
                  semMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() => onToggleMilestone(milestone.id)}
                          className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <p className={`text-xs font-medium ${
                            milestone.completed ? 'line-through text-zinc-500' : 'text-zinc-100'
                          }`}>
                            {milestone.title}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                            <span className="font-mono text-zinc-300">{milestone.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{milestone.targetDate}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteMilestone(milestone.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Roadmap Milestone</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Milestone Goal *
                </label>
                <input
                  required
                  placeholder="e.g. Land Summer 2027 SWE Internship; Finish CS201 with grade A"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={newSemester}
                    onChange={(e) => setNewSemester(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Fall">Fall Semester</option>
                    <option value="Spring">Spring Semester</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Academics">Academics (GPA, Coursework)</option>
                    <option value="Internship">Internship / Co-op</option>
                    <option value="Project">Personal / Club Project</option>
                    <option value="Leadership">Leadership & Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Target Date / Window
                  </label>
                  <input
                    placeholder="e.g. Dec 2026"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
