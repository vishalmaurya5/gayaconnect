// Razorpay client-side helpers for Standard Checkout.
// (Server keys/secret never live here — this file runs in the browser.)

export const RAZORPAY_CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

// Loads the Razorpay Checkout script once and resolves true when ready.
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`);
    if (existing) {
      if (window.Razorpay) return resolve(true);
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Opens the Razorpay payment modal with the given options.
// `onFailure` is wired to the SDK's `payment.failed` event.
export async function openRazorpayCheckout(options, { onFailure } = {}) {
  const ready = await loadRazorpayScript();
  if (!ready || !window.Razorpay) {
    throw new Error('Razorpay checkout could not load. Check your connection and try again.');
  }

  const rzp = new window.Razorpay(options);
  if (typeof onFailure === 'function') {
    rzp.on('payment.failed', (resp) => onFailure(resp?.error || resp));
  }
  rzp.open();
  return rzp;
}
