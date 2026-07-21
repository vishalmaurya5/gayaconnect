import { useState, useEffect } from 'react';
import { updateVendorApi, getMyVendorProfileApi } from '../../services/vendorService';
import toast from 'react-hot-toast';
import { QrCode } from 'lucide-react';

export default function VendorProfile() {
  const [vendor, setVendor] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', address: '', city: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyVendorProfileApi();
      setVendor(data);
      setForm({
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        city: data.city || ''
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!vendor) return;
    try {
      await updateVendorApi(vendor._id, form);
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!vendor) return <div className="p-8 text-center text-red-500">No vendor profile found for this account.</div>;

  const profileUrl = `${window.location.origin}/vendors/${vendor.slug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;

  return (
    <div className="max-w-4xl grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 card p-6 space-y-4">
        <h1 className="text-2xl font-bold">Vendor Profile</h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Business Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2 h-24" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input className="w-full border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <button onClick={save} className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg font-medium">Save Changes</button>
        </div>
      </div>

      <div className="card p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl inline-block mb-2">
          <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h2 className="font-bold text-lg">Your QR Code</h2>
          <p className="text-sm text-slate-500 max-w-[200px]">Let customers scan this to rate your business</p>
        </div>
        
        <div className="bg-white p-2 border-2 border-slate-200 rounded-xl shadow-sm">
          <img src={qrCodeUrl} alt="Vendor QR Code" className="w-40 h-40" />
        </div>
        
        <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
          View Public Profile
        </a>
      </div>
    </div>
  );
}
