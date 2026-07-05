import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  const submit = async () => {
    if (!email) {
      setStatus({ loading: false, message: '', error: 'Please enter your email.' });
      return;
    }
    setStatus({ loading: true, message: '', error: '' });
    try {
      const data = await forgotPasswordApi(email);
      setStatus({
        loading: false,
        message: data?.message || 'If an account exists for that email, a reset link has been sent.',
        error: '',
      });
    } catch (err) {
      setStatus({
        loading: false,
        message: '',
        error: err?.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Forgot password</h1>
      <p className="text-sm text-gray-600 mb-4">
        Enter your account email and we&apos;ll send you a link to reset your password.
      </p>
      <div className="space-y-3">
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {status.error && <p className="text-sm text-red-600">{status.error}</p>}
        {status.message && <p className="text-sm text-green-600">{status.message}</p>}
        <button
          onClick={submit}
          disabled={status.loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {status.loading ? 'Sending...' : 'Send reset link'}
        </button>
      </div>
      <p className="text-sm mt-4">
        <Link className="text-blue-600" to="/login">Back to login</Link>
      </p>
    </div>
  );
}
