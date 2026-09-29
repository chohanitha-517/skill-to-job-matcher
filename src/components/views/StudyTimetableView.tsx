import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  User, 
  Clock, 
  Trash2, 
  BookOpen
} from 'lucide-react';
import { ClassSession } from '../../types';

interface StudyTimetableViewProps {
  classes: ClassSession[];
  onAddClass: (session: Omit<ClassSession, 'id'>) => void;
  onDeleteClass: (id: string) => void;
}

const DAYS_OF_WEEK: ClassSession['dayOfWeek'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const StudyTimetableView: React.FC<StudyTimetableViewProps> = ({
  classes,
  onAddClass,
  onDeleteClass,
}) => {
  const [selectedDay, setSelectedDay] = useState<ClassSession['dayOfWeek']>('Monday');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newCourseCode, setNewCourseCode] = useState('CS201');
  const [newTitle, setNewTitle] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newLecturer, setNewLecturer] = useState('');
  const [newDay, setNewDay] = useState<ClassSession['dayOfWeek']>('Monday');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('11:30');
  const [newType, setNewType] = useState<ClassSession['type']>('Lecture');
  const [newColorTag, setNewColorTag] = useState('indigo');

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCourseCode.trim()) return;

    onAddClass({
      courseCode: newCourseCode.trim(),
      title: newTitle.trim(),
      room: newRoom.trim() || 'TBD',
      lecturer: newLecturer.trim() || 'Staff',
      dayOfWeek: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      type: newType,
      colorTag: newColorTag
    });

    setNewTitle('');
    setNewRoom('');
    setNewLecturer('');
    setIsAddModalOpen(false);
  };

  const getDayClasses = (day: ClassSession['dayOfWeek']) => {
    return classes
      .filter(c => c.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Weekly Class Timetable</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Fall Semester 2026 academic schedule with lecture rooms, labs, and office hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'week' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Week Grid
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'day' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Day View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Week View Grid */}
      {viewMode === 'week' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {DAYS_OF_WEEK.map((day) => {
            const dayClasses = getDayClasses(day);

            return (
              <div 
                key={day}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 space-y-3 min-h-96 flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span className="font-semibold text-xs text-zinc-200 uppercase tracking-wider">
                    {day}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>

                <div className="flex-1 space-y-2.5">
                  {dayClasses.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-[11px] text-zinc-400 italic py-12">
                      No scheduled classes
                    </div>
                  ) : (
                    dayClasses.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-1.5 group relative"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold text-xs text-zinc-100 font-mono">
                            {cls.courseCode}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {cls.type}
                          </span>
                        </div>

                        <div className="text-xs font-medium text-zinc-200 line-clamp-1 leading-snug">
                          {cls.title}
                        </div>

                        <div className="text-[11px] font-mono text-indigo-400 tabular-nums">
                          {cls.startTime} - {cls.endTime}
                        </div>

                        <div className="pt-1 border-t border-zinc-850 flex items-center justify-between text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1 truncate max-w-28">
                            <MapPin className="w-2.5 h-2.5 text-zinc-400 shrink-0" />
                            {cls.room}
                          </span>
                          <button
                            onClick={() => onDeleteClass(cls.id)}
                            className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-400 transition-opacity"
                            title="Delete session"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Day View */
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {day} ({getDayClasses(day).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {getDayClasses(selectedDay).length === 0 ? (
              <div className="py-12 text-center rounded-xl bg-zinc-900/30 border border-zinc-800">
                <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No classes scheduled for {selectedDay}.</p>
              </div>
            ) : (
              getDayClasses(selectedDay).map((cls) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-100 font-mono">
                        {cls.courseCode}
                      </span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-xs font-medium text-zinc-300">{cls.title}</span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-[11px] text-zinc-400 font-mono">{cls.type}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1 text-indigo-400 font-mono font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {cls.startTime} - {cls.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {cls.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        {cls.lecturer}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteClass(cls.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Class Session to Timetable</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    required
                    placeholder="e.g. CS201"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Course Title *
                  </label>
                  <input
                    required
                    placeholder="e.g. Data Structures & Algorithms"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Session Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Building & Room
                  </label>
                  <input
                    placeholder="e.g. Turing Hall 104"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Lecturer / Professor
                  </label>
                  <input
                    placeholder="e.g. Prof. Vance"
                    value={newLecturer}
                    onChange={(e) => setNewLecturer(e.target.value)}
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
                  Add to Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
