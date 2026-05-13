import { useState, useEffect, useCallback } from 'react';

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js';
        script.async = true;
        script.onload = async () => {
          if (!mounted) return;
          // @ts-ignore
          const py = await window.loadPyodide();
          setPyodide(py);
          setLoading(false);
        };
        document.head.appendChild(script);
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Failed to load Pyodide');
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const runCode = useCallback(async (code: string) => {
    if (!pyodide) return { error: 'Pyodide not loaded' };
    try {
      pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
      const result = await pyodide.runPythonAsync(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      return { result, stdout };
    } catch (err: any) {
      return { error: err.message };
    }
  }, [pyodide]);

  return { loading, error, runCode };
};
