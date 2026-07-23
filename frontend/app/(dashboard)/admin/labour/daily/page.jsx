'use client';

import { useState, useEffect, useContext } from 'react';
import { 
  Search, Filter, Download, Plus, HardHat, Clock, Calendar, MapPin, DollarSign, X, CheckCircle2
} from 'lucide-react';
import { AdminContext } from '../../layout';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DailyLabourPage() {
  const [shifts, setShifts] = useState([]);
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const initialFormState = {
    labourId: '',
    siteName: '',
    clientName: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    shiftType: 'Full Shift',
    dailyRate: '',
    notes: ''
  };
  const [form, setForm] = useState(initialFormState);
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchShifts();
    fetchLabourers();
  }, []);

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/labour/daily');
      const data = await res.json();
      if (data.success) {
        setShifts(data.shifts || []);
      }
    } catch (error) {
      toast.error('Failed to load daily shifts');
    } finally {
      setLoading(false);
    }
  };

  const fetchLabourers = async () => {
    try {
      const res = await fetch('/api/admin/labour');
      const data = await res.json();
      if (data.success) {
        setLabourers(data.labourers || []);
      }
    } catch (error) {}
  };

  const handleAssignShift = async (e) => {
    e.preventDefault();
    if (!form.labourId || !form.siteName || !form.location || !form.dailyRate) {
      return toast.error('Please fill required fields (Worker, Site Name, Location, Rate)');
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/labour/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Shift assigned successfully!');
        setIsAssignModalOpen(false);
        setForm(initialFormState);
        fetchShifts();
      } else {
        toast.error(data.message || 'Failed to assign shift');
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredShifts = shifts.filter(s => {
    const term = searchInput.toLowerCase();
    return !term || 
      s.labourId?.name?.toLowerCase().includes(term) ||
      s.siteName?.toLowerCase().includes(term) ||
      s.location?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daily Labour</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage daily wage workers, active job sites, and daily assignments.</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Assign Daily Shift
          </motion.button>
        </div>
      </div>

      {/* Shifts Table Card */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#05080f]/50">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by worker, site, location..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-72 pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="text-sm font-bold text-slate-500">
            Total Shifts: <span className="text-indigo-600">{filteredShifts.length}</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[350px]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Worker Details</th>
                  <th className="px-6 py-4">Site & Location</th>
                  <th className="px-6 py-4">Date & Shift</th>
                  <th className="px-6 py-4">Daily Rate</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#0B0F19]">
                {filteredShifts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-500/10 mb-4 text-indigo-500">
                        <Clock className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Daily Shifts</h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">Click "Assign Daily Shift" to dispatch workers to job sites.</p>
                    </td>
                  </tr>
                ) : (
                  filteredShifts.map((shift) => (
                    <tr key={shift._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center border border-indigo-500/30">
                            {shift.labourId?.photo ? (
                              <img src={shift.labourId.photo} alt="worker" className="w-full h-full object-cover" />
                            ) : (
                              <HardHat className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{shift.labourId?.name || 'Worker'}</div>
                            <div className="text-xs text-slate-500">{shift.labourId?.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{shift.siteName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {shift.location}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {shift.date}
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{shift.shiftType}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">₹{shift.dailyRate}</span>
                        <span className="text-xs text-slate-400">/day</span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-full border border-indigo-200 dark:border-indigo-800">
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Assign Shift Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Assign Daily Worker Shift</h3>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAssignShift} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Select Labour Worker *</label>
                  <select 
                    value={form.labourId}
                    onChange={(e) => setForm({ ...form, labourId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-medium"
                    required
                  >
                    <option value="">-- Choose Worker --</option>
                    {labourers.map(l => (
                      <option key={l._id} value={l._id}>
                        {l.name} ({l.profession || l.category || 'Worker'}) - {l.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Job Site Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Civil Lines Site A"
                      value={form.siteName}
                      onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Client / Supervisor</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Kumar"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Site Location / Address *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Near Station Road, Gaya"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Shift Type</label>
                    <select 
                      value={form.shiftType}
                      onChange={(e) => setForm({ ...form, shiftType: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-medium"
                    >
                      <option value="Full Shift">Full Shift</option>
                      <option value="Day">Day Shift</option>
                      <option value="Night">Night Shift</option>
                      <option value="Half Shift">Half Shift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Daily Rate (₹) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 750"
                      value={form.dailyRate}
                      onChange={(e) => setForm({ ...form, dailyRate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setIsAssignModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all text-sm disabled:opacity-50"
                  >
                    {submitting ? 'Assigning...' : 'Confirm Shift'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
