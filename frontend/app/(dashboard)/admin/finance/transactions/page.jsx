'use client';
import { useState, useEffect, useContext } from 'react';
import { Search, ArrowDownRight, ArrowUpRight, Filter, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminContext } from '../../layout';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  const admin = useContext(AdminContext);

  useEffect(() => {
    fetchTransactions(selectedCity);
  }, [selectedCity]);

  const fetchTransactions = async (city = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/finance/payments?city=${encodeURIComponent(city)}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.payments);
      }
    } catch (err) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = filterStatus === 'All' || tx.paymentStatus === filterStatus;
    const matchesSearch = 
      (tx.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx._id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Customer', 'Service', 'Method', 'Status', 'Amount'];
    const rows = filteredTransactions.map(tx => [
      tx.referenceNumber || 'TXN-' + tx._id.slice(-6).toUpperCase(),
      new Date(tx.createdAt).toLocaleDateString(),
      tx.customerName,
      tx.service,
      tx.paymentMethod,
      tx.paymentStatus,
      tx.totalAmount
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Print Styles for PDF Export */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-pdf, #printable-pdf * { visibility: visible; }
          #printable-pdf { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          html, body { background: white !important; }
        }
      `}} />

      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">All Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">View and filter all financial transactions.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2 shadow-sm">
            <FileText className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-600/20">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden no-print">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Txn ID or Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            {admin?.role === 'SUPER_ADMIN' && (
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
              >
                <option value="">All Cities</option>
                <option value="Gaya">Gaya</option>
                <option value="Patna">Patna</option>
                <option value="Nawada">Nawada</option>
                <option value="Delhi">Delhi</option>
                <option value="Noida">Noida</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Varanasi">Varanasi</option>
              </select>
            )}
            
            <Filter className="w-4 h-4 text-slate-500 ml-2" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading transactions...</td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No transactions found.</td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {tx.paymentStatus === 'Paid' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white text-xs">{tx.referenceNumber || 'TXN-' + tx._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-slate-500">{tx.paymentMethod}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{tx.customerName}</p>
                      <p className="text-xs text-slate-500">{tx.service}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      ₹{tx.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${tx.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : tx.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {tx.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Printable Area for PDF Export */}
      <div id="printable-pdf" className="hidden print:block bg-white text-black p-8 font-sans">
        <div className="flex justify-between items-center border-b-2 border-indigo-600 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img src="/gaya_seva_app_icon.png" alt="Gaya Seva Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">GAYA<span className="text-amber-500">SEVA</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Enterprise Finance</p>
              <div className="mt-2 text-xs text-slate-600">
                <p>Gaya, Bihar 823001 | Phone: +91 9117588242</p>
                <p>Email: support@gayaseva.com | Web: www.gayaseva.com</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-slate-200 uppercase tracking-widest">TRANSACTIONS</h2>
            <p className="text-sm font-semibold text-slate-600 mt-2">Generated On: {new Date().toLocaleDateString('en-IN')}</p>
            <p className="text-sm font-semibold text-slate-600 mt-1">Status Filter: {filterStatus}</p>
          </div>
        </div>

        <table className="w-full text-left text-sm border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-200 p-2 font-bold text-slate-700">TXN ID</th>
              <th className="border border-slate-200 p-2 font-bold text-slate-700">Date</th>
              <th className="border border-slate-200 p-2 font-bold text-slate-700">Customer</th>
              <th className="border border-slate-200 p-2 font-bold text-slate-700">Service</th>
              <th className="border border-slate-200 p-2 font-bold text-slate-700 text-right">Amount</th>
              <th className="border border-slate-200 p-2 font-bold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx._id}>
                <td className="border border-slate-200 p-2 text-xs font-mono">{tx.referenceNumber || 'TXN-' + tx._id.slice(-6).toUpperCase()}</td>
                <td className="border border-slate-200 p-2 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="border border-slate-200 p-2 text-xs">{tx.customerName}</td>
                <td className="border border-slate-200 p-2 text-xs">{tx.service}</td>
                <td className="border border-slate-200 p-2 text-xs text-right font-bold">₹{tx.totalAmount}</td>
                <td className="border border-slate-200 p-2 text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tx.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                    {tx.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="6" className="border border-slate-200 p-4 text-center text-slate-500">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>This is a system generated transaction report.</p>
        </div>
      </div>

    </div>
  );
}
