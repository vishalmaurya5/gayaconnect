'use client';

import { useState } from 'react';
import { 
  UserPlus, Mail, Phone, MapPin, Briefcase, Calendar, ShieldCheck, Check, 
  CreditCard, DollarSign, Copy, Eye, EyeOff, Sparkles, ArrowRight, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CreateEmployeePage() {
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadharNumber: '',
    department: 'IT',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '25000',
    bloodGroup: 'O+',
    address: '',
    photo: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCreatedCredentials(null);

    // Basic Aadhar validation check
    const cleanAadhar = formData.aadharNumber.replace(/\D/g, '');
    if (cleanAadhar.length !== 12) {
      toast.error('Please enter a valid 12-digit Aadhar Number');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          aadharNumber: cleanAadhar
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Employee created successfully!');
        setCreatedCredentials(data.credentials);
        setFormData({
          name: '',
          email: '',
          phone: '',
          aadharNumber: '',
          department: 'IT',
          designation: '',
          joiningDate: new Date().toISOString().split('T')[0],
          salary: '25000',
          bloodGroup: 'O+',
          address: '',
          photo: ''
        });
      } else {
        toast.error(data.message || 'Failed to create employee');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Failed to create employee.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `GayaSeva Employee Credentials:\nUser ID / Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nEmp ID: ${createdCredentials.empId}\nAadhar: ${createdCredentials.aadharNumber}`;
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* SUCCESS CREDENTIALS DISPLAY BANNER */}
      {createdCredentials && (
        <div className="bg-gradient-to-r from-emerald-900 to-indigo-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Employee Account & Credentials Created!</h3>
                <p className="text-xs text-emerald-200">Share these login details with the employee for accessing their portal.</p>
              </div>
            </div>
            <button 
              onClick={copyCredentials}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition"
            >
              <Copy className="w-4 h-4" /> Copy Login Info
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/10 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Employee ID</span>
              <strong className="text-amber-400 text-sm block mt-0.5">{createdCredentials.empId}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">User ID / Email</span>
              <strong className="text-white text-sm block mt-0.5 truncate">{createdCredentials.email}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Password</span>
              <div className="flex items-center gap-2 mt-0.5">
                <strong className="text-emerald-400 text-sm font-bold">
                  {showPassword ? createdCredentials.password : '••••••••'}
                </strong>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Login Portal Link</span>
              <button 
                type="button" 
                onClick={() => {
                  const portalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/employee/login`;
                  navigator.clipboard.writeText(portalUrl);
                  toast.success('Employee Login URL copied!');
                }}
                className="text-amber-300 font-bold hover:underline block text-xs mt-1 truncate"
              >
                /employee/login 📋
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs pt-1 gap-2">
            <span className="text-slate-300 font-semibold">Registered Aadhar: <strong className="text-white">XXXX-XXXX-{createdCredentials.aadharNumber?.slice(-4)}</strong></span>
            <Link href="/admin/employees" className="text-amber-300 font-bold hover:underline flex items-center gap-1">
              View All Employees <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* CREATE EMPLOYEE FORM */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create New Employee</h1>
            <p className="text-slate-500 text-xs mt-0.5">Add staff member, assign credentials, and set up payroll records.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium" 
                  placeholder="e.g. Ramesh Sharma" 
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Email Address (User ID) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium" 
                  placeholder="ramesh@gayaseva.com" 
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium" 
                  placeholder="9876543210" 
                />
              </div>
            </div>

            {/* Aadhar Number (REQUIRED NEW FIELD) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Aadhar Card Number (12 Digits) *</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                <input 
                  required 
                  type="text" 
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  maxLength="14"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-mono tracking-wider font-bold" 
                  placeholder="1234 5678 9012" 
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Department</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium"
                >
                  <option value="IT">IT & Engineering</option>
                  <option value="HR">Human Resources</option>
                  <option value="Sales">Sales & Marketing</option>
                  <option value="Support">Customer Support</option>
                  <option value="Operations">Field Operations</option>
                  <option value="Finance">Finance & Accounts</option>
                </select>
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Designation</label>
              <input 
                required 
                type="text" 
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium" 
                placeholder="e.g. Software Engineer / Operations Manager" 
              />
            </div>

            {/* Monthly Salary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Monthly Salary (₹)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input 
                  type="number" 
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-bold" 
                  placeholder="25000" 
                />
              </div>
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Joining Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium" 
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Blood Group</label>
              <select 
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Photo Image URL (Optional)</label>
              <input 
                type="url" 
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium" 
                placeholder="https://..." 
              />
            </div>

            {/* Residential Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">Residential Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <textarea 
                  rows="2" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium resize-none" 
                  placeholder="Complete residential address in Gaya / Bihar..."
                ></textarea>
              </div>
            </div>

          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <Link 
              href="/admin/employees"
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-black transition flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-70"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Check className="w-4 h-4" />}
              {loading ? 'Creating...' : 'Create Employee & Generate Credentials'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
