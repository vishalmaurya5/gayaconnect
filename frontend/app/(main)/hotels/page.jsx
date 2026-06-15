import Link from 'next/link'

export default function HotelsPage() {
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-slate-950">Hotels</h1>
      <p className="mt-2 text-slate-600">Browse hotel vendors from the services directory.</p>
      <Link href="/services" className="mt-4 inline-block font-semibold text-blue-700">
        Browse services
      </Link>
    </div>
  )
}
