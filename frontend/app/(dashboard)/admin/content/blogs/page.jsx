'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Plus, Search, Trash2, Edit2, CheckCircle2, Eye, RefreshCw, X, Tag, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Top 10 Electricians & Home Repair Experts in Gaya 2026',
      category: 'Home Services',
      author: 'GayaSeva Team',
      date: '20 Jul 2026',
      status: 'PUBLISHED',
      readTime: '4 min read'
    },
    {
      id: 2,
      title: 'How GayaSeva Helps Local Vendors Grow Business Online',
      category: 'Business Growth',
      author: 'Admin',
      date: '18 Jul 2026',
      status: 'PUBLISHED',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Emergency Vehicle Repairs & Towing Network in Gaya District',
      category: 'Vehicles & Transport',
      author: 'GayaSeva Team',
      date: '15 Jul 2026',
      status: 'DRAFT',
      readTime: '3 min read'
    }
  ]);

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'Home Services',
    author: 'GayaSeva Admin',
    content: '',
    status: 'PUBLISHED'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_blog_posts');
      if (saved) {
        try { setBlogs(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  const handleCreateBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.content.trim()) {
      toast.error('Title and Content are required');
      return;
    }

    const created = {
      id: Date.now(),
      title: newBlog.title.trim(),
      category: newBlog.category,
      author: newBlog.author,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: newBlog.status,
      readTime: '5 min read'
    };

    const updated = [created, ...blogs];
    setBlogs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gc_blog_posts', JSON.stringify(updated));
    }

    toast.success('Blog article published!');
    setIsModalOpen(false);
    setNewBlog({ title: '', category: 'Home Services', author: 'GayaSeva Admin', content: '', status: 'PUBLISHED' });
  };

  const deleteBlog = (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gc_blog_posts', JSON.stringify(updated));
    }
    toast.success('Article deleted');
  };

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Blogs & Articles Manager</h1>
          <p className="text-slate-500 text-xs mt-1">Publish local news, service guides, and promotional blog posts.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Write New Article
        </button>
      </div>

      {/* Table & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles by title or category..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs outline-none focus:border-indigo-500 font-medium"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            Articles: <strong className="text-indigo-600 dark:text-indigo-400">{filtered.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-[10px] uppercase font-black tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Article Title & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-6">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{b.title}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{b.date} • {b.readTime}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
                      <Tag className="w-3 h-3" /> {b.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{b.author}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      b.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      ● {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button 
                      onClick={() => deleteBlog(b.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Write Blog Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Write & Publish New Article</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Article Title *</label>
                <input 
                  required
                  type="text" 
                  value={newBlog.title}
                  onChange={e => setNewBlog({...newBlog, title: e.target.value})}
                  placeholder="e.g. Complete Guide to Hiring Electricians in Gaya"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Category</label>
                  <select 
                    value={newBlog.category}
                    onChange={e => setNewBlog({...newBlog, category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold outline-none text-slate-900 dark:text-white"
                  >
                    <option value="Home Services">Home Services</option>
                    <option value="Business Growth">Business Growth</option>
                    <option value="Vehicles & Transport">Vehicles & Transport</option>
                    <option value="Local News">Local News</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Status</label>
                  <select 
                    value={newBlog.status}
                    onChange={e => setNewBlog({...newBlog, status: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-bold outline-none text-slate-900 dark:text-white"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Article Body Content *</label>
                <textarea 
                  required
                  rows="4"
                  value={newBlog.content}
                  onChange={e => setNewBlog({...newBlog, content: e.target.value})}
                  placeholder="Write full article markdown or plaintext here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium outline-none text-slate-900 dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-600/20">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
