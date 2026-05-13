import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Load pyodide from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.async = true;
        script.onload = async () => {
          const py = await window.loadPyodide();
          setPyodide(py);
          setLoading(false);
        };
        document.head.appendChild(script);
      } catch {
        setError('Failed to load Pyodide');
        setLoading(false);
      }
    };
    load();
  }, []);

  const runCode = useCallback(async (code: string) => {
    if (!pyodide) return { error: 'Pyodide not loaded' };
    
    try {
      // Capture stdout
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
