import { useEffect, useState } from 'react';
import { adminUsers, toggleUser } from '../../services/adminService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const load = async () => setUsers(await adminUsers());
  useEffect(() => { load(); }, []);

  return (
    <div className="card p-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full text-sm">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="py-2">{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isActive ? 'Active' : 'Blocked'}</td>
              <td><button onClick={async () => { await toggleUser(u._id); load(); }} className="text-blue-600">Toggle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
