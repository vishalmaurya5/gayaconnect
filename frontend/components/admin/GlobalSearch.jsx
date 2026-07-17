'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, LayoutDashboard, Users, Briefcase, ShoppingBag, FileText, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalSearch({ sidebarStructure }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  // Flatten the sidebar structure for searching
  const allRoutes = sidebarStructure.flatMap(group => 
    group.items.map(item => ({
      ...item,
      group: group.title,
      groupIcon: group.icon
    }))
  );

  const filteredRoutes = allRoutes.filter(route => 
    route.name.toLowerCase().includes(query.toLowerCase()) || 
    route.group.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setActiveIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredRoutes.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredRoutes.length) % filteredRoutes.length);
    } else if (e.key === 'Enter' && filteredRoutes[activeIndex]) {
      e.preventDefault();
      handleNavigate(filteredRoutes[activeIndex].path);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-0">
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[70vh]">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 outline-none text-lg"
            placeholder="Search for Users, Vendors, Jobs, Settings..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {filteredRoutes.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Modules & Pages
              </div>
              {filteredRoutes.map((route, idx) => {
                const Icon = route.groupIcon || LayoutDashboard;
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={route.path}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleNavigate(route.path)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white dark:bg-indigo-500/20 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{route.name}</div>
                        <div className={`text-xs ${isActive ? 'text-indigo-500/80 dark:text-indigo-400/80' : 'text-slate-400'}`}>
                          {route.group}
                        </div>
                      </div>
                    </div>
                    {isActive && <ChevronRight className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-500">
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">No results found</p>
              <p className="text-sm mt-1 text-slate-400">Try searching for something else.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1"><kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono">↑</kbd><kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono">↓</kbd> to navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono">Enter</kbd> to select</span>
          <span className="flex items-center gap-1"><kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-300 font-mono">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
