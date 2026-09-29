import React, { useState } from 'react';
import { 
  Code, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Star,
  ExternalLink
} from 'lucide-react';
import { SkillItem } from '../../types';

interface CareerSkillsViewProps {
  skills: SkillItem[];
  onAddSkill: (skill: Omit<SkillItem, 'id'>) => void;
  onDeleteSkill: (id: string) => void;
  onUpdateSkill: (skill: SkillItem) => void;
}

export const CareerSkillsView: React.FC<CareerSkillsViewProps> = ({
  skills,
  onAddSkill,
  onDeleteSkill,
  onUpdateSkill,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<SkillItem['category']>('Technical');
  const [newProficiency, setNewProficiency] = useState(3);
  const [newTargetLevel, setNewTargetLevel] = useState(5);
  const [newKeyProject, setNewKeyProject] = useState('');

  const categories = ['All', 'Technical', 'Core Engineering', 'Soft Skills', 'Design & Tools'];

  const filteredSkills = skills.filter(s => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddSkill({
      name: newName.trim(),
      category: newCategory,
      proficiency: newProficiency,
      targetLevel: newTargetLevel,
      lastPracticed: 'Recently',
      keyProject: newKeyProject.trim() || 'Coursework & labs'
    });

    setNewName('');
    setNewKeyProject('');
    setIsAddModalOpen(false);
  };

  const handleProficiencyClick = (skill: SkillItem, level: number) => {
    onUpdateSkill({ ...skill, proficiency: level });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <span>Skills & Technical Competencies</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Map your tech stack, system programming proficiencies, and targeted interview competencies.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
        {categories.map((cat) => (
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {skill.category}
                  </span>
                  <h2 className="text-sm font-semibold text-zinc-100 mt-0.5">
                    {skill.name}
                  </h2>
                </div>

                <button
                  onClick={() => onDeleteSkill(skill.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors rounded"
                  title="Delete skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Proficiency Level (Interactive rating) */}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Current Mastery</span>
                  <span className="font-mono text-zinc-300">
                    Level {skill.proficiency} / {skill.targetLevel} Target
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleProficiencyClick(skill, lvl)}
                      className={`h-2 flex-1 rounded-sm transition-colors ${
                        lvl <= skill.proficiency
                          ? 'bg-indigo-500'
                          : lvl <= skill.targetLevel
                          ? 'bg-indigo-950/80 border border-indigo-800/50'
                          : 'bg-zinc-800'
                      }`}
                      title={`Set proficiency to ${lvl}`}
                    />
                  ))}
                </div>
              </div>

              {/* Key Project Evidence */}
              {skill.keyProject && (
                <div className="mt-3 text-xs text-zinc-400 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-850">
                  <span className="font-semibold text-zinc-300 block mb-0.5">Evidence / Project:</span>
                  <span className="line-clamp-2 leading-relaxed">{skill.keyProject}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>Practiced {skill.lastPracticed}</span>
              {skill.proficiency >= 4 && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Interview Ready
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Technical or Core Competency</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Skill Name *
                </label>
                <input
                  required
                  placeholder="e.g. Distributed Systems, Rust, PyTorch, Docker"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                  <option value="Technical">Technical (Languages, Frameworks, DBs)</option>
                  <option value="Core Engineering">Core Engineering (OS, Networking, Algorithms)</option>
                  <option value="Soft Skills">Soft Skills (Communication, Tech Writing, Leadership)</option>
                  <option value="Design & Tools">Design & Tools (Git, Linux, Figma, Postman)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Current Level (1 to 5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newProficiency}
                    onChange={(e) => setNewProficiency(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Target Goal Level (1 to 5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newTargetLevel}
                    onChange={(e) => setNewTargetLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Key Project / Artifact
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Implemented Raft consensus in Go; built portfolio site in Next.js"
                  value={newKeyProject}
                  onChange={(e) => setNewKeyProject(e.target.value)}
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
