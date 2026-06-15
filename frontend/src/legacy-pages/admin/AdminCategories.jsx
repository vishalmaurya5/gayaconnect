import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');

  const load = async () => setList((await api.get('/categories')).data);
  useEffect(() => { load(); }, []);

  const add = async () => { await api.post('/categories', { name, subCategories: [] }); setName(''); load(); };
  const del = async (id) => { await api.delete(`/categories/${id}`); load(); };

  return (
    <div className="card p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="flex gap-2 mb-4"><input className="border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} /><button onClick={add} className="bg-blue-600 text-white px-3 rounded">Add</button></div>
      {list.map((cat) => <div key={cat._id} className="py-2 border-t flex justify-between"><span>{cat.name}</span><button onClick={() => del(cat._id)} className="text-red-600">Delete</button></div>)}
    </div>
  );
}
