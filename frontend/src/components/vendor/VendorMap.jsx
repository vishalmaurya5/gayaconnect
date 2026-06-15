import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function VendorMap({ vendors = [] }) {
  const center = [24.8, 85.0];
  return (
    <div className="h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vendors.map((v) => (
          <Marker key={v._id} position={[v.location?.coordinates?.[1] || 24.8, v.location?.coordinates?.[0] || 85.0]}>
            <Popup>{v.businessName}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
