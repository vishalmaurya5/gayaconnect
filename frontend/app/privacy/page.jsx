import React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, Database, Globe } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Gaya Connect",
  description: "Privacy Policy and data protection guidelines for Gaya Connect.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold font-['Sora',sans-serif] mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-indigo-200/80 max-w-2xl mx-auto">
            Your privacy is critically important to us. This policy outlines how Gaya Connect collects, uses, and protects your personal information.
          </p>
          <p className="mt-4 text-sm text-slate-400">Last Updated: June 2026</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-12">
          
          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-indigo-600" /> Information We Collect
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account Data:</strong> Name, phone number, email address, and password (hashed).</li>
                <li><strong>Vendor & Workforce Data:</strong> Business name, category, skills, location/address, and daily rates for directory listings.</li>
                <li><strong>Vehicle Data:</strong> Vehicle details and driving license numbers (stored securely) for verification purposes.</li>
                <li><strong>Payment Data:</strong> We use Razorpay for payment processing. We do not store your credit card or UPI PIN details. We only store payment status and transaction IDs.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-indigo-600" /> How We Use Information
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Provide, operate, and maintain our directory platform.</li>
                <li>Improve, personalize, and expand our website features.</li>
                <li>Understand and analyze how you use our platform.</li>
                <li>Process your transactions and manage your premium subscriptions.</li>
                <li>Send you emails or WhatsApp notifications regarding updates, offers, and local news (only if opted-in).</li>
                <li>Find and prevent fraud.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-indigo-600" /> Data Security & Protection
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>Gaya Connect utilizes industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Encryption:</strong> All passwords are securely hashed using bcrypt algorithms before being stored in our database.</li>
                <li><strong>Secure Transmission:</strong> We force HTTPS on all connections ensuring your data is encrypted in transit.</li>
                <li><strong>Access Control:</strong> Administrative access to the platform's backend is strictly monitored and gated by multi-factor authentication and role-based access control.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-['Sora',sans-serif] text-slate-900 mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-indigo-600" /> Third-Party Services
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>We may employ third-party companies and individuals due to the following reasons:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To facilitate our Service (e.g., Razorpay for payment processing).</li>
                <li>To provide the Service on our behalf.</li>
                <li>To perform Service-related services.</li>
                <li>To assist us in analyzing how our Service is used.</li>
              </ul>
              <p>We want to inform our users that these third parties have access to your Personal Information to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.</p>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Contact Us Regarding Privacy</h3>
            <p className="text-indigo-800/80 mb-4 text-sm leading-relaxed">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact our administrative team.
            </p>
            <Link href="/contact" className="inline-block bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
              Contact Support
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
