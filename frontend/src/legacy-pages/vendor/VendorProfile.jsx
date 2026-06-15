import { useState } from 'react';
import { updateVendor } from '../../services/vendorService';

export default function VendorProfile() {
  const [form, setForm] = useState({ id: '', businessName: '', description: '', contactNumber: '', address: '' });

  const save = async () => {
    await updateVendor(form.id, form);
    alert('Profile updated');
  };

  return (
    <div className="max-w-3xl card p-6 space-y-3">
      <h1 className="text-2xl font-bold">Vendor Profile</h1>
      <input className="border rounded px-3 py-2" placeholder="Vendor ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="Business Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
      <textarea className="border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}
