// app/offers/new/page.jsx — Vendor: Post new offer
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tag, Clock, IndianRupee, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PLANS = [
  { key:"7days",   label:"7 Days",   price:39,  desc:"Short-term promotion",    popular:false, color:"border-gray-200"   },
  { key:"30days",  label:"30 Days",  price:199, desc:"Best for monthly deals",   popular:true,  color:"border-indigo-500 ring-2 ring-indigo-500" },
  { key:"365days", label:"1 Year",   price:399, desc:"Maximum reach & value",    popular:false, color:"border-teal-400"   },
];

export default function NewOfferPage() {
  const router = useRouter();
  const [step, setStep]     = useState(1); // 1 = form, 2 = plan, 3 = confirm
  const [form, setForm]     = useState({ title:"", description:"", discount:"", category:"", terms:"" });
  const [plan, setPlan]     = useState("30days");
  const [errors, setErrors] = useState({});
  const [dynamicPrices, setDynamicPrices] = useState({
    "7days": 39, "30days": 199, "365days": 399
  });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success && d.pricing) {
        setDynamicPrices({
          "7days": d.pricing.offer7Days || 39,
          "30days": d.pricing.offer30Days || 199,
          "365days": d.pricing.offer365Days || 399
        });
      }
    }).catch(console.error);
  }, []);

  const currentPlans = PLANS.map(p => ({ ...p, price: dynamicPrices[p.key] }));
  const selectedPlan = currentPlans.find(p => p.key === plan);

  const validateStep1 = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Offer title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.discount.trim())    e.discount    = "Discount value is required";
    if (!form.category)           e.category    = "Select a category";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handleSubmit = async () => {
    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan:     "offer_post",
          duration: plan,
          price:    selectedPlan.price,
          offerData: form,
        }),
      });
      const orderData = await orderRes.json();

      if (orderData.isDummy) {
        // Dev mode: dummy payment
        const returnTo = "/vendor/offers";
        sessionStorage.setItem(`dummy-payment:${orderData.orderId}`, JSON.stringify({
          plan: "offer_post",
          duration: plan,
          offerData: form,
          returnTo,
        }));
        router.push(`/dummy-razorpay?orderId=${encodeURIComponent(orderData.orderId)}&amount=${orderData.amount}&returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      // 2. Real Razorpay checkout
      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    "INR",
        name:        "Gaya Connect",
        description: `Offer posting — ${selectedPlan.label}`,
        order_id:    orderData.orderId,
        handler: async (response) => {
          await fetch("/api/payments/verify", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ ...response, plan: "offer_post", duration: plan, offerData: form }),
          });
          router.push("/vendor/dashboard?tab=offers&success=1");
        },
        prefill: { name: "", email: "", contact: "" },
        theme: { color: "#4338CA" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="bg-[#F8F9FC] min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link href="/offers" className="flex items-center gap-2 text-[13.5px] text-gray-500 hover:text-gray-700 no-underline mb-6">
          <ArrowLeft size={16} /> Back to offers
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Sora',sans-serif] text-[28px] font-bold text-gray-900 mb-1">Post a new offer</h1>
          <p className="text-[14px] text-gray-500">Reach thousands of local customers in Gaya district</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {["Offer details", "Choose plan", "Confirm & pay"].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all ${
                step > i + 1
                  ? "bg-emerald-500 text-white"
                  : step === i + 1
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className={`text-[13px] font-medium ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>{s}</span>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-200 ml-1" />}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Offer details ── */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-7 space-y-5">
            <Field label="Offer title *" error={errors.title}>
              <input
                value={form.title}
                onChange={e => setForm(p => ({...p, title: e.target.value}))}
                placeholder="e.g. 20% off AC servicing this summer"
                className={inputCls(errors.title)}
              />
            </Field>

            <Field label="Discount / Deal value *" error={errors.discount}>
              <input
                value={form.discount}
                onChange={e => setForm(p => ({...p, discount: e.target.value}))}
                placeholder="e.g. 20% OFF, ₹99 FLAT, FREE visit, BUY 1 GET 1"
                className={inputCls(errors.discount)}
              />
            </Field>

            <Field label="Category *" error={errors.category}>
              <select
                value={form.category}
                onChange={e => setForm(p => ({...p, category: e.target.value}))}
                className={inputCls(errors.category)}>
                <option value="">Select category…</option>
                {["Electronics","Food","Hotels","Auto","Home Services","Shopping","Health","Education"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Offer description *" error={errors.description}>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({...p, description: e.target.value}))}
                placeholder="Describe your offer in detail — what's included, any conditions, timing…"
                rows={4}
                className={`${inputCls(errors.description)} resize-none`}
              />
            </Field>

            <Field label="Terms & conditions (optional)">
              <textarea
                value={form.terms}
                onChange={e => setForm(p => ({...p, terms: e.target.value}))}
                placeholder="e.g. Valid on weekdays only, minimum order ₹500, not valid with other offers…"
                rows={2}
                className={`${inputCls()} resize-none`}
              />
            </Field>

            <button onClick={handleNext}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[15px] py-3.5 rounded-xl transition-colors">
              Continue to plan selection →
            </button>
          </div>
        )}

        {/* ── STEP 2: Choose plan ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {currentPlans.map(p => (
                <button key={p.key} onClick={() => setPlan(p.key)}
                  className={`border-2 rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 ${
                    plan === p.key ? p.color + " bg-indigo-50/50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}>
                  {p.popular && (
                    <div className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-0.5 inline-block mb-3">
                      Most popular
                    </div>
                  )}
                  <div className="font-['Sora',sans-serif] text-[28px] font-extrabold text-gray-900 leading-none mb-0.5">
                    ₹{p.price}
                  </div>
                  <div className="text-[13px] font-bold text-gray-700 mb-1">{p.label}</div>
                  <div className="text-[12px] text-gray-400">{p.desc}</div>

                  <div className="mt-4 space-y-1.5">
                    {["Offer visible to all subscribers", "Profile link included", p.key === "365days" ? "Featured badge" : "Basic analytics"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[12px] text-gray-600">
                        <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleNext}
                className="flex-2 flex-[2] bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-colors">
                Continue → Pay ₹{selectedPlan?.price}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm & pay ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Review your offer</h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-[13.5px]">
                  <span className="text-gray-500">Title</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[280px]">{form.title}</span>
                </div>
                <div className="flex justify-between text-[13.5px]">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-semibold text-gray-900">{form.discount}</span>
                </div>
                <div className="flex justify-between text-[13.5px]">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-gray-900">{form.category}</span>
                </div>
                <div className="flex justify-between text-[13.5px]">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-semibold text-gray-900">{selectedPlan?.label}</span>
                </div>
              </div>

              {/* Price summary */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[14px] text-gray-600">Offer posting fee</span>
                  <span className="text-[14px] font-semibold text-gray-900">₹{selectedPlan?.price}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[13px] text-gray-400">Valid for</span>
                  <span className="text-[13px] text-gray-500">{selectedPlan?.label}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-['Sora',sans-serif] text-[22px] font-extrabold text-indigo-700">₹{selectedPlan?.price}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 text-[12.5px] text-indigo-700">
              💡 Your offer will go live immediately after payment. You can manage it from your vendor dashboard.
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleSubmit}
                className="flex-[2] bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <IndianRupee size={16} />
                Pay ₹{selectedPlan?.price} &amp; post offer
              </button>
            </div>

            <p className="text-center text-[12px] text-gray-400">
              🔒 Secured by Razorpay · 100% safe payment
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

const inputCls = (error) =>
  `w-full border rounded-xl px-4 py-2.5 text-[14px] text-gray-700 outline-none transition-colors bg-white ${
    error ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"
  }`;
