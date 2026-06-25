'use client';

import { useState, useEffect } from 'react';
import { 
  FiUsers, FiShoppingBag, FiTool, FiTag, 
  FiImage, FiDollarSign, FiUserPlus, FiAlertCircle, FiBriefcase
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Using the overview API which has the rich Recharts data
      const res = await fetch('/api/admin/overview');
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
        <div className="h-8 bg-slate-200 rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
        </div>
        <div className="h-80 bg-slate-200 rounded-xl mt-8"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.stats?.users, icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Vendors', value: data?.stats?.vendors, icon: FiShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Labour', value: data?.stats?.labourers, icon: FiTool, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Jobs & Sales', value: data?.stats?.jobs, icon: FiBriefcase, color: 'text-teal-600', bg: 'bg-teal-100' },
    { label: 'Active Offers', value: data?.stats?.activeOffers, icon: FiTag, color: 'text-pink-600', bg: 'bg-pink-100' },
    { label: 'Active Banners', value: data?.stats?.activeBanners, icon: FiImage, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Revenue (Total)', value: `₹${data?.stats?.revenue}`, icon: FiDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Vendors', value: data?.stats?.pendingVendors, icon: FiAlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const chartData = {
    labels: data?.analytics?.graphData?.map(d => d.name) || [],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data?.analytics?.graphData?.map(d => d.revenue) || [],
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0' },
        ticks: { font: { size: 13, weight: '600' }, color: '#64748b', callback: (val) => `₹${val}` },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 13, weight: '600' }, color: '#64748b' },
        border: { display: false }
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5 hover:shadow-md transition">
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="text-2xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-8">Revenue Analytics (Last 7 Days)</h2>
        <div className="h-96 w-full relative">
          {data?.analytics?.graphData?.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 font-medium">No revenue data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
