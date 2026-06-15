'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCreditCard, FiLock, FiMapPin, FiPhone } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [contactAccess, setContactAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const fetchVendor = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/vendors/${params.slug}`);
      const data = await response.json();
      setVendor(data.vendor);
      setContactAccess(data.contactAccess);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.slug) fetchVendor();
  }, [params.slug, user?.hasContactAccess]);

  const unlockContacts = async (provider = 'razorpay') => {
    if (!user) {
      router.push('/login?type=user');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Contact unlock is available for customer accounts');
      return;
    }

    setPaying(true);

    try {
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-use-dummy-razorpay': process.env.NEXT_PUBLIC_USE_REAL_RAZORPAY === 'true' ? 'false' : 'true',
          'x-use-dummy-phonepe': process.env.NEXT_PUBLIC_USE_REAL_PHONEPE === 'true' ? 'false' : 'true',
        },
        body: JSON.stringify({ provider }),
      });
      const orderData = await orderResponse.json();
      if (!orderData.success) throw new Error(orderData.message || 'Could not create payment order');

      if (provider === 'phonepe') {
        const returnTo = encodeURIComponent(`/vendors/${params.slug}`);
        if (orderData.isDummy) {
          router.push(`/dummy-phonepe?orderId=${orderData.order.id}&amount=${orderData.order.amount}&returnTo=${returnTo}`);
          return;
        }

        if (orderData.order.redirectUrl) {
          window.location.href = orderData.order.redirectUrl;
          return;
        }

        throw new Error('PhonePe redirect URL was not returned');
      }

      if (orderData.isDummy) {
        const returnTo = encodeURIComponent(`/vendors/${params.slug}`);
        router.push(`/dummy-razorpay?orderId=${orderData.order.id}&amount=${orderData.order.amount}&returnTo=${returnTo}`);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay checkout could not load');

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Gaya Connect',
        description: 'One year vendor contact access',
        order_id: orderData.order.id,
        handler: async (response) => {
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ provider: 'razorpay', ...response }),
          });
          const verifyData = await verifyResponse.json();

          if (!verifyData.success) {
            toast.error(verifyData.message || 'Payment verification failed');
            return;
          }

          updateUser(verifyData.user);
          toast.success('Vendor contacts unlocked for 1 year');
          await fetchVendor();
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: { color: '#2563eb' },
      });

      checkout.open();
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="container-custom py-8 animate-pulse"><div className="bg-gray-200 h-64 rounded-xl mb-6"></div></div>;
  if (!vendor) return <div className="container-custom py-16 text-center"><p className="text-gray-500">Vendor not found</p><Link href="/vendors" className="text-blue-600 mt-4 inline-block">Back</Link></div>;

  const contactNumber = vendor.phone || vendor.contactNumber;

  return (
    <div className="container-custom py-8">
      <Link href="/vendors" className="text-blue-600 flex items-center gap-1 mb-6"><FiArrowLeft /> Back to Vendors</Link>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold">{vendor.businessName || vendor.name}</h1>
        <p className="text-gray-500 mt-2">{vendor.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-gray-600">
          {vendor.address && <span className="flex items-center gap-1"><FiMapPin />{vendor.address}</span>}
          {contactNumber && <a href={`tel:${contactNumber}`} className="flex items-center gap-1 font-semibold text-green-700"><FiPhone />{contactNumber}</a>}
        </div>
        {!contactNumber && vendor.contactAccessRequired && (
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
                  <FiLock />
                </span>
                <div>
                  <h2 className="font-bold text-slate-950">Unlock all vendor contact numbers</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Pay Rs. {contactAccess?.price || 9} once and access every vendor phone number for one year.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:min-w-44">
                <button
                  type="button"
                  onClick={() => unlockContacts('razorpay')}
                  disabled={paying}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiCreditCard />
                  {paying ? 'Opening...' : 'Pay Rs. 9 with Razorpay'}
                </button>
                <button
                  type="button"
                  onClick={() => unlockContacts('phonepe')}
                  disabled={paying}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-white px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FiCreditCard />
                  PhonePe fallback
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          {(vendor.images?.length ? vendor.images : ['https://placehold.co/600x350']).map((src, i) => (
            <img key={i} src={src} className="rounded h-36 w-full object-cover" alt={vendor.name} />
          ))}
        </div>
      </div>
    </div>
  );
}
