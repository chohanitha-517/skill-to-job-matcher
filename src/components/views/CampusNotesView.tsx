import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Sparkles, 
  FileText, 
  Download, 
  Trash2, 
  Layers,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { NoteItem } from '../../types';
import { generateStudyGuideApi } from '../../services/geminiService';

interface CampusNotesViewProps {
  notes: NoteItem[];
  onAddNote: (note: Omit<NoteItem, 'id' | 'downloadsCount'>) => void;
  onDeleteNote: (id: string) => void;
}

export const CampusNotesView: React.FC<CampusNotesViewProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingNote, setActiveReadingNote] = useState<NoteItem | null>(notes[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // AI Flashcards Modal State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [studyGuide, setStudyGuide] = useState<{
    summary: string;
    keyConcepts: string[];
    flashcards: { question: string; answer: string }[];
  } | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New Note form state
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS201');
  const [newTopic, setNewTopic] = useState('');
  const [newTags, setNewTags] = useState('Algorithms, Midterm');
  const [newContent, setNewContent] = useState('');

  const uniqueCourses = ['All', ...Array.from(new Set(notes.map(n => n.courseCode)))];

  const filteredNotes = notes.filter((note) => {
    if (selectedCourse !== 'All' && note.courseCode !== selectedCourse) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.topic.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagList = newTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddNote({
      title: newTitle.trim(),
      courseCode: newCourse.trim(),
      author: 'Alex Rivera (You)',
      topic: newTopic.trim() || 'General Coursework',
      tags: tagList,
      lastUpdated: new Date().toISOString().split('T')[0],
      content: newContent
    });

    setNewTitle('');
    setNewTopic('');
    setNewContent('');
    setIsAddModalOpen(false);
  };

  const handleGenerateStudyGuide = async (note: NoteItem) => {
    setIsGeneratingAi(true);
    setCurrentCardIdx(0);
    setIsFlipped(false);
    try {
      const guide = await generateStudyGuideApi(note.title, note.content, note.courseCode);
      setStudyGuide(guide);
    } catch (err) {
      console.error(err);
      setStudyGuide({
        summary: `Review sheet for ${note.title} highlighting foundational axioms and exam-focused problems.`,
        keyConcepts: [
          'Core invariance requirements in algorithm design',
          'Space vs time complexity trade-offs',
          'Boundary condition verification for base cases'
        ],
        flashcards: [
          { question: `What is the primary objective in ${note.title}?`, answer: 'Solving optimal subproblems while avoiding redundant computations.' },
          { question: 'How is state transitioned efficiently?', answer: 'Using topological ordering on a directed acyclic graph structure.' }
        ]
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Course Notes & Study Repository</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Markdown lecture notes, cheat sheets, and instant AI study flashcard generation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Write / Upload Note</span>
        </button>
      </div>

      {/* Two-Pane Notes Layout (Directory on Left, Reading View on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[550px]">
        {/* Left Pane (5 cols): Notes Directory */}
        <div className="lg:col-span-5 space-y-3 flex flex-col">
          {/* Filters & Search */}
          <div className="p-2 bg-zinc-900/60 rounded-xl border border-zinc-800/80 space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {uniqueCourses.map((crs) => (
                <button
                  key={crs}
                  onClick={() => setSelectedCourse(crs)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCourse === crs
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {crs}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-2 flex-1 overflow-y-auto">
            {filteredNotes.map((note) => {
              const isSelected = activeReadingNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveReadingNote(note)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-850/90 border-indigo-500/50 shadow-xs'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                        <span className="text-indigo-400 font-semibold">{note.courseCode}</span>
                        <span>·</span>
                        <span>{note.lastUpdated}</span>
                      </div>
                      <h2 className="text-xs font-semibold text-zinc-100 mt-1 line-clamp-1">
                        {note.title}
                      </h2>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                        if (activeReadingNote?.id === note.id) {
                          setActiveReadingNote(null);
                        }
                      }}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                    {note.topic}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane (7 cols): Document Reader & AI Flashcards Trigger */}
        <div className="lg:col-span-7 bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
          {activeReadingNote ? (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Document Header & AI Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400 font-semibold">
                    {activeReadingNote.courseCode} · {activeReadingNote.topic}
                  </div>
                  <h2 className="text-base font-bold text-zinc-100 mt-0.5">
                    {activeReadingNote.title}
                  </h2>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    By {activeReadingNote.author} · Updated {activeReadingNote.lastUpdated}
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateStudyGuide(activeReadingNote)}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-xs shadow-indigo-600/30 shrink-0 self-start sm:self-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAi ? 'Synthesizing...' : 'Generate AI Flashcards'}</span>
                </button>
              </div>

              {/* Formatted Content */}
              <div className="flex-1 overflow-y-auto pr-1">
                <pre className="text-xs text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed select-text bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                  {activeReadingNote.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-zinc-500">
              <FileText className="w-10 h-10 mb-2" />
              <p className="text-xs text-zinc-400">Select a note from the left to read or generate flashcards.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Flashcards Study Guide Modal */}
      {studyGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-zinc-100">
                  AI Study Guide & Flashcards
                </h2>
              </div>
              <button
                onClick={() => setStudyGuide(null)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Summary & Key Concepts */}
            <div className="space-y-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-xs">
              <div className="font-semibold text-indigo-300">Executive Summary</div>
              <p className="text-zinc-300 leading-relaxed">{studyGuide.summary}</p>

              {studyGuide.keyConcepts?.length > 0 && (
                <div className="pt-2 border-t border-zinc-850 space-y-1">
                  <div className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">
                    Core Concepts
                  </div>
                  {studyGuide.keyConcepts.map((pt, i) => (
                    <div key={i} className="text-zinc-300 flex items-start gap-2">
                      <span className="text-indigo-400">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Flashcard */}
            {studyGuide.flashcards.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Flashcard {currentCardIdx + 1} of {studyGuide.flashcards.length}</span>
                  <span>Click card to flip</span>
                </div>

                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-36 p-6 rounded-xl bg-zinc-950 border border-indigo-500/40 hover:border-indigo-400 transition-all flex flex-col justify-center items-center text-center cursor-pointer select-none"
                >
                  <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider mb-2">
                    {isFlipped ? 'ANSWER' : 'QUESTION'}
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 leading-relaxed">
                    {isFlipped
                      ? studyGuide.flashcards[currentCardIdx].answer
                      : studyGuide.flashcards[currentCardIdx].question}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    disabled={currentCardIdx === 0}
                    onClick={() => {
                      setCurrentCardIdx(prev => Math.max(0, prev - 1));
                      setIsFlipped(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Flip Card
                  </button>

                  <button
                    disabled={currentCardIdx === studyGuide.flashcards.length - 1}
                    onClick={() => {
                      setCurrentCardIdx(prev => Math.min(studyGuide.flashcards.length - 1, prev + 1));
                      setIsFlipped(false);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-300 hover:text-white disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Write / Upload Course Note</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    required
                    placeholder="e.g. CS201"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Topic Header *
                  </label>
                  <input
                    required
                    placeholder="e.g. Dynamic Programming & DAG Recurrences"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Document Title *
                </label>
                <input
                  required
                  placeholder="e.g. CS201 Midterm Master Sheet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  placeholder="Algorithms, Exam, Recurrences, Graph"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Note Content (Markdown or text) *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="# Lecture Notes\n\n1. Core theorems\n2. Key formulas\n3. Edge case considerations..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
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
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
