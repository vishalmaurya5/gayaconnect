export default function BannerManager({ banners = [] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {banners.map((banner) => (
        <div key={banner._id} className="card p-3">
          <img src={banner.imageUrl} className="h-32 w-full object-cover rounded" />
          <p className="font-medium mt-2">{banner.title}</p>
        </div>
      ))}
    </div>
  );
}
