import { FiMapPin, FiSun, FiBookOpen, FiStar } from "react-icons/fi";

export default function AboutGaya() {
  const highlights = [
    {
      title: "Mahabodhi Temple",
      desc: "The sacred site where Lord Buddha attained enlightenment under the Bodhi Tree.",
      image: "/images/gaya/mahabodhi.png"
    },
    {
      title: "Vishnupad Temple",
      desc: "A major Hindu pilgrimage center on the banks of Falgu river, famous for Pind Daan rituals.",
      image: "/images/gaya/vishnupad.png"
    },
    {
      title: "Sacred Falgu River",
      desc: "The holy river holding deep spiritual significance where thousands come to offer prayers.",
      image: "/images/gaya/falgu_river.png"
    },
    {
      title: "Mangla Gauri Temple",
      desc: "One of the 18 Maha Shaktipeeths, this ancient and highly revered temple is dedicated to Goddess Shakti.",
      image: "/images/gaya/mangla_gauri.png"
    }
  ];

  return (
    <section className="bg-transparent py-24 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Text Content */}
          <div className="lg:w-5/12 lg:sticky lg:top-32">
            <div className="text-orange-500 text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-orange-500 rounded-full"></span> The Holy City
            </div>
            <h2 className="font-sora text-3xl md:text-4xl lg:text-5xl font-[800] text-[#0F172A] tracking-tight leading-tight mb-6">
              Discover Gaya Ji <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
                Land of Salvation & Enlightenment
              </span>
            </h2>
            <p className="text-slate-500 text-[16px] leading-relaxed mb-8">
              Gaya is a city of profound spiritual and historical significance, revered by both Hindus and Buddhists worldwide. From the serene grounds of the Mahabodhi Temple in Bodh Gaya to the ancient Vishnupad Temple, the city draws millions seeking peace, salvation, and spiritual awakening. Gaya Connect proudly brings the services of this holy city to your fingertips.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-orange-50 text-orange-700 font-semibold text-sm rounded-full border border-orange-100">#PindDaan</span>
              <span className="px-4 py-2 bg-amber-50 text-amber-700 font-semibold text-sm rounded-full border border-amber-100">#Enlightenment</span>
              <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-full border border-indigo-100">#Heritage</span>
              <span className="px-4 py-2 bg-rose-50 text-rose-700 font-semibold text-sm rounded-full border border-rose-100">#Tilkut</span>
            </div>
          </div>

          {/* Right Grid Highlights */}
          <div className="lg:w-7/12 w-full grid sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300 group flex flex-col">
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <h4 className="absolute bottom-4 left-5 z-20 text-white font-bold text-[18px] font-sora drop-shadow-md">{item.title}</h4>
                </div>
                <div className="p-6 flex-1 flex items-center">
                  <p className="text-slate-500 text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
