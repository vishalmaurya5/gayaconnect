import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Navigate, Link } from 'react-router-dom';
import { resetPassword } from '../../store/slices/authSlice';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = () => {
    setLocalError('');
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setLocalError('Passwords do not match.');
      return;
    }
    dispatch(resetPassword({ token, password: form.password }));
  };

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Reset password</h1>
      <p className="text-sm text-gray-600 mb-4">Choose a new password for your account.</p>
      <div className="space-y-3">
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="New password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Confirm new password"
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        {(localError || error) && <p className="text-sm text-red-600">{localError || error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? 'Updating...' : 'Reset password'}
        </button>
      </div>
      <p className="text-sm mt-4">
        <Link className="text-blue-600" to="/login">Back to login</Link>
      </p>
    </div>
  );
}
