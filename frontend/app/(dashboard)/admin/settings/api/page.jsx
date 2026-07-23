'use client';

import { useState, useEffect } from 'react';
import { 
  Key, Plus, Eye, EyeOff, Save, CheckCircle2, Copy, Trash2, ShieldCheck, RefreshCw, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function APIKeysPage() {
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState({});
  const [apiKeys, setApiKeys] = useState({
    razorpayKeyId: 'rzp_live_GS940182490',
    razorpaySecret: '••••••••••••••••••••••••',
    googleMapsKey: 'AIzaSyA89402194820194820194',
    smsApiKey: 'F2SMS_KEY_849201840291',
    geminiApiKey: 'AIzaSyC902840192840192840'
  });

  const [generatedKeys, setGeneratedKeys] = useState([
    { id: 1, name: 'Mobile App Client SDK Key', key: 'gk_live_849201948201', created: '20 Jul 2026', scope: 'READ_ONLY' },
    { id: 2, name: 'Vendor Analytics Webhook Key', key: 'gk_live_948201948209', created: '10 Jul 2026', scope: 'READ_WRITE' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gc_api_keys');
      if (saved) {
        try { setApiKeys(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, []);

  const toggleShow = (field) => {
    setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gc_api_keys', JSON.stringify(apiKeys));
      }
      toast.success('API Keys and Integrations saved securely!');
      setLoading(false);
    }, 400);
  };

  const handleGenerateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Key Name is required');
      return;
    }

    const created = {
      id: Date.now(),
      name: newKeyName.trim(),
      key: `gk_live_${Math.random().toString(36).substring(2, 14)}`,
      created: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      scope: 'READ_WRITE'
    };

    setGeneratedKeys([created, ...generatedKeys]);
    toast.success('New API Key generated!');
    setIsModalOpen(false);
    setNewKeyName('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">API Keys & External Integrations</h1>
          <p className="text-slate-500 text-xs mt-1">Configure payment gateways, Google Maps, SMS gateways, and custom API tokens.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-amber-400" /> Generate Token
          </button>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save API Credentials'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Integration Credentials */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Key className="w-4 h-4 text-indigo-500" /> Gateway & Third-Party Service Credentials
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Razorpay Key ID *
              </label>
              <input 
                type="text" 
                value={apiKeys.razorpayKeyId}
                onChange={e => setApiKeys({...apiKeys, razorpayKeyId: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Razorpay Secret Key *
              </label>
              <div className="relative">
                <input 
                  type={showKeys.rzp ? 'text' : 'password'}
                  value={apiKeys.razorpaySecret}
                  onChange={e => setApiKeys({...apiKeys, razorpaySecret: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
                <button type="button" onClick={() => toggleShow('rzp')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showKeys.rzp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                Google Maps JS & Geocoding Key
              </label>
              <input 
                type="text" 
                value={apiKeys.googleMapsKey}
                onChange={e => setApiKeys({...apiKeys, googleMapsKey: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                SMS / WhatsApp Gateway Key (Fast2SMS / Twilio)
              </label>
              <input 
                type="text" 
                value={apiKeys.smsApiKey}
                onChange={e => setApiKeys({...apiKeys, smsApiKey: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-mono text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </form>
        </div>

        {/* Custom SDK / Integration Keys */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Active Platform API Access Keys
          </h2>

          <div className="space-y-3">
            {generatedKeys.map(k => (
              <div key={k.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white block">{k.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{k.key}</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(k.key);
                    toast.success('API Token copied!');
                  }}
                  className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-xl transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Generate Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Generate New API Integration Key</h2>
            
            <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase">Key Description Name *</label>
                <input 
                  required
                  type="text" 
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="e.g. Android Mobile App Integration Key"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Generate Token</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
