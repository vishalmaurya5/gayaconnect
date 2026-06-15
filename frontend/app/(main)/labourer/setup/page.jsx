'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LabourerSetup() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skill: 'Helper',
    dailyRate: '',
    address: '',
    lat: '',
    lng: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/labourer/setup');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location fetched!');
        },
        () => toast.error('Could not get location. Please enter manually.')
      );
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        skill: formData.skill,
        dailyRate: Number(formData.dailyRate) || 0,
        location: {
          address: formData.address,
          lat: Number(formData.lat) || 0,
          lng: Number(formData.lng) || 0
        }
      };

      const res = await fetch('/api/labourers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        toast.success('Profile created successfully!');
        setTimeout(() => router.push('/'), 2000);
      } else {
        toast.error(data.error || 'Failed to create profile');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="mt-20 text-center font-medium">Loading...</div>;

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-28 p-8 bg-white rounded-xl shadow-md text-center border border-slate-100">
        <h2 className="text-2xl font-bold text-green-600 mb-3">Profile Created!</h2>
        <p className="text-slate-600 font-medium">Your profile is pending admin approval and will be public once verified.</p>
        <p className="text-sm text-slate-500 mt-6">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-28 p-8 bg-white rounded-xl shadow-md mb-10 border border-slate-100">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Labourer Profile Setup</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Full Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Phone Number (10 digits)</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Skill / Category</label>
          <select required name="skill" value={formData.skill} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
            <option value="Helper">Helper</option>
            <option value="Mason">Mason</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Painter">Painter</option>
            <option value="Mechanic">Mechanic</option>
            <option value="Cleaner">Cleaner</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Expected Daily Wage (₹)</label>
          <input type="number" name="dailyRate" value={formData.dailyRate} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-700">Location Address</label>
          <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-slate-700">Latitude</label>
            <input readOnly type="text" name="lat" value={formData.lat} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-slate-700">Longitude</label>
            <input readOnly type="text" name="lng" value={formData.lng} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-500" />
          </div>
          <button type="button" onClick={getLocation} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition shadow-sm">
            Get GPS
          </button>
        </div>

        <button disabled={loading} type="submit" className="w-full mt-6 py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition shadow-sm">
          {loading ? 'Saving...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
}
