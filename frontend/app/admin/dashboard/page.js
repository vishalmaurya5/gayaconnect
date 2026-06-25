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
  FiUpload,
  FiUsers,
  FiTruck,
  FiSettings,
  FiDownload,
  FiTool,
  FiPhoneCall,
  FiMonitor,
  FiBriefcase
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
  { id: 'jobs', label: 'Jobs & Sales', icon: FiBriefcase },
  { id: 'labour', label: 'Labour', icon: FiTool },
  { id: 'vehicles', label: 'Vehicles', icon: FiTruck },
  { id: 'payments', label: 'Payments', icon: FiDollarSign },
  { id: 'calls', label: 'Call Logs', icon: FiPhoneCall },
  { id: 'popup', label: 'Popup Ad', icon: FiMonitor },
  { id: 'deleted_accounts', label: 'Deleted', icon: FiTrash2 },
  { id: 'settings', label: 'Settings', icon: FiSettings },
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
  const [vehicleForm, setVehicleForm] = useState({ vehicleName: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', ownerName: '', phone: '' })
  const [settings, setSettings] = useState(null)

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
      const [res, settingsRes] = await Promise.all([
        fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }),
        fetch('/api/admin/settings')
      ])
      const json = await res.json()
      const settingsJson = await settingsRes.json()

      if (!json.success) throw new Error(json.message || 'Admin login failed')

      setAuthenticated(true)
      if (settingsJson.success) setSettings(settingsJson.pricing)
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
      const [overview, settingsRes] = await Promise.all([
        adminFetch('/api/admin/overview', { method: 'GET' }),
        fetch('/api/admin/settings').then(res => res.json())
      ])
      setAuthenticated(true)
      setData(overview)
      if (settingsRes.success) setSettings(settingsRes.pricing)
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
          <Metric label="Jobs & Sales" value={stats.jobs || 0} icon={FiBriefcase} />
          <Metric label="Labour" value={stats.labourers || 0} icon={FiTool} />
          <Metric label="Vehicles" value={stats.vehicles || 0} icon={FiTruck} />
          <Metric label="Calls" value={stats.calls || 0} icon={FiPhoneCall} />
          <Metric label="Revenue" value={`Rs. ${revenue}`} icon={FiDollarSign} />
          <Metric label="Paid Rate" value={`${conversionRate}%`} icon={FiCheckCircle} />
        </section>

        <section className="mt-5">
          {activeTab === 'market' && <MarketView data={data} recentPayments={recentPayments} />}
          {activeTab === 'users' && <UsersView users={(data?.users || []).filter(u => !u.isDeleted)} onDelete={(id) => deleteResource('users', id)} onRefresh={loadOverview} />}
          {activeTab === 'vendors' && <VendorsView vendors={(data?.vendors || []).filter(v => !v.isDeleted)} onUpdate={updateResource} onDelete={(id) => deleteResource('vendors', id)} onRefresh={loadOverview} />}
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
          {activeTab === 'jobs' && (
            <JobsView
              jobs={data?.jobs || []}
              onRefresh={loadOverview}
              onDelete={async (id) => {
                if (window.confirm('Delete this posting?')) {
                  await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
                  toast.success('Deleted')
                  loadOverview()
                }
              }}
            />
          )}
          {activeTab === 'labour' && <LabourView labourers={(data?.labourers || []).filter(l => !l.isDeleted)} onUpdate={updateResource} onDelete={(id) => deleteResource('labourers', id)} onRefresh={loadOverview} />}
          {activeTab === 'vehicles' && (
            <VehiclesView
              vehicles={data?.vehicles || []}
              form={vehicleForm}
              setForm={setVehicleForm}
              onCreate={async () => {
                await fetch('/api/admin/vehicles', { method: 'POST', body: JSON.stringify(vehicleForm) })
                setVehicleForm({ vehicleName: '', vehicleModel: '', vehicleNumber: '', dlNumber: '', ownerName: '', phone: '' })
                toast.success('Vehicle Posted')
                loadOverview()
              }}
              onApprove={async (id, status) => {
                await fetch(`/api/admin/vehicles/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
                toast.success('Status Updated')
                loadOverview()
              }}
              onDelete={async (id) => {
                if (window.confirm('Delete this vehicle request?')) {
                  await fetch(`/api/admin/vehicles/${id}`, { method: 'DELETE' })
                  toast.success('Vehicle Deleted')
                  loadOverview()
                }
              }}
            />
          )}
          {activeTab === 'calls' && <CallsView calls={data?.calls || []} />}
          {activeTab === 'payments' && <PaymentsView payments={data?.payments || []} onUpdate={updateResource} onDelete={(id) => deleteResource('payments', id)} />}
          {activeTab === 'deleted_accounts' && (
            <DeletedAccountsView 
              users={(data?.users || []).filter(u => u.isDeleted)} 
              vendors={(data?.vendors || []).filter(v => v.isDeleted)} 
              labourers={(data?.labourers || []).filter(l => l.isDeleted)} 
              onRestore={(resource, id) => updateResource(resource, id, { isDeleted: false })} 
              onDelete={deleteResource} 
            />
          )}
          {activeTab === 'popup' && <PopupAdView />}
          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings} 
              onUpdate={async (newSettings) => {
                await fetch('/api/admin/settings', { method: 'POST', body: JSON.stringify({ pricing: newSettings }) })
                toast.success('Settings Updated')
                loadOverview()
              }} 
            />
          )}
        </section>
      </main>
    </div>
  )
}

function JobsView({ jobs, onRefresh, onDelete }) {
  const [form, setForm] = useState({ title: '', description: '', type: 'job', salaryOrPrice: '', location: '' })
  const [loading, setLoading] = useState(false)

  const handlePost = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Posted successfully')
        setForm({ title: '', description: '', type: 'job', salaryOrPrice: '', location: '' })
        onRefresh()
      } else {
        toast.error(data.message || 'Failed to post')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Post New Job or Sale (As Admin)">
        <form onSubmit={handlePost} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-4 flex bg-slate-100 p-1 rounded-lg w-fit">
            <button type="button" onClick={() => setForm({...form, type: 'job'})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${form.type === 'job' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Job</button>
            <button type="button" onClick={() => setForm({...form, type: 'sale'})} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition ${form.type === 'sale' ? 'bg-white shadow-sm text-green-700' : 'text-slate-500 hover:text-slate-700'}`}>Sale</button>
          </div>
          <TextInput label="Title" value={form.title} onChange={v => setForm({...form, title: v})} required />
          <TextInput label={form.type === 'job' ? 'Salary' : 'Price'} value={form.salaryOrPrice} onChange={v => setForm({...form, salaryOrPrice: v})} />
          <TextInput label="Location" value={form.location} onChange={v => setForm({...form, location: v})} />
          <div className="sm:col-span-2 md:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
            <textarea required rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
          </div>
          <button type="submit" disabled={loading} className="sm:col-span-2 md:col-span-4 mt-2 rounded-xl bg-blue-600 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Posting...' : 'Post ' + form.type}
          </button>
        </form>
      </Panel>
      <Panel 
        title="Active Jobs & Sales"
        action={<ExportButton filename="jobs_sales" headers={['Type', 'Title', 'Salary/Price', 'Location', 'Posted By', 'Date']} data={jobs.map(j => [j.type, j.title, j.salaryOrPrice, j.location, j.postedByAdmin ? 'Admin' : j.vendorId?.name || 'Unknown', new Date(j.createdAt).toLocaleDateString()])} />}
      >
        <Table
          headers={['Type', 'Title', 'Salary/Price', 'Posted By', 'Actions']}
          rows={jobs.map((job) => [
            <span key={'type'+job._id} className={`px-2 py-1 rounded text-xs font-bold uppercase ${job.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{job.type}</span>,
            job.title,
            job.salaryOrPrice || '-',
            job.postedByAdmin ? <span key={'admin'+job._id} className="text-purple-600 font-bold">Admin</span> : (job.vendorId?.name || 'Vendor'),
            <IconButton key={job._id} icon={FiTrash2} label="Delete" onClick={() => onDelete(job._id)} danger />,
          ])}
        />
      </Panel>
    </div>
  )
}

function CallsView({ calls }) {
  return (
    <Panel 
      title="Platform Call Logs"
      action={<ExportButton filename="call_logs" headers={['Date', 'Caller', 'Phone', 'Receiver', 'Receiver Type', 'Receiver Phone', 'Action']} data={calls.map(c => [new Date(c.createdAt).toLocaleString(), c.callerName, c.callerPhone, c.receiverName, c.receiverType, c.receiverPhone, c.actionType])} />}
    >
      <Table
        headers={['Date & Time', 'Caller', 'Caller Phone', 'Contacted', 'Target Type', 'Target Phone', 'Method']}
        rows={calls.map((c) => [
          new Date(c.createdAt).toLocaleString(),
          c.callerName,
          c.callerPhone,
          c.receiverName,
          <span key={`type-${c._id}`} className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            c.receiverType === 'Vendor' ? 'bg-purple-100 text-purple-700' :
            c.receiverType === 'Labourer' ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {c.receiverType}
          </span>,
          c.receiverPhone,
          <span key={`action-${c._id}`} className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider ${
            c.actionType === 'WhatsApp' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {c.actionType}
          </span>
        ])}
      />
    </Panel>
  )
}

function PopupAdView() {
  const [isActive, setIsActive] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/popup')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          setIsActive(d.data.isActive);
          setImageUrl(d.data.imageUrl);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      toast.error("Only JPG/JPEG files are allowed.");
      return;
    }
    
    if (file.size > 200 * 1024) {
      toast.error("Image size must be less than 200KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to save popup settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <Panel 
      title="Popup Advertisement" 
      action={
        <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      }
    >
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <h3 className="font-semibold text-slate-900">Enable Popup</h3>
            <p className="text-sm text-slate-500">Show this advertisement when users visit the homepage.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Advertisement Image</label>
          <div className="flex items-start gap-4">
            <div className="w-64 h-64 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt="Popup Ad" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <FiImage size={32} className="mb-2" />
                  <span className="text-sm">No image uploaded</span>
                </div>
              )}
            </div>
            <div>
              <input type="file" id="popupImage" accept="image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
              <label htmlFor="popupImage" className="cursor-pointer inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors">
                <FiUpload /> Upload Image
              </label>
              <ul className="text-xs text-slate-500 mt-3 list-disc pl-4 space-y-1">
                <li>Only JPEG / JPG format allowed.</li>
                <li>Maximum file size: 200 KB.</li>
                <li>Aspect ratio: Vertical (e.g. 4:5 or 9:16) recommended for mobile.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Panel>
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

function ExportButton({ filename, headers, data }) {
  const handleExport = () => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <button type="button" onClick={handleExport} className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 border border-green-200">
      <FiDownload size={14} /> Export CSV
    </button>
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

function UsersView({ users, onDelete, onRefresh }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user', ...form })
      })
      const json = await res.json()
      if (json.success) {
        setForm({ name: '', email: '', phone: '', password: '' })
        onRefresh()
      } else {
        alert(json.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Add New User">
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <TextInput label="Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <TextInput label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
          <TextInput label="Phone" value={form.phone} onChange={v => setForm({...form, phone: v})} required />
          <TextInput label="Temporary Password" value={form.password} onChange={v => setForm({...form, password: v})} required />
          <button type="submit" disabled={loading} className="sm:col-span-2 md:col-span-4 mt-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </Panel>
      <Panel 
        title="Users" 
        action={<ExportButton filename="users_export" headers={['Name', 'Email', 'Phone', 'Role', 'Joined']} data={users.map(u => [u.name, u.email, u.phone, u.role, new Date(u.createdAt).toLocaleDateString()])} />}
      >
        <Table
          headers={['Name', 'Email', 'Role', 'Phone', 'Action']}
          rows={users.map((user) => [
            user.name,
            user.email,
            user.role,
            user.phone,
            <IconButton key={user._id} icon={FiTrash2} label="Delete Permanently" onClick={() => onDelete(user._id)} danger />,
          ])}
        />
      </Panel>
    </div>
  )
}

function VendorsView({ vendors, onUpdate, onDelete, onRefresh }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', businessName: '', category: '', address: '' })
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vendor', ...form })
      })
      const json = await res.json()
      if (json.success) {
        setForm({ name: '', email: '', phone: '', password: '', businessName: '', category: '', address: '' })
        onRefresh()
      } else {
        alert(json.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Add New Vendor">
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <TextInput label="Owner Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <TextInput label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
          <TextInput label="Phone" value={form.phone} onChange={v => setForm({...form, phone: v})} required />
          <TextInput label="Temporary Password" value={form.password} onChange={v => setForm({...form, password: v})} required />
          <TextInput label="Business Name" value={form.businessName} onChange={v => setForm({...form, businessName: v})} required />
          <TextInput label="Category" value={form.category} onChange={v => setForm({...form, category: v})} required />
          <div className="sm:col-span-2">
            <TextInput label="Business Address" value={form.address} onChange={v => setForm({...form, address: v})} required />
          </div>
          <button type="submit" disabled={loading} className="sm:col-span-2 md:col-span-4 mt-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Vendor'}
          </button>
        </form>
      </Panel>
      <Panel 
        title="Vendors"
        action={<ExportButton filename="vendors_export" headers={['Business Name', 'Category', 'SubCategory', 'Approved', 'Premium', 'Joined']} data={vendors.map(v => [v.name, v.category, v.subCategory || '', v.isApproved ? 'Yes' : 'No', v.isPremium ? 'Yes' : 'No', new Date(v.createdAt).toLocaleDateString()])} />}
      >
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
    </div>
  )
}

function OffersView({ offers, onUpdate, onDelete }) {
  return (
    <Panel 
      title="Offers"
      action={<ExportButton filename="offers_export" headers={['Title', 'Discount', 'Vendor', 'Active', 'Valid Until']} data={offers.map(o => [o.title, o.discountText, o.vendorId?.name || '', o.isActive ? 'Yes' : 'No', o.validUntil ? new Date(o.validUntil).toLocaleDateString() : ''])} />}
    >
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
      <Panel 
        title="Banners"
        action={<ExportButton filename="banners_export" headers={['Title', 'Position', 'Active', 'End Date']} data={banners.map(b => [b.title, b.position, b.isActive ? 'Yes' : 'No', b.endDate ? new Date(b.endDate).toLocaleDateString() : ''])} />}
      >
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
      <Panel 
        title="Blogs"
        action={<ExportButton filename="blogs_export" headers={['Title', 'Slug', 'Status', 'Created']} data={blogs.map(b => [b.title, b.slug, b.status, b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''])} />}
      >
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
    <Panel 
      title={compact ? 'Recent Payments' : 'Payments & Revenue'}
      action={<ExportButton filename="payments_export" headers={['Plan', 'Amount', 'Method', 'Status', 'Date']} data={payments.map(p => [p.planType, p.amount, p.paymentMethod || '', p.status, p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''])} />}
    >
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

function LabourView({ labourers, onUpdate, onDelete, onRefresh }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', skill: '', dailyRate: '', address: '' })
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'labourer', ...form })
      })
      const json = await res.json()
      if (json.success) {
        setForm({ name: '', email: '', phone: '', password: '', skill: '', dailyRate: '', address: '' })
        onRefresh()
      } else {
        alert(json.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Panel title="Add New Labourer">
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <TextInput label="Name" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <TextInput label="Email" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
          <TextInput label="Phone" value={form.phone} onChange={v => setForm({...form, phone: v})} required />
          <TextInput label="Temporary Password" value={form.password} onChange={v => setForm({...form, password: v})} required />
          <TextInput label="Skill (Category)" value={form.skill} onChange={v => setForm({...form, skill: v})} required />
          <TextInput label="Daily Rate (₹)" type="number" value={form.dailyRate} onChange={v => setForm({...form, dailyRate: v})} />
          <div className="sm:col-span-2">
            <TextInput label="Area / Address" value={form.address} onChange={v => setForm({...form, address: v})} />
          </div>
          <button type="submit" disabled={loading} className="sm:col-span-2 md:col-span-4 mt-2 rounded-xl bg-indigo-600 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Labourer'}
          </button>
        </form>
      </Panel>
      <Panel 
        title="Labour Directory"
        action={<ExportButton filename="labourers_export" headers={['Name', 'Skill/Category', 'Area/Address', 'Rate', 'Approved', 'Joined']} data={labourers.map(l => [l.name, l.skill || l.category || '', l.address || l.area || '', l.dailyRate || '', l.isVerified || l.isApproved ? 'Yes' : 'No', l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''])} />}
      >
        <Table
          headers={['Name', 'Skill', 'Area', 'Rate', 'Approved', 'Actions']}
          rows={labourers.map((labour) => [
            labour.name,
            labour.skill || labour.category || '-',
            labour.address || labour.area || '-',
            labour.dailyRate ? `₹${labour.dailyRate}/day` : '-',
            labour.isVerified || labour.isApproved ? 'Yes' : 'No',
            <div key={labour._id} className="flex gap-2">
              <IconButton icon={FiCheckCircle} label={labour.isVerified || labour.isApproved ? 'Unapprove' : 'Approve'} onClick={() => onUpdate('labourers', labour._id, { isVerified: !(labour.isVerified || labour.isApproved) })} />
              <IconButton icon={FiTrash2} label="Delete Permanently" onClick={() => onDelete(labour._id)} danger />
            </div>,
          ])}
        />
      </Panel>
    </div>
  )
}

function VehiclesView({ vehicles, form, setForm, onCreate, onApprove, onDelete }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Admin Post Vehicle">
        <div className="space-y-3">
          <TextInput label="Vehicle Name" value={form.vehicleName} onChange={(value) => setForm((current) => ({ ...current, vehicleName: value }))} />
          <TextInput label="Vehicle Model" value={form.vehicleModel} onChange={(value) => setForm((current) => ({ ...current, vehicleModel: value }))} />
          <TextInput label="Vehicle Number" value={form.vehicleNumber} onChange={(value) => setForm((current) => ({ ...current, vehicleNumber: value }))} />
          <TextInput label="DL Number" value={form.dlNumber} onChange={(value) => setForm((current) => ({ ...current, dlNumber: value }))} />
          <TextInput label="Owner Name (Optional)" value={form.ownerName} onChange={(value) => setForm((current) => ({ ...current, ownerName: value }))} />
          <TextInput label="Owner Phone (Optional)" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <button onClick={onCreate} className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Add Vehicle Directly</button>
        </div>
      </Panel>
      <Panel 
        title="Vehicle Requests"
        action={<ExportButton filename="vehicles_export" headers={['Owner', 'Phone', 'Vehicle', 'Number', 'Status', 'Paid']} data={vehicles.map(v => [v.ownerName, v.phone, `${v.vehicleName} - ${v.vehicleModel}`, v.vehicleNumber, v.status, v.paymentStatus === 'completed' ? 'Yes' : 'No'])} />}
      >
        <Table
          headers={['Owner', 'Vehicle', 'Number', 'Status', 'Paid', 'Actions']}
          rows={vehicles.map((v) => [
            `${v.ownerName} (${v.phone})`,
            `${v.vehicleName} - ${v.vehicleModel}`,
            v.vehicleNumber,
            v.status,
            v.paymentStatus === 'completed' ? 'Yes' : 'No',
            <div key={v._id} className="flex gap-2">
              <IconButton icon={FiCheckCircle} label={v.status === 'approved' ? 'Reject' : 'Approve'} onClick={() => onApprove(v._id, v.status === 'approved' ? 'rejected' : 'approved')} />
              <IconButton icon={FiTrash2} label="Delete Permanently" onClick={() => onDelete(v._id)} danger />
            </div>,
          ])}
        />
      </Panel>
    </div>
  )
}

function DeletedAccountsView({ users, vendors, labourers, onRestore, onDelete }) {
  const deletedItems = [
    ...users.map(u => ({ ...u, type: 'users', displayType: 'User' })),
    ...vendors.map(v => ({ ...v, type: 'vendors', displayType: 'Vendor' })),
    ...labourers.map(l => ({ ...l, type: 'labourers', displayType: 'Labourer' }))
  ].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))

  return (
    <Panel title="Deleted Accounts (Soft Deleted)">
      <Table
        headers={['Name/Business', 'Type', 'Email/Phone', 'Action']}
        rows={deletedItems.map((item) => [
          item.name || item.businessName || '-',
          <span key={`type-${item._id}`} className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{item.displayType}</span>,
          item.email || item.phone || '-',
          <div key={item._id} className="flex gap-2">
            <IconButton icon={FiRefreshCw} label="Restore Account" onClick={() => onRestore(item.type, item._id)} />
            <IconButton icon={FiTrash2} label="Delete Permanently" onClick={() => onDelete(item.type, item._id)} danger />
          </div>,
        ])}
      />
    </Panel>
  )
}

function SettingsView({ settings, onUpdate }) {
  const [form, setForm] = useState(settings || {
    subscription: 11,
    banner: 199,
    vehicle: 200,
    vendorRegistration: 49,
    chargeVendorRegistration: false
  })

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Platform Pricing (in INR)">
        <div className="space-y-4">
          <TextInput 
            label="Monthly Subscription Price" 
            type="number" 
            value={form.subscription} 
            onChange={(val) => setForm({ ...form, subscription: Number(val) })} 
          />
          <TextInput 
            label="Banner Advertisement Price" 
            type="number" 
            value={form.banner} 
            onChange={(val) => setForm({ ...form, banner: Number(val) })} 
          />
          <TextInput 
            label="Vehicle Listing Price" 
            type="number" 
            value={form.vehicle} 
            onChange={(val) => setForm({ ...form, vehicle: Number(val) })} 
          />
          <TextInput 
            label="Vendor Registration Fee" 
            type="number" 
            value={form.vendorRegistration} 
            onChange={(val) => setForm({ ...form, vendorRegistration: Number(val) })} 
          />
          
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Charge Vendor Registration Fee</p>
              <p className="text-sm text-slate-500">If enabled, new vendors will have to pay the fee during registration via Razorpay.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" checked={form.chargeVendorRegistration} onChange={(e) => setForm({ ...form, chargeVendorRegistration: e.target.checked })} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <button onClick={() => onUpdate(form)} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30">
            Save Settings
          </button>
        </div>
      </Panel>
    </div>
  )
}
