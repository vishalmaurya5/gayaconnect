'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle, FiEye } from 'react-icons/fi';

export default function ReviewCenterPage() {
  const [data, setData] = useState({ vendors: [], labourers: [], jobs: [], offers: [] });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const json = await res.json();
      if (json.success) setData(json.data);
      else toast.error('Failed to load review queue');
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, type, action) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, action })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        fetchPendingReviews(); // Refresh list
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error('Action failed');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading review queue...</div>;

  const totalPending = data.vendors.length + data.labourers.length + data.jobs.length + data.offers.length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review Center</h1>
          <p className="text-slate-500 mt-2">Manage pending approvals across the platform.</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <FiClock /> {totalPending} Pending
        </div>
      </div>

      {totalPending === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <FiCheckCircle className="text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">All caught up!</h2>
          <p className="text-slate-500 mt-2">There are no pending applications or listings to review.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Vendors */}
          {data.vendors.length > 0 && (
            <ReviewSection 
              title="Pending Vendors" 
              items={data.vendors} 
              type="vendor" 
              onAction={handleAction} 
              renderItem={(v) => (
                <div>
                  <h3 className="font-bold text-slate-900">{v.name}</h3>
                  <p className="text-sm text-slate-500">{v.category} • {v.address}</p>
                </div>
              )}
            />
          )}

          {/* Labourers */}
          {data.labourers.length > 0 && (
            <ReviewSection 
              title="Pending Local Workforce" 
              items={data.labourers} 
              type="labour" 
              onAction={handleAction} 
              renderItem={(l) => (
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">{l.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{l.role} • {l.district}, {l.state}</p>
                  {l.aadhaarNumber && (
                    <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 inline-flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aadhaar:</span>
                        <span className="font-mono text-slate-800 font-bold">{l.aadhaarNumber}</span>
                      </div>
                      {l.aadhaarImage && (
                        <button 
                          onClick={() => setSelectedImage(l.aadhaarImage)}
                          className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:text-indigo-800 transition"
                        >
                          <FiEye /> View Aadhaar Card
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            />
          )}

          {/* Jobs */}
          {data.jobs.length > 0 && (
            <ReviewSection 
              title="Pending Jobs/Sales" 
              items={data.jobs} 
              type="job" 
              onAction={handleAction} 
              renderItem={(j) => (
                <div>
                  <h3 className="font-bold text-slate-900">{j.title}</h3>
                  <p className="text-sm text-slate-500">By {j.vendorId?.name || 'Admin'} • {j.type}</p>
                </div>
              )}
            />
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full bg-white p-2 rounded-2xl shadow-2xl">
            <img src={selectedImage} alt="Verification Document" className="w-full h-auto max-h-[80vh] object-contain rounded-xl" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white text-slate-900 rounded-full p-2 shadow-lg hover:bg-slate-100 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewSection({ title, items, type, onAction, renderItem }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <FiAlertCircle className="text-amber-500" /> {title}
        </h2>
        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-full">{items.length}</span>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map(item => (
          <div key={item._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
            {renderItem(item)}
            <div className="flex gap-2">
              <button 
                onClick={() => onAction(item._id, type, 'APPROVE')}
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition"
              >
                <FiCheckCircle /> Approve
              </button>
              <button 
                onClick={() => onAction(item._id, type, 'REJECT')}
                className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition"
              >
                <FiXCircle /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
