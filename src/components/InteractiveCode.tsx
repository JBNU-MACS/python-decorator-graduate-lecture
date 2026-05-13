import { useState } from 'react';
import type { FC } from 'react';
import { usePyodide } from '../hooks/usePyodide';
import { Play, RotateCcw } from 'lucide-react';

interface InteractiveCodeProps {
  initialCode: string;
}

const InteractiveCode: FC<InteractiveCodeProps> = ({ initialCode }) => {
  const [code, setCode] = useState(initialCode.trim());
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loading, runCode } = usePyodide();

  const handleRun = async () => {
    setOutput('Running...');
    setError(null);
    const result = await runCode(code);
    if (result.error) {
      setError(result.error);
      setOutput('');
    } else {
      setOutput(result.stdout || 'Process finished with no output');
    }
  };

  const handleReset = () => {
    setCode(initialCode.trim());
    setOutput('');
    setError(null);
  };

  return (
    <div className="my-6 border rounded-lg overflow-hidden bg-slate-900 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Python Sandbox</span>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400"
            title="Reset Code"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
              loading 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Play size={14} />
            {loading ? 'Loading...' : 'Run'}
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-700">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full md:w-1/2 p-4 bg-slate-900 font-mono text-sm resize-none focus:outline-none min-h-[200px]"
        />
        <div className="w-full md:w-1/2 p-4 bg-slate-950 font-mono text-sm min-h-[200px]">
          <div className="text-slate-500 text-xs mb-2 uppercase select-none">Output:</div>
          {error ? (
            <pre className="text-rose-400 whitespace-pre-wrap">{error}</pre>
          ) : (
            <pre className="text-emerald-400 whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveCode;
