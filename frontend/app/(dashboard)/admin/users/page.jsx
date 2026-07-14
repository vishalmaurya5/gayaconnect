'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { register: regCreate, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm({
    defaultValues: { name: '', email: '', phone: '', password: '' }
  });

  const { register: regEdit, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm();

  const openEditModal = (user) => {
    setEditingUser(user);
    resetEdit({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'user',
      subscriptionActive: !!user.subscriptionActive ? 'true' : 'false',
      subscriptionExpiry: user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toISOString().split('T')[0] : ''
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      const payload = { ...data, subscriptionActive: data.subscriptionActive === 'true' };
      if (!payload.password) delete payload.password; // Don't send blank password

      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await res.json();
      if (resData.success) {
        toast.success('User updated successfully');
        setUsers(users.map(u => u._id === editingUser._id ? resData.user : u));
        closeEditModal();
      } else {
        toast.error(resData.message || 'Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUsers(filter, search);
  }, [filter, search]);

  const fetchUsers = async (f, s) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?filter=${f}&search=${s}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('User deleted');
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const extendSub = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extendSubscriptionDays: 30 })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Subscription extended by 30 days');
        setUsers(users.map(u => u._id === id ? data.user : u));
      } else {
        toast.error(data.message || 'Failed to extend');
      }
    } catch (error) {
      toast.error('Error extending subscription');
    }
  };

  const restoreUser = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: false })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User restored successfully');
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error(data.message || 'Failed to restore');
      }
    } catch (error) {
      toast.error('Error restoring user');
    }
  };

  const onCreate = async (data) => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user', ...data })
      });
      const json = await res.json();
      if (json.success) {
        toast.success('User created successfully');
        resetCreate();
        fetchUsers(filter, search);
      } else {
        toast.error(json.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Error creating user');
    } finally {
      setCreating(false);
    }
  };

  const isSubscribed = (u) => u.subscriptionActive && u.subscriptionExpiry && new Date(u.subscriptionExpiry) > new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search name, email, phone, Aadhaar..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full sm:w-80 rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Add New User</h2>
        <form onSubmit={handleCreateSubmit(onCreate)} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
            <input {...regCreate('name', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input {...regCreate('email', { required: true })} type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
            <input {...regCreate('phone', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Temporary Password</label>
            <input {...regCreate('password', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <button type="submit" disabled={creating} className="sm:col-span-2 md:col-span-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {creating ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>All Users</button>
        <button onClick={() => setFilter('subscribed')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === 'subscribed' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Subscribed</button>
        <button onClick={() => setFilter('unsubscribed')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === 'unsubscribed' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>Unsubscribed</button>
        <button onClick={() => setFilter('deleted')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === 'deleted' ? 'bg-red-600 text-white' : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'}`}>Deleted Accounts</button>
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
                  <th className="px-6 py-4">Name / Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map(user => {
                  const active = isSubscribed(user);
                  return (
                    <tr key={user._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-slate-500">{user.email}</div>
                        <div className="text-slate-500 text-xs">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        {user.isDeleted ? (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded font-semibold text-xs">
                            <FiTrash2 /> Deleted
                          </span>
                        ) : active ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-100 px-2 py-1 rounded font-semibold text-xs mb-1">
                              <FiCheckCircle /> Active
                            </span>
                            <div className="text-xs text-slate-500">Exp: {new Date(user.subscriptionExpiry).toLocaleDateString()}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded font-semibold text-xs">
                            <FiXCircle /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                        <button onClick={() => openEditModal(user)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition inline-flex items-center gap-1" title="Edit Full Profile">
                          <FiEdit2 /> Edit
                        </button>
                        {!user.isDeleted ? (
                          <button onClick={() => extendSub(user._id)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition inline-flex items-center gap-1" title="Extend 30 Days">
                            <FiClock /> +30 Days
                          </button>
                        ) : (
                          <button onClick={() => restoreUser(user._id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-semibold hover:bg-emerald-100 transition inline-flex items-center gap-1" title="Restore Account">
                            <FiCheckCircle /> Restore
                          </button>
                        )}
                        <button onClick={() => deleteUser(user._id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title={user.isDeleted ? "Permanently Delete" : "Delete"}>
                          <FiTrash2 className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {users.length === 0 && (
                  <tr><td colSpan="4" className="p-8 text-center text-slate-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Edit User Profile</h3>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600"><FiX className="text-xl" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="editUserForm" onSubmit={handleEditSubmit(onUpdate)} className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                  <input {...regEdit('name', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input {...regEdit('email', { required: true })} type="email" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone</label>
                  <input {...regEdit('phone', { required: true })} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">New Password <span className="text-slate-400 font-normal">(Leave blank to keep)</span></label>
                  <input {...regEdit('password')} type="text" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                  <select {...regEdit('role', { required: true })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="sm:col-span-2 border-t border-slate-100 pt-5 mt-2">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Subscription Details</h4>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Subscription Active</label>
                      <select {...regEdit('subscriptionActive')} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date</label>
                      <input {...regEdit('subscriptionExpiry')} type="date" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={closeEditModal} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition">Cancel</button>
              <button type="submit" form="editUserForm" disabled={updating} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50">
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
