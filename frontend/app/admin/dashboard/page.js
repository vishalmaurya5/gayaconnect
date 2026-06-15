'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiDollarSign,
  FiEdit3,
  FiEye,
  FiImage,
  FiLogIn,
  FiRefreshCw,
  FiShield,
  FiShoppingBag,
  FiTag,
  FiTrash2,
  FiTool,
  FiUpload,
  FiUsers,
} from 'react-icons/fi'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const tabs = [
  { id: 'market', label: 'Market', icon: FiBarChart2 },
  { id: 'users', label: 'Users', icon: FiUsers },
  { id: 'vendors', label: 'Vendors', icon: FiShoppingBag },
  { id: 'offers', label: 'Offers', icon: FiTag },
  { id: 'banners', label: 'Banners', icon: FiImage },
  { id: 'blogs', label: 'Blogs', icon: FiBookOpen },
  { id: 'labour', label: 'Labour', icon: FiTool },
  { id: 'payments', label: 'Payments', icon: FiDollarSign },
]

const emptyBanner = {
  title: '',
  description: '',
  imageUrl: '',
  link: '',
  vendorId: '',
  position: 'homepage',
  endDate: '',
  isActive: true,
}

const emptyBlog = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  status: 'draft',
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ userId: 'admin', password: '' })
  const [activeTab, setActiveTab] = useState('market')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bannerForm, setBannerForm] = useState(emptyBanner)
  const [blogForm, setBlogForm] = useState(emptyBlog)

  useEffect(() => {
    loadOverview()
  }, [])

  const stats = data?.stats || {}
  const revenue = Number(stats.revenue || 0)
  const conversionRate = stats.payments ? Math.round((stats.paidPayments / stats.payments) * 100) : 0

  const recentPayments = useMemo(() => data?.payments?.slice(0, 8) || [], [data])

  const adminFetch = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
    const json = await response.json()
    if (!json.success) throw new Error(json.message || 'Admin request failed')
    return json
  }

  const login = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      const json = await response.json()
      if (!json.success) throw new Error(json.message || 'Admin login failed')

      setAuthenticated(true)
      toast.success('Admin access granted')
      await loadOverview()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setAuthenticated(false)
    setData(null)
  }

  const loadOverview = async () => {
    setLoading(true)

    try {
      const overview = await adminFetch('/api/admin/overview', { method: 'GET' })
      setAuthenticated(true)
      setData(overview)
    } catch (error) {
      setAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const updateResource = async (resource, id, payload) => {
    try {
      await adminFetch('/api/admin/manage', {
        method: 'PATCH',
        body: JSON.stringify({ resource, id, payload }),
      })
      toast.success('Updated')
      await loadOverview()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteResource = async (resource, id) => {
    if (!window.confirm('Delete this item?')) return

    try {
      await adminFetch(`/api/admin/manage?resource=${resource}&id=${id}`, { method: 'DELETE' })
      toast.success('Deleted')
      await loadOverview()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const createResource = async (resource, payload, reset) => {
    try {
      await adminFetch('/api/admin/manage', {
        method: 'POST',
        body: JSON.stringify({ resource, payload }),
      })
      toast.success('Created')
      reset()
      await loadOverview()
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center">
          <form onSubmit={login} className="w-full rounded-lg border border-white/10 bg-white p-6 text-slate-950 shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <FiShield className="text-2xl" />
            </span>
            <h1 className="mt-4 text-2xl font-bold">Admin Control Center</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Secure access for market, users, vendors, offers, blogs, banners, payments, and revenue.</p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">User ID</span>
                <input className="input-field" value={credentials.userId} onChange={(event) => setCredentials((current) => ({ ...current, userId: event.target.value }))} />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <input type="password" className="input-field" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} />
              </label>
            </div>
            <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70">
              <FiLogIn />
              {loading ? 'Checking...' : 'Enter Admin'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Admin</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Gaya Connect Control Center</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadOverview()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={logout} className="rounded-lg bg-slate-950 px-4 py-2 font-semibold text-white">Logout</button>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-5 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                <Icon />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="p-5">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Metric label="Users" value={stats.users || 0} icon={FiUsers} />
          <Metric label="Vendors" value={stats.vendors || 0} icon={FiShoppingBag} />
          <Metric label="Offers" value={stats.offers || 0} icon={FiTag} />
          <Metric label="Banners" value={stats.banners || 0} icon={FiImage} />
          <Metric label="Labour" value={stats.labourers || 0} icon={FiTool} />
          <Metric label="Revenue" value={`Rs. ${revenue}`} icon={FiDollarSign} />
          <Metric label="Paid Rate" value={`${conversionRate}%`} icon={FiCheckCircle} />
        </section>

        <section className="mt-5">
          {activeTab === 'market' && <MarketView data={data} recentPayments={recentPayments} />}
          {activeTab === 'users' && <UsersView users={data?.users || []} onDelete={(id) => deleteResource('users', id)} />}
          {activeTab === 'vendors' && <VendorsView vendors={data?.vendors || []} onUpdate={updateResource} onDelete={(id) => deleteResource('vendors', id)} />}
          {activeTab === 'offers' && <OffersView offers={data?.offers || []} onUpdate={updateResource} onDelete={(id) => deleteResource('offers', id)} />}
          {activeTab === 'banners' && (
            <BannersView
              banners={data?.banners || []}
              vendors={data?.vendors || []}
              form={bannerForm}
              setForm={setBannerForm}
              onCreate={() => createResource('banners', bannerForm, () => setBannerForm(emptyBanner))}
              onUpdate={updateResource}
              onDelete={(id) => deleteResource('banners', id)}
            />
          )}
          {activeTab === 'blogs' && (
            <BlogsView
              blogs={data?.blogs || []}
              form={blogForm}
              setForm={setBlogForm}
              onCreate={() => createResource('blogs', blogForm, () => setBlogForm(emptyBlog))}
              onUpdate={updateResource}
              onDelete={(id) => deleteResource('blogs', id)}
            />
          )}
          {activeTab === 'labour' && <LabourView labourers={data?.labourers || []} onUpdate={updateResource} onDelete={(id) => deleteResource('labourers', id)} />}
          {activeTab === 'payments' && <PaymentsView payments={data?.payments || []} onUpdate={updateResource} onDelete={(id) => deleteResource('payments', id)} />}
        </section>
      </main>
    </div>
  )
}

function Metric({ label, value, icon: Icon }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Icon /></span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
    </article>
  )
}

function Panel({ title, children, action }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function MarketView({ data, recentPayments }) {
  const usersByRole = data?.analytics?.usersByRole || []
  const paymentStatus = data?.analytics?.paymentStatus || []
  const graphData = data?.analytics?.graphData || []

  const chartData = {
    labels: graphData.map(d => d.name),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: graphData.map(d => d.revenue),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `₹${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 12 }, color: '#64748b', callback: (val) => `₹${val}` },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 }, color: '#64748b' },
        border: { display: false }
      },
    },
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <Panel title="Market Snapshot">
        <div className="grid gap-3 sm:grid-cols-2">
          <Insight label="Approved Vendors" value={data?.stats?.approvedVendors || 0} />
          <Insight label="Pending Vendors" value={data?.stats?.pendingVendors || 0} />
          <Insight label="Active Offers" value={data?.stats?.activeOffers || 0} />
          <Insight label="Active Banners" value={data?.stats?.activeBanners || 0} />
        </div>
      </Panel>
      <Panel title="Revenue (Last 7 Days)">
        <div className="h-[200px] w-full">
          {graphData.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No revenue data available.</div>
          )}
        </div>
      </Panel>
      <div className="xl:col-span-2">
        <PaymentsView compact payments={recentPayments} />
      </div>
    </div>
  )
}

function Insight({ label, value }) {
  return <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-950">{value}</p></div>
}

function MiniList({ title, items }) {
  return (
    <div>
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length ? items.map(([label, value]) => (
          <div key={label} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="capitalize text-slate-600">{label}</span>
            <span className="font-semibold text-slate-950">{value}</span>
          </div>
        )) : <p className="text-sm text-slate-500">No data yet.</p>}
      </div>
    </div>
  )
}

function UsersView({ users, onDelete }) {
  return (
    <Panel title="Users">
      <Table
        headers={['Name', 'Email', 'Role', 'Phone', 'Access', 'Action']}
        rows={users.map((user) => [
          user.name,
          user.email,
          user.role,
          user.phone,
          user.offerAccessExpiresAt ? new Date(user.offerAccessExpiresAt).toLocaleDateString() : '-',
          <IconButton key={user._id} icon={FiTrash2} label="Delete" onClick={() => onDelete(user._id)} danger />,
        ])}
      />
    </Panel>
  )
}

function VendorsView({ vendors, onUpdate, onDelete }) {
  return (
    <Panel title="Vendors">
      <Table
        headers={['Business', 'Category', 'Subcategory', 'Approved', 'Premium', 'Actions']}
        rows={vendors.map((vendor) => [
          vendor.name,
          vendor.category,
          vendor.subCategory || '-',
          vendor.isApproved ? 'Yes' : 'No',
          vendor.isPremium ? 'Yes' : 'No',
          <div key={vendor._id} className="flex gap-2">
            <IconButton icon={FiCheckCircle} label={vendor.isApproved ? 'Unapprove' : 'Approve'} onClick={() => onUpdate('vendors', vendor._id, { isApproved: !vendor.isApproved })} />
            <IconButton icon={FiEye} label={vendor.isPremium ? 'Normal' : 'Premium'} onClick={() => onUpdate('vendors', vendor._id, { isPremium: !vendor.isPremium })} />
            <IconButton icon={FiTrash2} label="Delete" onClick={() => onDelete(vendor._id)} danger />
          </div>,
        ])}
      />
    </Panel>
  )
}

function OffersView({ offers, onUpdate, onDelete }) {
  return (
    <Panel title="Offers">
      <Table
        headers={['Title', 'Discount', 'Vendor', 'Active', 'Valid Until', 'Actions']}
        rows={offers.map((offer) => [
          offer.title,
          offer.discountText,
          offer.vendorId?.name || '-',
          offer.isActive ? 'Yes' : 'No',
          offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : '-',
          <div key={offer._id} className="flex gap-2">
            <IconButton icon={FiEdit3} label={offer.isActive ? 'Disable' : 'Enable'} onClick={() => onUpdate('offers', offer._id, { isActive: !offer.isActive })} />
            <IconButton icon={FiTrash2} label="Delete" onClick={() => onDelete(offer._id)} danger />
          </div>,
        ])}
      />
    </Panel>
  )
}

function BannersView({ banners, vendors, form, setForm, onCreate, onUpdate, onDelete }) {
  const handleBannerImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Banner file must be an image')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Banner image must be less than 2 MB')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, imageUrl: reader.result }))
    reader.readAsDataURL(file)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Post Banner">
        <div className="space-y-3">
          <TextInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
          <TextInput label="Description" value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Vendor</span>
            <select className="input-field" value={form.vendorId || ''} onChange={(event) => setForm((current) => ({ ...current, vendorId: event.target.value }))}>
              <option value="">Platform banner</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name} {vendor.category ? `- ${vendor.category}` : ''}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">Each vendor can have only 2 active banners at a time.</p>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Upload banner image</span>
            <span className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
              <FiUpload />
              Choose image
              <input type="file" accept="image/*" onChange={handleBannerImage} className="hidden" />
            </span>
          </label>
          {form.imageUrl && (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img src={form.imageUrl} alt="Banner preview" className="h-36 w-full object-cover" />
            </div>
          )}
          <TextInput label="Image URL" value={form.imageUrl} onChange={(value) => setForm((current) => ({ ...current, imageUrl: value }))} />
          <TextInput label="Link" value={form.link} onChange={(value) => setForm((current) => ({ ...current, link: value }))} />
          <TextInput label="End date" type="date" value={form.endDate} onChange={(value) => setForm((current) => ({ ...current, endDate: value }))} />
          <button onClick={onCreate} className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Create Banner</button>
        </div>
      </Panel>
      <Panel title="Banners">
        <Table
          headers={['Title', 'Position', 'Active', 'End Date', 'Actions']}
          rows={banners.map((banner) => [
            banner.title,
            banner.position,
            banner.isActive ? 'Yes' : 'No',
            banner.endDate ? new Date(banner.endDate).toLocaleDateString() : '-',
            <div key={banner._id} className="flex gap-2">
              <IconButton icon={FiEdit3} label={banner.isActive ? 'Disable' : 'Enable'} onClick={() => onUpdate('banners', banner._id, { isActive: !banner.isActive })} />
              <IconButton icon={FiTrash2} label="Delete" onClick={() => onDelete(banner._id)} danger />
            </div>,
          ])}
        />
      </Panel>
    </div>
  )
}

function BlogsView({ blogs, form, setForm, onCreate, onUpdate, onDelete }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Post Blog">
        <div className="space-y-3">
          <TextInput label="Title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
          <TextInput label="Slug" value={form.slug} onChange={(value) => setForm((current) => ({ ...current, slug: value }))} />
          <TextInput label="Excerpt" value={form.excerpt} onChange={(value) => setForm((current) => ({ ...current, excerpt: value }))} />
          <TextInput label="Cover image" value={form.coverImage} onChange={(value) => setForm((current) => ({ ...current, coverImage: value }))} />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Content</span>
            <textarea className="input-field min-h-[150px]" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} />
          </label>
          <button onClick={onCreate} className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Create Blog</button>
        </div>
      </Panel>
      <Panel title="Blogs">
        <Table
          headers={['Title', 'Slug', 'Status', 'Created', 'Actions']}
          rows={blogs.map((blog) => [
            blog.title,
            blog.slug,
            blog.status,
            blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : '-',
            <div key={blog._id} className="flex gap-2">
              <IconButton icon={FiEdit3} label={blog.status === 'published' ? 'Draft' : 'Publish'} onClick={() => onUpdate('blogs', blog._id, { status: blog.status === 'published' ? 'draft' : 'published' })} />
              <IconButton icon={FiTrash2} label="Delete" onClick={() => onDelete(blog._id)} danger />
            </div>,
          ])}
        />
      </Panel>
    </div>
  )
}

function PaymentsView({ payments, onUpdate, onDelete, compact = false }) {
  return (
    <Panel title={compact ? 'Recent Payments' : 'Payments & Revenue'}>
      <Table
        headers={['Plan', 'Amount', 'Method', 'Status', 'Date', 'Actions']}
        rows={payments.map((payment) => [
          payment.planType,
          `Rs. ${payment.amount || 0}`,
          payment.paymentMethod || '-',
          payment.status,
          payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : '-',
          compact ? '-' : (
            <div key={payment._id} className="flex gap-2">
              <IconButton icon={FiCheckCircle} label="Mark paid" onClick={() => onUpdate('payments', payment._id, { status: 'success' })} />
              <IconButton icon={FiTrash2} label="Delete" onClick={() => onDelete(payment._id)} danger />
            </div>
          ),
        ])}
      />
    </Panel>
  )
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr>
            {headers.map((header) => <th key={header} className="whitespace-nowrap px-3 py-3 text-left font-semibold text-slate-500">{header}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length ? rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="align-top">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="max-w-xs break-words px-3 py-3 text-slate-700">{cell || '-'}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={headers.length} className="px-3 py-8 text-center text-slate-500">No records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function IconButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${danger ? 'border-red-100 bg-red-50 text-red-600 hover:bg-red-100' : 'border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
    >
      <Icon />
    </button>
  )
}

function TextInput({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input type={type} className="input-field" value={value || ''} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function LabourView({ labourers, onUpdate, onDelete }) {
  return (
    <Panel title="Labour Directory">
      <Table
        headers={['Name', 'Category', 'Area', 'Rate', 'Approved', 'Actions']}
        rows={labourers.map((labour) => [
          labour.name,
          labour.category || '-',
          labour.area || '-',
          labour.dailyRate ? `₹${labour.dailyRate}/day` : '-',
          labour.isApproved ? 'Yes' : 'No',
          <div key={labour._id} className="flex gap-2">
            <IconButton icon={FiCheckCircle} label={labour.isApproved ? 'Unapprove' : 'Approve'} onClick={() => onUpdate('labourers', labour._id, { isApproved: !labour.isApproved })} />
            <IconButton icon={FiTrash2} label="Delete" onClick={() => onDelete(labour._id)} danger />
          </div>,
        ])}
      />
    </Panel>
  )
}
