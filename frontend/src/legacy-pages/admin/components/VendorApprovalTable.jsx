export default function VendorApprovalTable({ vendors = [], onApprove, onReject }) {
  return (
    <div className="card p-4 overflow-auto">
      <table className="w-full text-sm">
        <thead><tr><th className="text-left">Vendor</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {vendors.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="py-2">{v.businessName}</td>
              <td>{v.isApproved ? 'Approved' : 'Pending'}</td>
              <td className="space-x-2">
                <button onClick={() => onApprove(v._id)} className="px-2 py-1 rounded bg-green-600 text-white">Approve</button>
                <button onClick={() => onReject(v._id)} className="px-2 py-1 rounded bg-red-600 text-white">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
