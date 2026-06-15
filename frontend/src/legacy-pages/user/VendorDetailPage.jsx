import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { loadVendorDetail } from '../../store/slices/vendorSlice';
import VendorMap from '../../components/vendor/VendorMap';
import VendorReview from '../../components/vendor/VendorReview';

export default function VendorDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const detail = useSelector((s) => s.vendor.detail);

  useEffect(() => { dispatch(loadVendorDetail(slug)); }, [slug, dispatch]);
  if (!detail?.vendor) return <p>Loading vendor...</p>;

  const { vendor, reviews } = detail;

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h1 className="text-2xl font-bold">{vendor.businessName}</h1>
        <p className="text-slate-500">{vendor.description}</p>
        <div className="mt-3 grid md:grid-cols-3 gap-3">
          {(vendor.images?.length ? vendor.images : ['https://placehold.co/600x350']).map((src, i) => <img key={i} src={src} className="rounded h-36 w-full object-cover" />)}
        </div>
        <Link to={`/booking?vendor=${vendor._id}`} className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded">Book Service</Link>
      </div>
      <VendorMap vendors={[vendor]} />
      <div className="card p-5">
        <h2 className="font-semibold mb-3">Reviews</h2>
        {reviews?.map((r) => <VendorReview key={r._id} review={r} />)}
      </div>
    </div>
  );
}
