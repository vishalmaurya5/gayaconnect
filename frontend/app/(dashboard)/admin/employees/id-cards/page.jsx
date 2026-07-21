'use client';
import { useState } from 'react';
import { Printer, Search, Download, Briefcase, Phone, Droplet, Calendar, CreditCard, IdCard as IdIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IDCardsPage() {
  const [loading, setLoading] = useState(false);
  const [printingId, setPrintingId] = useState(null);

  const employees = [
    { 
      id: 1, empId: 'GS-1001', name: 'Rajeev Kumar', role: 'Software Engineer', 
      department: 'Engineering', blood: 'O+', phone: '+91 9934250000', 
      joinDate: '12 Jan 2024', cardNo: 'C-89211'
    },
    { 
      id: 2, empId: 'GS-1002', name: 'Sneha Sharma', role: 'HR Manager', 
      department: 'Human Resources', blood: 'B+', phone: '+91 9117588242', 
      joinDate: '05 Mar 2024', cardNo: 'C-89212'
    },
    { 
      id: 3, empId: 'GS-1003', name: 'Amit Singh', role: 'Sales Executive', 
      department: 'Sales', blood: 'A+', phone: '+91 8544491413', 
      joinDate: '20 Apr 2024', cardNo: 'C-89213'
    },
  ];

  const handlePrint = (id) => {
    setPrintingId(id);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintingId(null), 500);
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Identity Cards</h1>
          <p className="text-gray-500 text-sm mt-1">Generate and manage premium SaaS employee identity cards.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-target, .print-target * { visibility: visible; }
          .print-target {
            position: absolute;
            left: 0;
            top: 0;
            width: 320px !important;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
          .print-target .print-actions { display: none !important; }
          .no-print { display: none !important; }
          html, body { 
            background: white !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search employee..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-indigo-600" />
        </div>
        <button className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-sm flex items-center gap-2 rounded-lg transition border border-indigo-200">
          <Download className="w-4 h-4" /> Bulk Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {employees.map((emp) => (
          <div key={emp.id} className="flex flex-col">
            {/* The ID Card */}
            <div className={`relative bg-[#F8FAFC] overflow-hidden border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all ${printingId === emp.id ? 'print-target' : ''}`}>
              
              {/* Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                <span className="text-6xl font-black rotate-[-45deg] tracking-[0.2em] text-gray-900 whitespace-nowrap">GAYA SEVA</span>
              </div>
              
              {/* Premium Gradient Header */}
              <div className="bg-gradient-to-r from-[#4F46E5] to-[#2563EB] px-5 pt-5 pb-14 relative z-10 flex items-start justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-indigo-200 overflow-hidden shadow-sm shrink-0 flex items-center justify-center p-1">
                    <img src="/gaya_seva_app_icon.png" alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg tracking-tight leading-none">GAYA SEVA</h2>
                    <p className="text-indigo-100 text-[8px] uppercase tracking-widest font-bold mt-1 opacity-90">Enterprise Employee Identity Card</p>
                  </div>
                </div>
                <div>
                  <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-emerald-400 tracking-wide">ACTIVE</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-5 pb-5 relative z-10">
                
                {/* Employee Photo */}
                <div className="flex flex-col items-center -mt-12 relative z-20">
                  <div className="w-24 h-24 rounded-full border-[3px] border-white shadow-md bg-gray-100 overflow-hidden flex items-end justify-center">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`} alt={emp.name} className="w-[90%] h-[90%] object-contain object-bottom" />
                  </div>
                  <h3 className="text-lg font-black text-[#111827] mt-2 uppercase tracking-tight leading-tight">{emp.name}</h3>
                  <p className="text-[#2563EB] text-xs font-bold tracking-wide">{emp.role}</p>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center gap-1 tracking-wider"><IdIcon className="w-3 h-3"/> Employee ID</span>
                    <span className="text-xs font-black text-[#111827] pl-4">{emp.empId}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center gap-1 tracking-wider"><Briefcase className="w-3 h-3"/> Department</span>
                    <span className="text-xs font-black text-[#111827] pl-4">{emp.department}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center gap-1 tracking-wider"><Droplet className="w-3 h-3"/> Blood Group</span>
                    <span className="text-xs font-black text-rose-600 pl-4">{emp.blood}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center gap-1 tracking-wider"><Phone className="w-3 h-3"/> Emergency</span>
                    <span className="text-xs font-black text-[#111827] pl-4">{emp.phone}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center gap-1 tracking-wider"><Calendar className="w-3 h-3"/> Joining Date</span>
                    <span className="text-xs font-black text-[#111827] pl-4">{emp.joinDate}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-[#6B7280] uppercase flex items-center gap-1 tracking-wider"><CreditCard className="w-3 h-3"/> Card Number</span>
                    <span className="text-xs font-black text-[#111827] pl-4">{emp.cardNo}</span>
                  </div>
                </div>

                {/* QR Section */}
                <div className="flex flex-col items-center mt-6 pt-4 border-t border-gray-200 border-dashed">
                  <div className="bg-white p-1.5 border border-gray-200 rounded-lg shadow-sm">
                    <img src={`https://quickchart.io/qr?text=${emp.empId}&size=90`} alt="QR" className="w-[90px] h-[90px] object-contain opacity-90" />
                  </div>
                  <p className="text-[9px] font-bold text-[#6B7280] mt-2 uppercase tracking-widest">Scan to Verify Employee</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-[#E5E7EB] py-2.5 px-5 flex flex-col items-center justify-center relative z-10 gap-0.5 border-t border-gray-300">
                <span className="text-[10px] font-black text-[#111827] tracking-widest uppercase">Verified Enterprise Employee</span>
                <div className="flex items-center gap-2 text-[9px] text-[#6B7280] font-bold w-full justify-between mt-0.5">
                  <span>www.gayaseva.com</span>
                  <span>© Gaya Seva</span>
                </div>
              </div>
            </div>

            {/* Print Button Component Outside Card */}
            <div className="mt-4 flex justify-center no-print">
              <button 
                onClick={() => handlePrint(emp.id)} 
                className="w-full sm:w-auto px-6 py-2.5 bg-white text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition flex items-center justify-center gap-2 border border-gray-200 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Print ID Card
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
