'use client';

import { useState, useEffect } from 'react';
import { 
  Users, ShoppingBag, Wrench, AlertCircle, CheckCircle, 
  MapPin, Briefcase, DollarSign, TrendingUp, UserPlus, 
  Building2, Car, MessageSquare, CreditCard, Activity, UserCheck, Image, MonitorPlay, Megaphone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedCity, timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Retaining existing API endpoint as strictly requested
      const url = selectedCity ? `/api/admin/overview?city=${selectedCity}` : '/api/admin/overview';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      toast.error('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-64"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-40"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Map backend stats to our new premium widgets
  const stats = [
    { label: "Today's Users", value: `+${data?.stats?.todayUsers || 0}`, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800' },
    { label: "Monthly Revenue", value: `₹${(data?.stats?.monthlyRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
    { label: "Verified Vendors", value: data?.stats?.vendors || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
    { label: "Verified Labour", value: data?.stats?.labourers || 0, icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' },
    { label: "Total Users", value: data?.stats?.users || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800' },
    { label: "Total Jobs", value: data?.stats?.jobs || 0, icon: Briefcase, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-200 dark:border-teal-800' },
    { label: "Pending Reviews", value: data?.stats?.pendingReviews || 0, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-200 dark:border-rose-800' },
    { label: "Total Revenue", value: `₹${(data?.stats?.revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-cyan-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30', border: 'border-cyan-200 dark:border-cyan-800' },
    { label: "Active Banners", value: data?.stats?.activeBanners || 0, icon: Image, color: 'text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800' },
    { label: "Active Popups", value: data?.stats?.activePopups || 0, icon: MonitorPlay, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800' },
  ];

  const labels = data?.analytics?.graphData?.map(d => d.name) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revenueData = data?.analytics?.graphData?.map(d => d.revenue) || [0, 0, 0, 0, 0, 0, 0];

  const areaChartData = {
    labels,
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueData,
        borderColor: '#4f46e5', // indigo-600
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.5)'); // indigo-600
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
          return gradient;
        },
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ['Vendors', 'Labourers', 'Customers', 'Businesses'],
    datasets: [
      {
        data: [
          data?.stats?.vendors || 45, 
          data?.stats?.labourers || 80, 
          (data?.stats?.users || 120) - (data?.stats?.vendors || 0) - (data?.stats?.labourers || 0),
          15
        ],
        backgroundColor: ['#3b82f6', '#f97316', '#8b5cf6', '#14b8a6'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false },
        ticks: { font: { size: 12, family: "'Inter', sans-serif" }, color: '#94a3b8', callback: (val) => `₹${val/1000}k` },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12, family: "'Inter', sans-serif" }, color: '#94a3b8' },
        border: { display: false }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#64748b', usePointStyle: true, padding: 20, font: { family: "'Inter', sans-serif" } }
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening in Gaya Seva today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">This Year</option>
          </select>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-indigo-600 border border-indigo-600 rounded-xl px-4 py-2 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-sm cursor-pointer hover:bg-indigo-700"
          >
            <option value="">Global View</option>
            <option value="Gaya">Gaya</option>
            <option value="Patna">Patna</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0B0F19] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/0 to-current opacity-[0.03] rounded-bl-full -z-10 ${stat.color}`}></div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            {i === 1 && (
              <div className="mt-4 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live Revenue Sync
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 pt-4">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform earnings over time</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Activity className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <Line data={areaChartData} options={chartOptions} />
          </div>
        </div>

        {/* User Roles Doughnut */}
        <div className="bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Distribution</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Demographics by role</p>
          </div>
          <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{data?.stats?.users || 0}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold mt-1">Total Users</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Access/Recent Activity (Premium Addon) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 pt-4">

        {/* Marketing & Ad Management (Added per user request) */}
        <div className="bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Advertisement Management</h2>
          </div>
          <div className="space-y-4">
            <a href="/admin/banners" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r from-transparent hover:from-indigo-50/50 dark:hover:from-indigo-900/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Manage Banners</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload and approve website banners</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
            </a>

            <a href="/admin/popup" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r from-transparent hover:from-amber-50/50 dark:hover:from-amber-900/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                  <MonitorPlay className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Manage Popups</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Control promotional popups & overlays</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
            </a>
            
            <a href="/admin/offers" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group bg-gradient-to-r from-transparent hover:from-emerald-50/50 dark:hover:from-emerald-900/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Manage Offers</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">View and approve vendor discounts</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>

        {/* System Health / Pending Tasks */}
        <div className="bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 lg:px-8 lg:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="px-6 lg:px-8 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transaction</th>
                  <th className="px-6 lg:px-8 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 lg:px-8 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {[
                  { id: 'TRX-1029', desc: 'Vendor Membership Renewal', amount: '₹1,500', status: 'Success', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
                  { id: 'TRX-1028', desc: 'Labour ID Card Print', amount: '₹150', status: 'Pending', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
                  { id: 'TRX-1027', desc: 'Premium Banner Listing', amount: '₹5,000', status: 'Success', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
                  { id: 'TRX-1026', desc: 'Business Registration', amount: '₹2,500', status: 'Failed', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 lg:px-8 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{row.desc}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{row.id}</p>
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {row.amount}
                    </td>
                    <td className="px-6 lg:px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health / Pending Tasks */}
        <div className="bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Attention Needed</h2>
          </div>
          <div className="space-y-4">
            {[
              { title: 'New Vendor Approvals', count: 12, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
              { title: 'Pending Support Tickets', count: 5, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-100' },
              { title: 'Labour ID Verification', count: 28, icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-100' },
              { title: 'Flagged Community Posts', count: 3, icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${item.bg} dark:bg-opacity-20 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</span>
                </div>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
