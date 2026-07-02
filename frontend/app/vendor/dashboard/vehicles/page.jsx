'use client';

import { useEffect, useState } from 'react';
import { FiTruck, FiPlus, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import Script from 'next/script';

export default function VendorVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postingVeh, setPostingVeh] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const { user } = useAuth();
  
  const [vehForm, setVehForm] = useState({ 
    categoryId: '',
    vehicleName: '', 
    vehicleModel: '', 
    vehicleNumber: '', 
    dlNumber: '', 
    isCommercial: true, 
    liabilityAccepted: false 
  });

  useEffect(() => {
    if (user?.id) {
      fetchVehicles();
      fetchCategories();
    }
  }, [user?.id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`/api/vehicles?ownerId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomCategory = async () => {
    if (!customCategoryName.trim()) return toast.error('Category name required');
    setAddingCategory(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customCategoryName,
          created_by: user.id,
          created_by_role: user.role
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || 'Category added');
        
        // Add to list if not already there, sort alphabetically
        let newCategories = [...categories];
        if (!newCategories.find(c => c._id === data.category._id)) {
          newCategories.push(data.category);
          newCategories.sort((a, b) => a.name.localeCompare(b.name));
        }
        setCategories(newCategories);
        setVehForm({ ...vehForm, categoryId: data.category._id });
        setIsCustomCategory(false);
        setCustomCategoryName('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setAddingCategory(false);
    }
  };

  const handlePostVehicle = async (e) => {
    e.preventDefault();
    if (!vehForm.categoryId) return toast.error("Please select a category.");
    if (!vehForm.liabilityAccepted) return toast.error("You must accept liability for commercial vehicle usage.");
    setPostingVeh(true);
    try {
      const res = await fetch("/api/vehicles/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vehForm,
          ownerId: user.id,
          ownerName: user.name,
          phone: user.phone
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Gaya Connect",
        description: "Vehicle Listing Fee",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/vehicles/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                vehicleId: data.vehicleId
              })
            });
            if (verifyRes.ok) {
              toast.success("Vehicle posted successfully! Pending admin approval.");
              setVehForm({ categoryId: '', vehicleName: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', isCommercial: true, liabilityAccepted: false });
              fetchVehicles();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Verification error");
          }
        },
        theme: { color: "#ea580c" }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        toast.error("Payment failed");
      });
      rzp.open();
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setPostingVeh(false);
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'booked' : 'available';
    try {
      const res = await fetch(`/api/vehicles/${id}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability_status: newStatus })
      });
      const data = await res.json().catch(() => null);
      
      if (res.ok && data?.success) {
        toast.success(`Vehicle marked as ${newStatus}`);
        setVehicles(vehicles.map(v => v._id === id ? { ...v, availability_status: newStatus } : v));
      } else {
        toast.error(data?.message || data?.error || `Failed: HTTP ${res.status}`);
        console.error('Toggle Error:', data);
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error. Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Vehicle deleted successfully');
        setVehicles(vehicles.filter(v => v._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete vehicle');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <FiTruck className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Commercial Vehicles</h1>
              <p className="text-slate-500">Post your commercial vehicles for rent directly on the marketplace.</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
            {/* Post Form */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FiPlus /> Post Vehicle for Rent
              </h2>
              <form onSubmit={handlePostVehicle} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                  {!isCustomCategory ? (
                    <select required value={vehForm.categoryId} onChange={(e) => {
                      if (e.target.value === 'ADD_NEW') {
                        setIsCustomCategory(true);
                      } else {
                        setVehForm({...vehForm, categoryId: e.target.value});
                      }
                    }} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="">Select a category...</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} {c.approved ? '' : '(Pending Review)'}
                        </option>
                      ))}
                      <option value="ADD_NEW" className="font-bold text-orange-600">➕ Add New Category</option>
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" value={customCategoryName} onChange={e => setCustomCategoryName(e.target.value)} placeholder="Type new category name..." className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                      <button type="button" onClick={handleAddCustomCategory} disabled={addingCategory} className="bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold disabled:opacity-70 shrink-0">
                        {addingCategory ? 'Adding...' : 'Add'}
                      </button>
                      <button type="button" onClick={() => setIsCustomCategory(false)} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold shrink-0 hover:bg-slate-300 transition">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Name</label>
                  <input required type="text" value={vehForm.vehicleName} onChange={e => setVehForm({...vehForm, vehicleName: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="e.g. Maruti Swift Dzire" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Model / Year</label>
                  <input required type="text" value={vehForm.vehicleModel} onChange={e => setVehForm({...vehForm, vehicleModel: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="e.g. 2021 VXI" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Number</label>
                  <input required type="text" value={vehForm.vehicleNumber} onChange={e => setVehForm({...vehForm, vehicleNumber: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="e.g. BR 02 XX 1234" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Driving License No.</label>
                  <input required type="text" value={vehForm.dlNumber} onChange={e => setVehForm({...vehForm, dlNumber: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="e.g. BR02XXXXXXXXX" />
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input required type="checkbox" checked={vehForm.liabilityAccepted} onChange={e => setVehForm({...vehForm, liabilityAccepted: e.target.checked})} className="mt-1" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      <strong>Terms & Conditions:</strong> I confirm this is a commercial vehicle. I assume all liabilities, risks, and responsibilities associated with renting out this vehicle. Gaya Connect is only a listing platform.
                    </div>
                  </label>
                </div>

                <button type="submit" disabled={postingVeh} className="w-full rounded-xl bg-orange-600 py-3 text-sm font-bold text-white transition hover:bg-orange-700 disabled:opacity-70 flex justify-center items-center gap-2">
                  <FiTruck size={18} /> {postingVeh ? 'Processing...' : 'Pay ₹200 & Post Vehicle'}
                </button>
              </form>
            </div>

            {/* Listings */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Your Posted Vehicles</h2>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-24 bg-white rounded-xl border border-slate-200"></div>
                  <div className="h-24 bg-white rounded-xl border border-slate-200"></div>
                </div>
              ) : vehicles.length > 0 ? (
                <div className="space-y-4">
                  {vehicles.map(v => (
                    <div key={v._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between gap-4 transition hover:shadow-md">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                            v.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                            v.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {v.status}
                          </span>
                          <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{v.vehicleName} <span className="font-normal text-slate-500">({v.vehicleModel})</span></h3>
                        <p className="text-sm font-mono text-slate-600 mt-1">{v.vehicleNumber}</p>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${(!v.availability_status || v.availability_status === 'available') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`}></div>
                             <span className={`text-sm font-bold ${(!v.availability_status || v.availability_status === 'available') ? 'text-emerald-700' : 'text-slate-500'}`}>
                               {(!v.availability_status || v.availability_status === 'available') ? 'Available for Rent' : 'Currently Booked'}
                             </span>
                           </div>
                           <button 
                             onClick={() => handleToggleAvailability(v._id, v.availability_status || 'available')}
                             className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${(!v.availability_status || v.availability_status === 'available') ? 'bg-emerald-500' : 'bg-slate-300'}`}
                             role="switch"
                             aria-checked={!v.availability_status || v.availability_status === 'available'}
                           >
                             <span className="sr-only">Toggle availability</span>
                             <span className={`pointer-events-none absolute left-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(!v.availability_status || v.availability_status === 'available') ? 'translate-x-5' : 'translate-x-0'}`} />
                           </button>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                        <button onClick={() => handleDelete(v._id)} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2 sm:px-3 sm:py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 h-fit">
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                  <FiAlertCircle className="mx-auto text-4xl text-slate-300" />
                  <h3 className="mt-4 font-bold text-slate-900 text-lg">No Vehicles Posted</h3>
                  <p className="mt-1 text-slate-500">Rent out your commercial vehicles by posting them here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
