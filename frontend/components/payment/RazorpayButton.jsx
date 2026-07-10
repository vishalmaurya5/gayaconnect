'use client';

import { useState } from 'react';
import { openRazorpayCheckout } from '@/lib/services/razorpay';

/**
 * Reusable Razorpay Standard Checkout button.
 *
 * Flow: click -> POST createOrderUrl -> open Razorpay modal -> on success
 * POST verifyUrl with the 3 signature fields -> call onSuccess.
 *
 * Props:
 *  - amount (paise), currency, receipt   -> default payload for /api/razorpay/order
 *  - createOrderPayload                  -> override payload for a domain-specific endpoint
 *  - createOrderUrl, verifyUrl           -> endpoints (default to the generic ones)
 *  - name, description, prefill, notes, theme
 *  - label, className, disabled
 *  - onSuccess(verifyData, rzpResponse), onError(message), onDismiss()
 */
export default function RazorpayButton({
  amount,
  currency = 'INR',
  receipt,
  createOrderPayload,
  createOrderUrl = '/api/razorpay/order',
  verifyUrl = '/api/razorpay/verify',
  name = 'Gaya Seva',
  description = 'Payment',
  prefill = {},
  notes = {},
  theme = { color: '#10b981' },
  label = 'Pay Now',
  className = '',
  disabled = false,
  onSuccess,
  onError,
  onDismiss,
}) {
  const [loading, setLoading] = useState(false);

  const fail = (message) => {
    setLoading(false);
    if (typeof onError === 'function') onError(message);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      // 1) Create the order on the server.
      const payload = createOrderPayload || { amount, currency, receipt };
      const orderRes = await fetch(createOrderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || orderData.error || 'Could not create order');
      }

      const orderId = orderData.orderId || orderData.order?.id;
      const orderAmount = orderData.amount ?? orderData.order?.amount ?? amount;
      const orderCurrency = orderData.currency || orderData.order?.currency || currency;
      const keyId = orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!keyId) throw new Error('Razorpay key is not configured');
      if (!orderId) throw new Error('Order id missing from server response');

      // 2) Open the Razorpay modal.
      await openRazorpayCheckout(
        {
          key: keyId,
          amount: orderAmount,
          currency: orderCurrency,
          name,
          description,
          order_id: orderId,
          prefill,
          notes,
          theme,
          // 3) On success -> verify the signature server-side.
          handler: async (response) => {
            try {
              const verifyRes = await fetch(verifyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json().catch(() => ({}));
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.message || 'Payment verification failed');
              }
              setLoading(false);
              if (typeof onSuccess === 'function') onSuccess(verifyData, response);
            } catch (err) {
              fail(err.message || 'Payment verification failed');
            }
          },
          modal: {
            // User closed the modal without paying.
            ondismiss: () => {
              setLoading(false);
              if (typeof onDismiss === 'function') onDismiss();
            },
          },
        },
        {
          // Razorpay 'payment.failed' event.
          onFailure: (err) => fail(err?.description || 'Payment failed. Please try again.'),
        }
      );
    } catch (err) {
      fail(err.message || 'Payment could not be started');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={
        className ||
        'w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition disabled:opacity-60 disabled:cursor-not-allowed'
      }
    >
      {loading ? 'Processing…' : label}
    </button>
  );
}
