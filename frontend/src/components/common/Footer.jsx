import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <h3 className="font-semibold">Gaya Seva</h3>
          <p className="text-slate-500">Your digital city platform for trusted local services.</p>
        </div>
        <div className="space-y-2">
          <a href="#" className="block">About</a>
          <a href="#" className="block">Privacy</a>
          <a href="#" className="block">Terms</a>
        </div>
        <div className="flex gap-4 items-center">
          <FaFacebook /> <FaInstagram /> <FaLinkedin />
        </div>
      </div>
    </footer>
  );
}
