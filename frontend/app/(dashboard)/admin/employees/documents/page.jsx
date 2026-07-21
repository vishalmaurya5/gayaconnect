'use client';
import { useState } from 'react';
import { FileText, Download, Upload, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentsPage() {
  const docs = [
    { id: 1, empName: 'Rajeev Kumar', docType: 'Aadhar Card', date: '10 Jan 2024', status: 'Verified' },
    { id: 2, empName: 'Rajeev Kumar', docType: 'Offer Letter', date: '12 Jan 2024', status: 'Signed' },
    { id: 3, empName: 'Sneha Sharma', docType: 'PAN Card', date: '05 Mar 2024', status: 'Pending Verification' },
    { id: 4, empName: 'Amit Singh', docType: 'Degree Certificate', date: '20 Apr 2024', status: 'Verified' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Documents</h1>
          <p className="text-slate-500 text-sm mt-1">Manage KYC and official employee records securely.</p>
        </div>
        <button onClick={() => toast.success('Upload modal opened')} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search documents..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Document Type</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    {doc.docType}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{doc.empName}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${doc.status.includes('Verified') || doc.status === 'Signed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
