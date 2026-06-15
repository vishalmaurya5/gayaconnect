'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLabourers() {
  const [labourers, setLabourers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
        return;
      }
      fetchLabourers();
    }
  }, [user, authLoading, router]);

  const fetchLabourers = async () => {
    try {
      const res = await fetch('/api/labourers?all=true&limit=50');
      const data = await res.json();
      if (data.success) setLabourers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/labourers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setLabourers(labourers.map(l => l._id === id ? { ...l, isVerified: !currentStatus } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLabourer = async (id) => {
    if (!window.confirm('Delete this profile?')) return;
    try {
      const res = await fetch(`/api/labourers/${id}`, { method: 'DELETE' });
      if (res.ok) setLabourers(labourers.filter(l => l._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) return <div className="p-6 text-slate-600 font-medium">Loading...</div>;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Manage Labourers</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {labourers.map((l) => (
              <tr key={l._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">{l.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{l.skill}</td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{l.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${l.isVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {l.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                  <button 
                    onClick={() => toggleVerification(l._id, l.isVerified)}
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                  >
                    {l.isVerified ? 'Revoke' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => deleteLabourer(l._id)}
                    className="text-red-600 hover:text-red-900 font-semibold ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
