import React, { useState, useEffect } from 'react';
import { 
  Hourglass, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Trash2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Exam } from '../../types';
import { getDaysLeft } from '../../utils/helpers';

interface StudyExamCountdownViewProps {
  exams: Exam[];
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onUpdateExam: (exam: Exam) => void;
  onDeleteExam: (id: string) => void;
}

export const StudyExamCountdownView: React.FC<StudyExamCountdownViewProps> = ({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form state
  const [newCourseCode, setNewCourseCode] = useState('CS201');
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('14:00 - 16:00');
  const [newLocation, setNewLocation] = useState('Main Gymnasium Hall C');
  const [newWeightage, setNewWeightage] = useState(30);
  const [newCoverage, setNewCoverage] = useState(50);
  const [newTopics, setNewTopics] = useState('');

  // Live countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getDetailedCountdown = (targetDateStr: string) => {
    const [year, month, day] = targetDateStr.split('-').map(Number);
    const target = new Date(year, month - 1, day, 9, 0, 0); // assume 9am exam start
    const diff = target.getTime() - currentTime.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPassed: false };
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const topicList = newTopics
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean);

    onAddExam({
      courseCode: newCourseCode.trim(),
      title: newTitle.trim(),
      date: newDate,
      time: newTime.trim() || 'TBD',
      location: newLocation.trim() || 'TBD',
      weightage: Number(newWeightage) || 20,
      syllabusCoverage: Number(newCoverage) || 0,
      confidenceLevel: 'moderate',
      topics: topicList.length > 0 ? topicList : ['Core Lectures 1-6', 'Problem Sets 1-4']
    });

    setNewTitle('');
    setNewDate('');
    setNewTopics('');
    setIsAddModalOpen(false);
  };

  const handleConfidenceChange = (examId: string, level: Exam['confidenceLevel']) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      onUpdateExam({ ...exam, confidenceLevel: level });
    }
  };

  const handleCoverageChange = (examId: string, coverage: number) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      onUpdateExam({ ...exam, syllabusCoverage: coverage });
    }
  };

  const sortedExams = [...exams].sort((a, b) => getDaysLeft(a.date) - getDaysLeft(b.date));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Hourglass className="w-5 h-5 text-amber-400" />
            <span>Exam Countdown & Revision Hub</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time countdown clocks, syllabus progress, confidence tracking, and topic checklists.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam</span>
        </button>
      </div>

      {/* Exam Countdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedExams.map((exam) => {
          const countdown = getDetailedCountdown(exam.date);
          const daysLeft = getDaysLeft(exam.date);

          return (
            <div
              key={exam.id}
              className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-zinc-100">
                        {exam.courseCode}
                      </span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-xs text-zinc-300 font-medium">
                        {exam.weightage}% of final grade
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-zinc-100 mt-0.5">
                      {exam.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                    title="Delete exam"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Live Countdown Display Box */}
                <div className="mt-4 p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Live Countdown</span>
                    <span className="text-amber-400 font-medium">
                      {exam.date} · {exam.time}
                    </span>
                  </div>

                  {countdown.isPassed ? (
                    <div className="text-center py-2 text-xs font-mono text-zinc-400">
                      Exam completed or in session
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
                        <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                          {countdown.days}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">DAYS</div>
                      </div>
                      <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
                        <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                          {String(countdown.hours).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">HOURS</div>
                      </div>
                      <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
                        <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 tabular-nums">
                          {String(countdown.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">MINS</div>
                      </div>
                      <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800">
                        <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-400 tabular-nums">
                          {String(countdown.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">SECS</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Syllabus Coverage & Confidence */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-300 mb-1.5">
                      <span>Syllabus Coverage</span>
                      <span className="font-mono text-zinc-100 font-semibold">{exam.syllabusCoverage}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={exam.syllabusCoverage}
                      onChange={(e) => handleCoverageChange(exam.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-400">Preparation Confidence:</span>
                    <select
                      value={exam.confidenceLevel}
                      onChange={(e) => handleConfidenceChange(exam.id, e.target.value as any)}
                      className="px-2 py-1 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded font-mono focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="needs_review">Needs Review</option>
                      <option value="moderate">Moderate Confidence</option>
                      <option value="mastered">Mastered</option>
                    </select>
                  </div>
                </div>

                {/* Key Review Topics */}
                {exam.topics.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                      Core Syllabus Topics
                    </div>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {exam.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-indigo-400 shrink-0 mt-0.5">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer Location */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {exam.location}
                </span>
                <span className="font-mono text-zinc-400">
                  {daysLeft <= 0 ? 'Exam is today!' : `${daysLeft} days until exam`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Exam to Countdown</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3">
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
                    Exam Title *
                  </label>
                  <input
                    required
                    placeholder="e.g. Algorithms Midterm Exam"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Time Window
                  </label>
                  <input
                    placeholder="e.g. 14:00 - 16:00"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Weightage (% of Grade)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newWeightage}
                    onChange={(e) => setNewWeightage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Initial Coverage %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCoverage}
                    onChange={(e) => setNewCoverage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Location / Exam Hall
                </label>
                <input
                  placeholder="e.g. Main Gymnasium Hall C"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Syllabus Topics (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Divide & Conquer\nDynamic Programming\nGraph BFS/DFS"
                  value={newTopics}
                  onChange={(e) => setNewTopics(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
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
                  Add Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
