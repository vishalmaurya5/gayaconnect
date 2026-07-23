'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, CheckCircle2, FileText, IdCard, StickyNote, Plus, Trash2, Download, LogOut, 
  User, ShieldCheck, Phone, Mail, MapPin, AlertCircle, Send, Check, HeartPulse, Sparkles, Building2, CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance', 'leave', 'idcard', 'notes'
  
  // Attendance State
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([
    { date: new Date().toLocaleDateString('en-IN'), status: 'PRESENT', inTime: '09:15 AM', outTime: '06:30 PM' },
    { date: '23 Jul 2026', status: 'PRESENT', inTime: '09:05 AM', outTime: '06:10 PM' },
    { date: '22 Jul 2026', status: 'PRESENT', inTime: '09:20 AM', outTime: '06:15 PM' },
  ]);

  // Leave Application State
  const [leaveType, setLeaveType] = useState('SICK');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leavesList, setLeavesList] = useState([
    { id: 1, type: 'Sick Leave', from: '2026-07-15', to: '2026-07-16', reason: 'Fever & viral infection', status: 'APPROVED' }
  ]);

  // Keep Notes State
  const [notes, setNotes] = useState([
    { id: 1, title: 'Weekly Staff Sync Notes', content: 'Complete pending client onboarding documentation and verify field reports.', date: 'Today' }
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  // ID Card Download State
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('employee_session');
      if (savedSession) {
        try {
          setEmployee(JSON.parse(savedSession));
        } catch (e) {
          router.push('/employee/login');
        }
      } else {
        // Fallback default employee state for preview if direct access
        setEmployee({
          empId: 'GS-EMP-0001',
          name: 'Staff Member',
          email: 'employee@gayaseva.com',
          phone: '9876543210',
          department: 'IT & Engineering',
          designation: 'Software Engineer',
          aadharNumber: '123456789012',
          salary: 35000,
          bloodGroup: 'O+'
        });
      }

      // Load saved notes from localStorage
      const savedNotes = localStorage.getItem('emp_keep_notes');
      if (savedNotes) {
        try { setNotes(JSON.parse(savedNotes)); } catch (e) {}
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('employee_session');
    }
    toast.success('Logged out successfully');
    router.push('/employee/login');
  };

  // Punch In / Punch Out Toggle
  const togglePunch = () => {
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    if (!punchedIn) {
      setPunchedIn(true);
      setPunchInTime(timeNow);
      toast.success(`Punched In at ${timeNow}`);
      setAttendanceLogs(prev => [
        { date: new Date().toLocaleDateString('en-IN'), status: 'PRESENT', inTime: timeNow, outTime: '-' },
        ...prev.slice(1)
      ]);
    } else {
      setPunchedIn(false);
      toast.success(`Punched Out at ${timeNow}`);
      setAttendanceLogs(prev => prev.map((log, idx) => idx === 0 ? { ...log, outTime: timeNow } : log));
    }
  };

  // Submit Leave Request
  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo || !leaveReason.trim()) {
      toast.error('Please complete all leave application fields');
      return;
    }

    const newLeave = {
      id: Date.now(),
      type: leaveType === 'SICK' ? 'Sick Leave' : leaveType === 'CASUAL' ? 'Casual Leave' : 'Emergency Leave',
      from: leaveFrom,
      to: leaveTo,
      reason: leaveReason.trim(),
      status: 'PENDING'
    };

    setLeavesList(prev => [newLeave, ...prev]);
    toast.success('Leave application submitted for Admin approval!');
    setLeaveReason('');
    setLeaveFrom('');
    setLeaveTo('');
  };

  // Add Keep Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      toast.error('Title and Note content are required');
      return;
    }

    const updatedNotes = [
      { id: Date.now(), title: newNoteTitle.trim(), content: newNoteContent.trim(), date: new Date().toLocaleDateString('en-IN') },
      ...notes
    ];

    setNotes(updatedNotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('emp_keep_notes', JSON.stringify(updatedNotes));
    }

    setNewNoteTitle('');
    setNewNoteContent('');
    toast.success('Note saved to your Keep Notes!');
  };

  // Delete Note
  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem('emp_keep_notes', JSON.stringify(updatedNotes));
    }
    toast.success('Note deleted');
  };

  // Download ID Card PNG
  const downloadIdCard = async () => {
    setIsDownloading(true);
    try {
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        document.body.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      const cardElem = document.getElementById('employee-id-badge-canvas');
      const canvas = await window.html2canvas(cardElem, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `GayaSeva_Emp_${(employee?.name || 'Staff').replace(/\s+/g, '_')}_IDCard.png`;
      link.href = image;
      link.click();
      toast.success('ID Card PNG downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download ID Card');
    } finally {
      setIsDownloading(false);
    }
  };

  const cleanAadhar = (employee?.aadharNumber || '').replace(/\D/g, '');
  const maskedAadhar = cleanAadhar.length >= 4 ? `XXXX-XXXX-${cleanAadhar.slice(-4)}` : 'N/A';
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/employee/${employee?._id || employee?.empId || 'GS-EMP-0001'}` : '')}&size=300&margin=0`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-x-hidden">
      
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-600/20 via-amber-500/10 to-transparent blur-[140px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-2xl p-1 shadow-md border border-amber-400/40 flex items-center justify-center">
              <img src="/gaya_seva_app_icon.png" alt="GayaSeva" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg leading-none">Gaya<span className="text-amber-400">Seva</span></h1>
              <p className="text-[10px] text-amber-300 font-bold uppercase tracking-widest mt-0.5">Staff Portal • {employee?.empId || 'GS-EMP-0001'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-white">{employee?.name || 'Staff Member'}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6 relative z-10">

        {/* EMPLOYEE WELCOME BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black rounded-full uppercase tracking-wider">
              {employee?.department || 'IT'} Division • {employee?.designation || 'Staff'}
            </span>
            <h2 className="text-2xl font-black text-white">Welcome, {employee?.name || 'Staff Member'}! 👋</h2>
            <p className="text-slate-400 text-xs">Manage daily check-ins, submit sick leaves, download ID cards, and keep work notes.</p>
          </div>

          {/* Quick Punch Button */}
          <button 
            onClick={togglePunch}
            className={`px-6 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all ${
              punchedIn 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-slate-950 shadow-emerald-500/25'
            }`}
          >
            <Clock className="w-4 h-4" />
            {punchedIn ? `PUNCH OUT (${punchInTime})` : 'PUNCH IN TODAY'}
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 gap-1 overflow-x-auto">
          {[
            { id: 'attendance', label: 'My Attendance', icon: Calendar },
            { id: 'leave', label: 'Sick Leaves', icon: HeartPulse },
            { id: 'idcard', label: 'Download ID Card', icon: IdCard },
            { id: 'notes', label: 'Keep Notes', icon: StickyNote },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap flex-1 justify-center ${
                  isActive 
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: MY ATTENDANCE LOG */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" /> Attendance History ({attendanceLogs.length} Records)
                </h3>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Status: 100% Present
                </span>
              </div>

              <div className="space-y-2.5">
                {attendanceLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-white block">{log.date}</span>
                        <span className="text-slate-400 text-[10px]">Punched In: <strong className="text-slate-200">{log.inTime}</strong></span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-black rounded-full border border-emerald-500/20 text-[10px] uppercase">
                        {log.status}
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-1">Out: {log.outTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SICK LEAVE & LEAVE APPLICATIONS */}
        {activeTab === 'leave' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Submit Leave Application */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" /> Apply for Leave / Sick Leave
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Submit your request directly to Admin for approval.</p>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Leave Type *</label>
                    <select 
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="SICK">Sick Leave</option>
                      <option value="CASUAL">Casual Leave</option>
                      <option value="EMERGENCY">Emergency Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">From Date *</label>
                    <input 
                      required
                      type="date" 
                      value={leaveFrom}
                      onChange={(e) => setLeaveFrom(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">To Date *</label>
                    <input 
                      required
                      type="date" 
                      value={leaveTo}
                      onChange={(e) => setLeaveTo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Reason for Leave *</label>
                  <textarea 
                    required
                    rows="2"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Briefly state your illness or emergency reason..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 resize-none font-medium"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-3 rounded-xl shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center gap-2"
                >
                  Submit Leave Request <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Previous Leave Requests */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Leave History & Status</h4>
              <div className="space-y-2.5">
                {leavesList.map(l => (
                  <div key={l.id} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-extrabold">{l.type}</strong>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        l.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {l.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{l.from} to {l.to}</p>
                    <p className="text-slate-300 italic">{l.reason}</p>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 3: DOWNLOAD MY ID CARD */}
        {activeTab === 'idcard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col items-center gap-6">
              
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white uppercase tracking-wide">My Official Employee Identity Card</h3>
                <p className="text-slate-400 text-xs">Standard 65mm × 95mm Official GayaSeva Enterprise Staff Badge.</p>
              </div>

              {/* ID Card Component Rendered */}
              <div 
                id="employee-id-badge-canvas"
                className="w-[340px] bg-white rounded-[22px] overflow-hidden relative flex flex-col border border-slate-300 shadow-2xl font-sans select-none text-slate-900"
                style={{ width: '340px', minHeight: '540px' }}
              >
                {/* Header */}
                <div 
                  className="h-[95px] w-full bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] relative border-b-[3px] border-indigo-500 flex justify-between px-4 py-3 z-10 flex-shrink-0"
                  style={{ borderBottomLeftRadius: '50% 15px', borderBottomRightRadius: '50% 15px' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-[36px] h-[36px] bg-white rounded-full border border-white overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                      <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h2 className="text-white font-black text-[18px] leading-none m-0">GAYA<span className="text-amber-400">SEVA</span></h2>
                      <p className="text-indigo-200 text-[7px] font-black tracking-widest uppercase mt-0.5 leading-none m-0">STAFF IDENTITY BADGE</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-white text-[8px] font-black leading-tight block">VERIFIED<br/>STAFF</span>
                  </div>
                </div>

                {/* Sub Header */}
                <div className="text-center mt-1 z-20 relative flex-shrink-0">
                  <h3 className="text-slate-800 text-[9px] font-black tracking-widest uppercase m-0">
                    <span className="text-indigo-600 mx-1">•</span> OFFICIAL STAFF BADGE <span className="text-indigo-600 mx-1">•</span>
                  </h3>
                </div>

                {/* Avatar */}
                <div className="flex justify-center items-center mt-1 relative h-[100px] flex-shrink-0">
                  <div className="w-[95px] h-[95px] bg-white rounded-full p-1 border border-slate-200 shadow-lg z-30">
                    <div className="w-full h-full rounded-full border-[2.5px] border-indigo-600 overflow-hidden bg-slate-100 flex items-center justify-center">
                      <User className="w-10 h-10 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="text-center mt-1 px-4 relative z-20 flex flex-col items-center flex-shrink-0">
                  <h1 className="m-0 p-0 text-[#0f172a] font-black text-[18px] uppercase leading-tight">{employee?.name || 'Staff Member'}</h1>
                  <h2 className="mt-0.5 mb-1.5 p-0 text-[#4338ca] font-black text-[11px] uppercase leading-tight">{employee?.designation || 'Staff'} • {employee?.department || 'General'}</h2>
                  
                  <div className="bg-slate-50 border border-indigo-400 border-dashed px-4 py-1.5 rounded-xl inline-flex flex-col items-center justify-center mb-1">
                    <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">EMPLOYEE ID</span>
                    <span className="text-[16px] font-black text-slate-900 font-mono tracking-widest leading-tight mt-0.5">{employee?.empId || 'GS-EMP-0001'}</span>
                  </div>
                </div>

                {/* Details & QR */}
                <div className="flex items-stretch bg-slate-50 mx-3 rounded-xl border border-slate-200 overflow-hidden relative z-20 my-1">
                  <div className="flex-1 p-2 flex flex-col justify-between border-r border-slate-300 border-dashed text-left space-y-1">
                    <div className="text-[7.5px] font-extrabold text-slate-400 uppercase">Aadhar: <strong className="text-slate-900 font-mono text-[9px] block">{maskedAadhar}</strong></div>
                    <div className="text-[7.5px] font-extrabold text-slate-400 uppercase">Phone: <strong className="text-slate-900 text-[9px] block">{employee?.phone || '9876543210'}</strong></div>
                  </div>
                  
                  <div className="w-[100px] p-1.5 flex flex-col items-center justify-center bg-white text-center flex-shrink-0">
                    <span className="text-[6.5px] font-black text-slate-800">SCAN TO VERIFY</span>
                    <img src={qrCodeUrl} alt="QR" className="w-[65px] h-[65px] object-contain" />
                  </div>
                </div>

                {/* Footer */}
                <div className="h-[36px] w-full bg-[#0F172A] flex justify-between items-center px-4 relative z-20 text-white flex-shrink-0 mt-auto rounded-b-[22px]">
                  <span className="text-[7.5px] font-bold text-slate-300">www.gayaseva.com</span>
                  <span className="text-[16px] text-amber-400 italic" style={{ fontFamily: '"Brush Script MT", cursive' }}>Gayaseva</span>
                  <span className="text-[7.5px] font-extrabold text-slate-300">ADMIN</span>
                </div>
              </div>

              {/* Download Button */}
              <button 
                onClick={downloadIdCard}
                disabled={isDownloading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-8 py-3 rounded-2xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> {isDownloading ? 'Downloading...' : 'Download My ID Card PNG'}
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 4: KEEP NOTES / WORK DIARY */}
        {activeTab === 'notes' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Add New Keep Note Form */}
            <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-amber-400" /> Keep Notes & Daily Work Diary
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">Save personal task reminders, client notes, and work logs.</p>
              </div>

              <form onSubmit={handleAddNote} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Note Title *</label>
                  <input 
                    required
                    type="text" 
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="e.g. Daily Client Follow-ups & Reminders" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Note Details *</label>
                  <textarea 
                    required
                    rows="3"
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Write your work notes, key points, or checklist here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 resize-none font-medium"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Save to Keep Notes
                </button>
              </form>
            </div>

            {/* Saved Notes Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Saved Notes ({notes.length})</h4>
              
              {notes.length === 0 ? (
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 text-center text-slate-500 text-xs">
                  No saved notes yet. Use the form above to add your first work diary note!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-slate-900/90 p-5 rounded-2xl border border-amber-500/20 shadow-md space-y-2 relative flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h5 className="font-extrabold text-white text-sm leading-snug">{note.title}</h5>
                          <button 
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Delete Note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-medium whitespace-pre-wrap">{note.content}</p>
                      </div>
                      <div className="text-[10px] text-amber-400 font-bold tracking-wider uppercase pt-2 border-t border-slate-800/80">
                        🗓️ {note.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </motion.div>
        )}

      </main>
    </div>
  );
}
