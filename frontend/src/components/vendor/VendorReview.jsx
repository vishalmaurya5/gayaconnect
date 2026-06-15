export default function VendorReview({ review }) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 py-3">
      <p className="font-medium">{review.user?.name}</p>
      <p className="text-sm text-slate-500">? {review.rating} / 5</p>
      <p className="text-sm">{review.comment}</p>
    </div>
  );
}
