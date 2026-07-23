'use client';

import { useState } from 'react';
import { 
  Shield, Edit2, ExternalLink, CheckCircle2, FileText, Search, Save, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LegalPagesPage() {
  const [legalDocs, setLegalDocs] = useState([
    {
      id: 'terms',
      title: 'Terms & Conditions of Service',
      path: '/terms',
      lastUpdated: '20 Jul 2026',
      status: 'ACTIVE & ENFORCED',
      content: 'Welcome to GayaSeva. By accessing or using our platform, services, workforce listings, or subscription options, you agree to be bound by these Terms and Conditions...'
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Protection Policy',
      path: '/privacy',
      lastUpdated: '18 Jul 2026',
      status: 'ACTIVE & ENFORCED',
      content: 'GayaSeva is committed to protecting your privacy. We collect phone numbers, names, and address details solely for linking local vendors, daily workforce, and platform bookings...'
    },
    {
      id: 'refund',
      title: 'Refund & Cancellation Policy',
      path: '/terms',
      lastUpdated: '10 Jul 2026',
      status: 'ACTIVE & ENFORCED',
      content: 'Monthly ₹11 subscription plans and vendor service placement fees are non-refundable after activation, except in verified cases of double billing...'
    },
    {
      id: 'vendor_agreement',
      title: 'Vendor & Merchant Partner Agreement',
      path: '/terms',
      lastUpdated: '05 Jul 2026',
      status: 'ACTIVE & ENFORCED',
      content: 'All registered vendors and commercial service providers agree to deliver honest pricing, maintain active shop credentials, and uphold GayaSeva quality standards...'
    }
  ]);

  const [editingDoc, setEditingDoc] = useState(null);
  const [editContent, setEditContent] = useState('');

  const openEditor = (doc) => {
    setEditingDoc(doc);
    setEditContent(doc.content);
  };

  const handleSaveDoc = (e) => {
    e.preventDefault();
    if (!editContent.trim()) {
      toast.error('Document content cannot be empty');
      return;
    }

    const updated = legalDocs.map(d => d.id === editingDoc.id ? { 
      ...d, 
      content: editContent,
      lastUpdated: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    } : d);

    setLegalDocs(updated);
    toast.success(`${editingDoc.title} updated successfully!`);
    setEditingDoc(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Legal Documents & Compliance</h1>
          <p className="text-slate-500 text-xs mt-1">Manage Terms of Service, Privacy Policies, and Merchant Agreements.</p>
        </div>
      </div>

      {/* Legal Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {legalDocs.map(doc => (
          <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase tracking-wider">
                  ● {doc.status}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Last Edit: {doc.lastUpdated}</span>
              </div>

              <h3 className="text-base font-black text-slate-900 dark:text-white">{doc.title}</h3>
              <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed font-medium bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                {doc.content}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => openEditor(doc)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Policy Text
              </button>

              <Link 
                href={doc.path}
                target="_blank"
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition"
                title="View Live Page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Document Editor Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white">Editing: {editingDoc.title}</h2>
              <button onClick={() => setEditingDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Full Document Body (Markdown / Plain Text) *
                </label>
                <textarea 
                  required
                  rows="8"
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingDoc(null)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Legal Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
