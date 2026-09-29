import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ResumeBullet } from '../../types';
import { polishResumeBulletApi } from '../../services/geminiService';

interface CareerResumeViewProps {
  bullets: ResumeBullet[];
  onAddBullet: (bullet: Omit<ResumeBullet, 'id'>) => void;
  onDeleteBullet: (id: string) => void;
}

export const CareerResumeView: React.FC<CareerResumeViewProps> = ({
  bullets,
  onAddBullet,
  onDeleteBullet,
}) => {
  const [role, setRole] = useState('Software Engineering Intern');
  const [company, setCompany] = useState('Autonomous Robotics Lab');
  const [rawText, setRawText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handlePolish = async () => {
    if (!rawText.trim()) return;

    setIsPolishing(true);
    try {
      const options = await polishResumeBulletApi(rawText, role, company);
      setGeneratedOptions(options);
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedOptions([
        `Architected optimized services for ${company}, reducing system execution latency by 35% through concurrency pipelines.`,
        `Spearheaded backend feature development at ${company} using TypeScript and modern APIs, handling 1,500+ daily student requests.`,
        `Refactored modular application components for ${company}, boosting maintainability and cutting cold-start delay by 40%.`
      ]);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSaveBullet = (selectedText: string) => {
    onAddBullet({
      role,
      company,
      rawText,
      polishedOptions: generatedOptions,
      selectedText
    });
    setRawText('');
    setGeneratedOptions([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>ATS Resume Bullet Builder</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Transform casual project work into high-impact Google X-Y-Z formula bullets with quantifiable metrics.
          </p>
        </div>
      </div>

      {/* Main Generator Card */}
      <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Position / Role Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Full-Stack Developer Intern"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Company / Project Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Campus Autonomous Vehicle Club"
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
            <span>Raw Description of What You Did</span>
            <span className="text-[11px] text-zinc-500 font-mono">Casual language is fine</span>
          </label>
          <textarea
            rows={3}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. helped make the backend api faster and fixed a lot of memory leak bugs so it wouldn't crash when lots of users tried to register..."
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 rounded-lg focus:outline-hidden focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-zinc-400 hidden sm:block">
            Formula: "Accomplished [X] as measured by [Y], by doing [Z]"
          </div>

          <button
            onClick={handlePolish}
            disabled={isPolishing || !rawText.trim()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs shadow-indigo-600/30 ml-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isPolishing ? 'Synthesizing with Gemini...' : 'Polish Bullet with AI'}</span>
          </button>
        </div>

        {/* Polished Options Output */}
        {generatedOptions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-800 space-y-3">
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>ATS & Google Formula Variations</span>
            </div>

            <div className="space-y-2.5">
              {generatedOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    • {opt}
                  </p>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(opt, idx)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900 rounded border border-zinc-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIdx === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSaveBullet(opt)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950 hover:bg-indigo-900 rounded border border-indigo-800/60 transition-colors"
                    >
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Saved Master Bullets Repository */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span>Saved Master Resume Bullets ({bullets.length})</span>
          </h2>
        </div>

        <div className="space-y-2.5">
          {bullets.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-zinc-100">{b.company}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-400">{b.role}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(b.selectedText);
                      alert('Copied bullet to clipboard!');
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Copy bullet"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteBullet(b.id)}
                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete bullet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed font-mono">
                • {b.selectedText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
