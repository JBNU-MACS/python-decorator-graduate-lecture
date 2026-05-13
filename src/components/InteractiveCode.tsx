import { useState } from 'react';
import type { FC } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import { Play, RotateCcw, Loader2 } from 'lucide-react';

export const InteractiveCode: FC<{ initialCode: string }> = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode.trim());
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loading, runCode } = usePyodide();

  const handleRun = async () => {
    setOutput('');
    setError(null);
    const result = await runCode(code);
    if (result.error) {
      setError(result.error);
    } else {
      setOutput(result.stdout || 'Done (no output)');
    }
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-xs font-mono text-slate-500 uppercase tracking-widest">Python 3.12</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setCode(initialCode.trim()); setOutput(''); setError(null); }}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            {loading ? 'Loading...' : 'Execute'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="p-6 h-64 bg-transparent font-mono text-[13px] text-slate-300 focus:outline-none resize-none leading-relaxed"
        />
        <div className="p-6 h-64 bg-black/20 overflow-auto font-mono text-[13px]">
          <div className="text-[10px] text-slate-600 uppercase font-bold mb-4 tracking-tighter">Console Output</div>
          {error && <pre className="text-rose-400 whitespace-pre-wrap">{error}</pre>}
          {output && <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>}
          {!error && !output && <span className="text-slate-700 italic">Output will appear here...</span>}
        </div>
      </div>
    </div>
  );
};
