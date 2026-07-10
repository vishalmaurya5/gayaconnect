import React from "react";
import Link from "next/link";
import { FileText, AlertTriangle, Users, Car, Gavel } from "lucide-react";

export const metadata = {
  title: "Terms of Use | Gaya Seva",
  description: "Terms and conditions for using the Gaya Seva platform.",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Sora',sans-serif] mb-6">
            Terms of Use
          </h1>
          <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto">
            By accessing and using Gaya Seva, you agree to be bound by these terms. Please read them carefully.
          </p>
          <p className="mt-4 text-sm text-slate-400">Last Updated: June 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-12">
          
          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-indigo-600" /> Platform Role & Limitations
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>Gaya Seva is strictly an <strong>online directory and lead-generation platform</strong> designed to connect local users with businesses, daily labourers, and vehicle owners in the Gaya district.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not directly provide any services, labour, or vehicle rentals.</li>
                <li>We do not guarantee the quality, safety, or legality of the services advertised by vendors or labourers.</li>
                <li>Any agreement, transaction, or dispute arising between a user and a vendor/labourer is strictly between those two parties.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Car className="w-6 h-6 text-indigo-600" /> Commercial Vehicle Listings
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed bg-orange-50 border border-orange-100 p-5 rounded-xl">
              <p className="font-semibold text-orange-900">Specific Terms for Vehicle Owners and Renters:</p>
              <ul className="list-disc pl-5 space-y-2 text-orange-800">
                <li>By listing a vehicle, the owner confirms that the vehicle is licensed for commercial use and holds valid commercial insurance.</li>
                <li>Gaya Seva holds <strong>NO LIABILITY</strong> for any accidents, damages, theft, or legal disputes that occur during a vehicle rental period.</li>
                <li>Renters are strongly advised to verify the vehicle's condition, papers, and the owner's identity before making any offline payments or signing agreements.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-indigo-600" /> Payments & Subscriptions
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>Gaya Seva offers paid features including monthly subscriptions, vendor registration fees, and banner advertisements.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Refund Policy:</strong> All digital payments (Subscriptions, Banners, Vehicle Listings, Vendor Registrations) made on the platform are <strong>non-refundable</strong> unless required by law.</li>
                <li>Pricing for platform services is dynamic and subject to change at the discretion of the platform administration. Active subscriptions will honor the price paid at the time of purchase until expiration.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Gavel className="w-6 h-6 text-indigo-600" /> User Conduct & Account Termination
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>You agree not to use the platform to post false information, scam other users, or distribute illegal content.</p>
              <p>Gaya Seva reserves the right to suspend, disable, or permanently delete any user, vendor, or worker account at its sole discretion if it violates these Terms of Use, receives excessive negative feedback, or is suspected of fraudulent activity.</p>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Acceptance of Terms</h3>
            <p className="text-indigo-800/80 text-sm leading-relaxed">
              By creating an account and utilizing our platform's services, you signify your irrevocable acceptance of these Terms. If you do not agree, please discontinue using the platform.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
