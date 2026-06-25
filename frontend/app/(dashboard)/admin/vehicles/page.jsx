'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiTrash2, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchVehicles(filter);
  }, [filter]);

  const fetchVehicles = async (f) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/vehicles?filter=${f}`);
      const data = await res.json();
      if (data.success) {
        setVehicles(data.vehicles || []);
      }
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Vehicle ${status}`);
        setVehicles(vehicles.map(v => v._id === id ? { ...v, status } : v));
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating vehicle status');
    }
  };

  const deleteVehicle = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle listing?')) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Vehicle deleted');
        setVehicles(vehicles.filter(v => v._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Vehicle Management</h1>
      </div>

      <div className="flex gap-2 flex-wrap pb-2 border-b border-slate-200">
        {[
          { id: 'all', label: 'All Vehicles' },
          { id: 'pending', label: 'Pending Approval' },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setFilter(tab.id)} 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === tab.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Vehicle Details</th>
                  <th className="px-6 py-4">Owner Info</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {vehicles.map(vehicle => (
                  <tr key={vehicle._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="p-1.5 bg-blue-100 text-blue-600 rounded-md"><FiTruck /></span>
                        {vehicle.vehicleName}
                      </div>
                      <div className="text-slate-500 text-xs mt-1">Model: {vehicle.vehicleModel}</div>
                      <div className="text-slate-500 text-xs">Number: {vehicle.vehicleNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{vehicle.ownerName}</div>
                      <div className="text-xs text-slate-500">{vehicle.phone}</div>
                      {vehicle.dlNumber && <div className="text-xs text-slate-400 mt-1">DL: {vehicle.dlNumber}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.paymentStatus === 'completed' ? (
                        <span className="inline-flex items-center text-emerald-600 font-semibold text-xs">Paid</span>
                      ) : (
                        <span className="inline-flex items-center text-amber-600 font-semibold text-xs">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {vehicle.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs bg-emerald-100 px-2 py-1 rounded">
                          <FiCheckCircle /> Approved
                        </span>
                      ) : vehicle.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-xs bg-red-100 px-2 py-1 rounded">
                          <FiXCircle /> Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-xs bg-amber-100 px-2 py-1 rounded">
                          <FiCheckCircle /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                      {vehicle.status !== 'approved' && (
                        <button 
                          onClick={() => toggleApproval(vehicle._id, 'approved')} 
                          className="px-3 py-1.5 rounded-lg font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition"
                        >
                          Approve
                        </button>
                      )}
                      {vehicle.status !== 'rejected' && (
                        <button 
                          onClick={() => toggleApproval(vehicle._id, 'rejected')} 
                          className="px-3 py-1.5 rounded-lg font-semibold text-red-700 bg-red-100 hover:bg-red-200 transition"
                        >
                          Reject
                        </button>
                      )}
                      <button onClick={() => deleteVehicle(vehicle._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                        <FiTrash2 className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 && (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">No vehicles found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
