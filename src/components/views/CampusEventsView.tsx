import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Check, 
  ExternalLink, 
  Trash2,
  Calendar
} from 'lucide-react';
import { CampusEvent } from '../../types';
import { formatDate } from '../../utils/helpers';

interface CampusEventsViewProps {
  events: CampusEvent[];
  onToggleRsvp: (id: string) => void;
  onAddEvent: (event: Omit<CampusEvent, 'id' | 'isRsvpd' | 'attendeesCount'>) => void;
  onDeleteEvent: (id: string) => void;
}

const CATEGORIES: CampusEvent['category'][] = [
  'Career Fair',
  'Hackathon',
  'Guest Lecture',
  'Social',
  'Club Meeting'
];

export const CampusEventsView: React.FC<CampusEventsViewProps> = ({
  events,
  onToggleRsvp,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newHost, setNewHost] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('18:00 - 20:00');
  const [newLocation, setNewLocation] = useState('Campus Center Hall');
  const [newCategory, setNewCategory] = useState<CampusEvent['category']>('Career Fair');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category === selectedCategory;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    onAddEvent({
      title: newTitle.trim(),
      host: newHost.trim() || 'Campus Organization',
      date: newDate,
      time: newTime.trim() || 'TBD',
      location: newLocation.trim() || 'Campus Center',
      category: newCategory,
      description: newDesc.trim() || 'Join fellow students for this campus event.',
      link: newLink.trim()
    });

    setNewTitle('');
    setNewHost('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            <span>Campus Life & Career Events</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Career fairs, hackathons, engineering colloquiums, and student organization socials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Campus Event</span>
        </button>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Clean unboxed metadata header */}
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-indigo-400 font-semibold">{event.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Hosted by {event.host}</span>
                </div>

                <button
                  onClick={() => onDeleteEvent(event.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                  title="Delete event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-base font-semibold text-zinc-100 mt-1.5 leading-snug">
                {event.title}
              </h2>

              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {event.description}
              </p>

              {/* Time & Venue */}
              <div className="mt-4 pt-3 border-t border-zinc-850 space-y-1.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="font-mono text-zinc-300">{formatDate(event.date)}</span>
                  <span>·</span>
                  <span className="font-mono">{event.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* RSVP & Links Footer */}
            <div className="pt-3 border-t border-zinc-850 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-mono font-medium text-zinc-300">{event.attendeesCount}</span>
                <span>students going</span>
              </div>

              <div className="flex items-center gap-2">
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-zinc-950 rounded border border-zinc-800 transition-colors"
                    title="External Event Info"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => onToggleRsvp(event.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    event.isRsvpd
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs shadow-indigo-600/30'
                  }`}
                >
                  {event.isRsvpd && <Check className="w-3.5 h-3.5" />}
                  <span>{event.isRsvpd ? "RSVP'd (Going)" : 'RSVP Now'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Campus Event or Hackathon</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Event Title *
                </label>
                <input
                  required
                  placeholder="e.g. Fall Engineering Career Fair 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Host Organization
                  </label>
                  <input
                    placeholder="e.g. ACM Chapter & Career Center"
                    value={newHost}
                    onChange={(e) => setNewHost(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Event Date *
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
                    placeholder="e.g. 10:00 AM - 4:00 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Location / Hall
                  </label>
                  <input
                    placeholder="e.g. Recreational Arena Concourse"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Registration Link
                  </label>
                  <input
                    placeholder="https://..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Description & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Key speakers, prizes, participating employers, food provided..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
