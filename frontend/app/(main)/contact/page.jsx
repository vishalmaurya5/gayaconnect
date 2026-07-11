import { FiPhone, FiMail, FiMessageCircle, FiMapPin } from 'react-icons/fi';

export const metadata = {
  title: 'Contact Support | Gaya Seva',
  description: 'Contact Gaya Seva support via phone, WhatsApp, or email.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 blur-2xl transform rotate-12 scale-150"></div>
          <h1 className="text-3xl font-extrabold text-white relative z-10">Contact Support</h1>
          <p className="mt-2 text-emerald-100 font-medium relative z-10">We're here to help you with anything related to Gaya Seva.</p>
        </div>
        
        <div className="p-8 sm:p-12 space-y-8">
          
          {/* Phone & WhatsApp */}
          <div className="flex items-start gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl shrink-0">
              <FiPhone className="text-emerald-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Phone & WhatsApp</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">Reach out to us directly for any urgent inquiries or fast support.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href="tel:+919117588242" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl transition-colors">
                  <FiPhone /> +91 9117588242
                </a>
                <a href="tel:+918544491413" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-emerald-50 text-emerald-700 font-bold px-4 py-2 rounded-xl transition-colors">
                  <FiPhone /> +91 8544491413
                </a>
                <a href="https://wa.me/919117588242" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-4 py-2 rounded-xl transition-colors">
                  <FiMessageCircle /> WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          {/* Email Support */}
          <div className="flex items-start gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl shrink-0">
              <FiMail className="text-emerald-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Email Support</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">Drop us an email. We aim to respond to all emails within 24 hours.</p>
              <div className="mt-3 flex flex-col gap-2">
                <a href="mailto:thegayaseva@gmail.com" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                  <span className="w-5 flex justify-center text-slate-400"><FiMail /></span>
                  thegayaseva@gmail.com <span className="text-xs text-slate-400 font-normal ml-2">(Primary)</span>
                </a>
                <a href="mailto:supportgayaseva@gmail.com" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline">
                  <span className="w-5 flex justify-center text-slate-400"><FiMail /></span>
                  supportgayaseva@gmail.com <span className="text-xs text-slate-400 font-normal ml-2">(Alternative)</span>
                </a>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          {/* Location */}
          <div className="flex items-start gap-5">
            <div className="bg-emerald-50 p-4 rounded-2xl shrink-0">
              <FiMapPin className="text-emerald-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Location</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">Gaya, Bihar, India.</p>
              <p className="text-sm text-slate-400 mt-1">Available locally for all service inquiries.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
