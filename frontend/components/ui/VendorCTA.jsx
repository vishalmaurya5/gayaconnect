export default function VendorCTA() {
  return (
    <div className="relative bg-slate-900 rounded-2xl mx-5 md:mx-10 py-10 md:py-14 px-6 md:px-12 overflow-hidden my-12">
      <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="text-teal-300 text-xs font-bold uppercase tracking-wider">For businesses</div>
          <h2 className="font-sora text-2xl md:text-3xl font-bold text-white mt-2">List your business.<br />Reach all of Gaya district.</h2>
          <p className="text-white/50 text-sm mt-2 max-w-md">Free registration. Thousands of local customers already browsing. Post offers, manage your listing, and grow your business.</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-white/20 text-white/80 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-white/10">Learn more</button>
          <button className="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">Register as vendor — Free</button>
        </div>
      </div>
    </div>
  );
}
