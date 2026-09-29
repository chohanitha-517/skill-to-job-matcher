import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  Trash2, 
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { InternshipApp } from '../../types';

interface CareerInternshipsViewProps {
  internships: InternshipApp[];
  onAddInternship: (app: Omit<InternshipApp, 'id'>) => void;
  onUpdateInternship: (app: InternshipApp) => void;
  onDeleteInternship: (id: string) => void;
}

const STAGES: { key: InternshipApp['status']; label: string; color: string }[] = [
  { key: 'wishlist', label: 'Wishlist', color: 'text-zinc-400' },
  { key: 'applied', label: 'Applied', color: 'text-sky-400' },
  { key: 'oa_screening', label: 'OA / Screen', color: 'text-amber-400' },
  { key: 'interview', label: 'Interviewing', color: 'text-indigo-400' },
  { key: 'offer', label: 'Offer Received', color: 'text-emerald-400' },
  { key: 'rejected', label: 'Archived', color: 'text-zinc-500' },
];

export const CareerInternshipsView: React.FC<CareerInternshipsViewProps> = ({
  internships,
  onAddInternship,
  onUpdateInternship,
  onDeleteInternship,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Software Engineering Intern');
  const [newLocation, setNewLocation] = useState('San Francisco, CA');
  const [newStipend, setNewStipend] = useState('$50 / hour');
  const [newStatus, setNewStatus] = useState<InternshipApp['status']>('applied');
  const [newNextAction, setNewNextAction] = useState('');
  const [newNextDate, setNewNextDate] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    onAddInternship({
      company: newCompany.trim(),
      role: newRole.trim(),
      location: newLocation.trim() || 'Remote',
      stipend: newStipend.trim() || 'Competitive',
      appliedDate: new Date().toISOString().split('T')[0],
      status: newStatus,
      nextAction: newNextAction.trim(),
      nextDate: newNextDate,
      notes: newNotes.trim(),
      url: newUrl.trim()
    });

    setNewCompany('');
    setNewNotes('');
    setNewNextAction('');
    setIsAddModalOpen(false);
  };

  const handleStatusChange = (app: InternshipApp, newStage: InternshipApp['status']) => {
    onUpdateInternship({ ...app, status: newStage });
  };

  // Metrics
  const activeCount = internships.filter(i => i.status === 'applied' || i.status === 'oa_screening' || i.status === 'interview').length;
  const offersCount = internships.filter(i => i.status === 'offer').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Internship & Co-op Pipeline</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track applications from initial outreach to online assessments, technical rounds, and offer packages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Metrics */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
            <span className="text-zinc-400">Total: <strong className="font-mono text-zinc-200">{internships.length}</strong></span>
            <span className="text-zinc-600">·</span>
            <span className="text-indigo-400">Active: <strong className="font-mono">{activeCount}</strong></span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400">Offers: <strong className="font-mono">{offersCount}</strong></span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageApps = internships.filter(i => i.status === stage.key);

          return (
            <div
              key={stage.key}
              className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3 flex flex-col min-h-96 min-w-56"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-3">
                <span className={`font-semibold text-xs uppercase tracking-wider ${stage.color}`}>
                  {stage.label}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards in Stage */}
              <div className="space-y-2.5 flex-1">
                {stageApps.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-zinc-400 italic">
                    Empty
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h2 className="font-semibold text-xs text-zinc-100">
                            {app.company}
                          </h2>
                          <div className="text-[11px] text-zinc-400 line-clamp-1">
                            {app.role}
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteInternship(app.id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-opacity p-0.5"
                          title="Delete application"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Stipend & Location */}
                      <div className="space-y-0.5 text-[10px] text-zinc-400">
                        {app.stipend && (
                          <div className="font-mono text-zinc-300">{app.stipend}</div>
                        )}
                        <div className="flex items-center gap-1 truncate">
                          <MapPin className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                          <span>{app.location}</span>
                        </div>
                      </div>

                      {/* Next Action Box */}
                      {app.nextAction && (
                        <div className="bg-zinc-900/90 p-1.5 rounded border border-zinc-850 text-[10px] text-zinc-300">
                          <div className="font-semibold text-indigo-300 truncate">
                            {app.nextAction}
                          </div>
                          {app.nextDate && (
                            <div className="text-zinc-400 font-mono mt-0.5">
                              Due: {app.nextDate}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Move Stage Selector */}
                      <div className="pt-1.5 border-t border-zinc-850 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app, e.target.value as any)}
                          className="w-full text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded px-1.5 py-0.5 focus:outline-hidden focus:border-indigo-500"
                        >
                          {STAGES.map(s => (
                            <option key={s.key} value={s.key}>Move → {s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Log New Internship Application</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Stripe, Google, Figma"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Target Role *
                  </label>
                  <input
                    required
                    placeholder="e.g. Software Engineering Intern"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Current Stage
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {STAGES.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Stipend / Compensation
                  </label>
                  <input
                    placeholder="e.g. $55 / hour + housing"
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Location
                  </label>
                  <input
                    placeholder="e.g. San Francisco, CA / Remote"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Next Action Deadline
                  </label>
                  <input
                    type="date"
                    value={newNextDate}
                    onChange={(e) => setNewNextDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Next Step / Action Item
                </label>
                <input
                  placeholder="e.g. Complete HackerRank OA by Thursday"
                  value={newNextAction}
                  onChange={(e) => setNewNextAction(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Recruiter Contact & Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Referral name, job portal link, interview prep notes..."
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
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
