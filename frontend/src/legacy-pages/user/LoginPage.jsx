import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '', remember: true });

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="space-y-3">
        <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} /> Remember me</label>
        <button onClick={() => dispatch(login(form))} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Signing in...' : 'Login'}</button>
      </div>
      <p className="text-sm mt-4">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
    </div>
  );
}
