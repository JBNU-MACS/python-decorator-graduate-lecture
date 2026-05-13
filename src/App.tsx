import { useState } from 'react';
import { chapters } from './content/chapters';
import { ChevronLeft, ChevronRight, Menu, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chapter = chapters[currentIdx];

  const goNext = () => currentIdx < chapters.length - 1 && setCurrentIdx(currentIdx + 1);
  const goPrev = () => currentIdx > 0 && setCurrentIdx(currentIdx - 1);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-8 border-b border-slate-800/50 bg-gradient-to-br from-slate-900 to-slate-900/50">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="text-emerald-500" size={28} />
            <span className="font-black text-xl tracking-tighter text-white uppercase">Python Masterclass</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Graduate Level Series • Vol. 01</p>
        </div>
        
        <nav className="p-4 mt-4 space-y-1">
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => { setCurrentIdx(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-full text-left px-5 py-3 rounded-xl text-sm transition-all duration-300 group ${
                currentIdx === i 
                  ? 'bg-emerald-500/10 text-emerald-400 font-bold shadow-lg shadow-emerald-950/20 border border-emerald-500/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-mono ${currentIdx === i ? 'text-emerald-500' : 'text-slate-700'}`}>0{i + 1}</span>
                {ch.title}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 text-slate-400 hover:bg-slate-900 rounded-lg">
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIdx + 1) / chapters.length) * 100}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold tracking-widest">{Math.round(((currentIdx + 1) / chapters.length) * 100)}%</span>
            </div>
            <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-md text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Section 0{currentIdx + 1} / 0{chapters.length}
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-16 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <article className="prose prose-invert prose-emerald max-w-none">
                {chapter.content}
              </article>
            </motion.div>
          </AnimatePresence>

          <footer className="mt-20 pt-10 border-t border-slate-900 flex justify-between items-center pb-20">
            <button
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-900 disabled:opacity-0 transition-all font-bold text-sm"
            >
              <ChevronLeft size={18} />
              PREVIOUS
            </button>
            <button
              onClick={goNext}
              disabled={currentIdx === chapters.length - 1}
              className="flex items-center gap-3 px-8 py-2.5 bg-slate-100 hover:bg-white text-slate-950 rounded-xl font-black text-sm transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-0"
            >
              NEXT CHAPTER
              <ChevronRight size={18} />
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
