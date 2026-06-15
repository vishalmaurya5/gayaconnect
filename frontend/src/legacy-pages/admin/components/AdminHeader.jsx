import { BellIcon } from '@heroicons/react/24/outline';

export default function AdminHeader() {
  return (
    <header className="flex justify-between items-center mb-5">
      <h1 className="text-2xl font-bold">Gaya Connect Admin</h1>
      <button className="relative p-2 border rounded">
        <BellIcon className="h-5" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs grid place-items-center">3</span>
      </button>
    </header>
  );
}
