import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function ClickMarker({ position, onPick }) {
  useMapEvents({
    click(e) { onPick([e.latlng.lng, e.latlng.lat]); }
  });
  return position ? <Marker position={[position[1], position[0]]} /> : null;
}

export default function LocationPicker({ value, onChange }) {
  return (
    <div className="h-64 rounded overflow-hidden border">
      <MapContainer center={[24.8, 85.0]} zoom={12} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickMarker position={value} onPick={onChange} />
      </MapContainer>
    </div>
  );
}
