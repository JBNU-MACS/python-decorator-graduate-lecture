import React, { useState } from 'react';
import { chapters } from './content/chapters';
import { ChevronLeft, ChevronRight, Menu, BookOpen } from 'lucide-react';

function App() {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentChapter = chapters[currentChapterIndex];

  const nextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center gap-2 p-6 border-b border-slate-800">
          <BookOpen className="text-emerald-500" />
          <h2 className="text-lg font-bold tracking-tight text-white m-0">Python Decorators</h2>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => setCurrentChapterIndex(index)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                currentChapterIndex === index 
                  ? 'bg-emerald-600/10 text-emerald-400 font-medium border border-emerald-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {chapter.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 uppercase">
            <span>Progress</span>
            <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300" 
                style={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
              />
            </div>
            <span>{Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}%</span>
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 md:px-12 lg:px-16">
          <article className="prose prose-invert prose-slate max-w-none">
            {currentChapter.content}
          </article>

          <footer className="mt-16 pt-8 border-t border-slate-800 flex justify-between items-center pb-12">
            <button
              onClick={prevChapter}
              disabled={currentChapterIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentChapterIndex === 0 
                  ? 'text-slate-700 cursor-not-allowed' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              onClick={nextChapter}
              disabled={currentChapterIndex === chapters.length - 1}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed`}
            >
              Next Chapter
              <ChevronRight size={20} />
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
