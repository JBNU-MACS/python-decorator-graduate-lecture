import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

export const Mermaid: FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="flex justify-center my-12 p-8 bg-slate-900/30 rounded-2xl border border-slate-800/50 shadow-inner">
      <div className="mermaid" ref={ref}>
        {chart}
      </div>
    </div>
  );
};
