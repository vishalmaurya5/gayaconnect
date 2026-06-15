import { useEffect, useState } from 'react';
import api from '../../services/api';
import VendorApprovalTable from './components/VendorApprovalTable';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const load = async () => setVendors((await api.get('/vendors', { params: { limit: 100 } })).data.data || []);
  useEffect(() => { load(); }, []);

  const approve = async (id) => { await api.patch(`/vendors/${id}/approve`); load(); };
  const reject = async (id) => { await api.patch(`/vendors/${id}/reject`, { reason: 'Incomplete details' }); load(); };

  return <div><h1 className="text-2xl font-bold mb-4">Vendor Management</h1><VendorApprovalTable vendors={vendors} onApprove={approve} onReject={reject} /></div>;
}
