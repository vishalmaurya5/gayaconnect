import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { isEmail, isStrongPassword } from '../../utils/validators';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const submit = () => {
    if (!isEmail(form.email)) return setError('Invalid email');
    if (!isStrongPassword(form.password)) return setError('Password must be at least 6 characters');
    setError('');
    dispatch(register(form));
  };

  return (
    <div className="max-w-md mx-auto card p-6 space-y-3">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select className="w-full border rounded px-3 py-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="user">User</option>
        <option value="vendor">Vendor</option>
      </select>
      <button onClick={submit} className="w-full bg-blue-600 text-white py-2 rounded">Create Account</button>
    </div>
  );
}
