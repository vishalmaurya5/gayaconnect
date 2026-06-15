import { useEffect, useState } from 'react';
import { fetchActiveBanners } from '../../services/bannerService';
import { fetchVendors } from '../../services/vendorService';
import VendorCard from '../../components/vendor/VendorCard';
import VendorMap from '../../components/vendor/VendorMap';
import Loader from '../../components/common/Loader';

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [b, v] = await Promise.all([fetchActiveBanners(), fetchVendors({ limit: 6, sort: '-ratingAvg' })]);
        setBanners(b);
        setVendors(v.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold">Find Trusted Local Services in Gaya</h1>
        <p className="mt-2 text-blue-100">Search, book, and connect with verified local businesses.</p>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <img key={banner._id} src={banner.imageUrl} alt={banner.title} className="rounded-xl h-44 w-full object-cover" />
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Premium Vendors</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => <VendorCard key={vendor._id} vendor={vendor} />)}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Explore on Map</h2>
        <VendorMap vendors={vendors} />
      </section>
    </div>
  );
}
