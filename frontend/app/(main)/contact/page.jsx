import { FiPhone, FiMail, FiMessageCircle, FiMapPin, FiGlobe, FiInstagram, FiFacebook } from 'react-icons/fi';

export const metadata = {
  title: 'Global Support & Contact | Gaya Seva',
  description: 'Connect with the Gaya Seva global support team for inquiries, business partnerships, and assistance.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05080f] py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#0B0F19] rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        
        {/* Premium Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 dark:opacity-10 blur-3xl transform -rotate-12 scale-150"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>
          
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/20 shadow-xl">
            <FiGlobe className="text-white text-3xl" />
          </div>
          
          <h1 className="text-4xl font-extrabold text-white relative z-10 tracking-tight">Global Support Center</h1>
          <p className="mt-3 text-indigo-100 font-medium relative z-10 max-w-lg mx-auto text-lg">
            Whether you're a business partner or a consumer, our enterprise support team is available 24/7 to assist you.
          </p>
        </div>
        
        {/* About Gaya Seva */}
        <div className="px-8 sm:px-12 pt-10 pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <FiGlobe className="text-indigo-500" /> About Gaya Seva
          </h2>
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 text-[15px]">
            <p>
              Gaya Seva is a premier digital marketplace and service platform dedicated to bridging the gap between consumers, skilled professionals, and local businesses in the Gaya region and beyond. Our enterprise-grade infrastructure provides a seamless, secure, and intuitive ecosystem for a wide array of services. Whether you are looking for a verified local workforce (Labourers) for construction and daily wage work, professional Vendors ranging from electronics repair to catering, or reliable Vehicle rentals for transport and logistics, Gaya Seva is your one-stop solution.
            </p>
            <p>
              Beyond connecting you with local service providers, Gaya Seva also hosts a vibrant Jobs & Marketplace section. Employers can discover top local talent, while job seekers can easily find and apply for exciting opportunities in their area. Additionally, our Buy & Sell Marketplace allows users to securely trade goods, discover real estate listings, and purchase unique local products directly from trusted members of the community. 
            </p>
            <p>
              Our mission is to empower the local economy by providing digital tools that foster transparency, efficiency, and trust. Every provider on our platform is carefully verified to ensure quality and safety. Welcome to Gaya Seva—empowering connections, driving growth, and delivering excellence every single day.
            </p>
          </div>
        </div>
        
        <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Phone & WhatsApp */}
          <div className="space-y-6">
            <div className="flex items-start gap-5">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                <FiPhone className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Direct Lines</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed text-sm">Priority routing for urgent inquiries and enterprise partners.</p>
                <div className="mt-4 flex flex-col gap-3">
                  <a href="tel:+919117588242" className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 font-semibold px-4 py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30">
                    <FiPhone className="text-indigo-500" /> +91 9117588242
                  </a>
                  <a href="tel:+918544491413" className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 font-semibold px-4 py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/30">
                    <FiPhone className="text-indigo-500" /> +91 8544491413
                  </a>
                  <a href="https://wa.me/919117588242" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-1">
                    <FiMessageCircle /> Connect on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Email Support */}
            <div className="flex items-start gap-5">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                <FiMail className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Email Communications</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed text-sm">Guaranteed response within 24 hours.</p>
                <div className="mt-4 flex flex-col gap-3">
                  <a href="mailto:thegayaseva@gmail.com" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <span className="w-5 flex justify-center text-indigo-400 dark:text-indigo-500"><FiMail /></span>
                    thegayaseva@gmail.com
                  </a>
                  <a href="mailto:supportgayaseva@gmail.com" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    <span className="w-5 flex justify-center text-indigo-400 dark:text-indigo-500"><FiMail /></span>
                    supportgayaseva@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

            {/* Location */}
            <div className="flex items-start gap-5">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                <FiMapPin className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Global Operations</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">Headquarters</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Gaya, Bihar 832003
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Our digital infrastructure operates globally, seamlessly connecting consumers and service providers across regions.
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

            {/* Social Media */}
            <div className="flex items-start gap-5">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl shrink-0 border border-indigo-100 dark:border-indigo-500/20">
                <FiGlobe className="text-indigo-600 dark:text-indigo-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Social Connect</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed text-sm">Follow us for updates and exclusive offers.</p>
                <div className="mt-4 flex flex-row gap-3">
                  <a href="https://www.instagram.com/thegayaseva" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-bold p-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105">
                    <FiInstagram className="text-xl" />
                  </a>
                  <a href="https://www.facebook.com/profile.php?id=61591230812726" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#1877F2] text-white font-bold p-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105">
                    <FiFacebook className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Footer Area of Modal */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            © {new Date().getFullYear()} Gaya Seva Enterprise Platforms. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
