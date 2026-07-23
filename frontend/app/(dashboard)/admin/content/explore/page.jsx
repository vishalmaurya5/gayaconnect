'use client';

import { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiMapPin, FiGlobe, FiStar, 
  FiCheckCircle, FiXCircle, FiSearch, FiCheck, FiX, FiRefreshCw, FiCompass
} from 'react-icons/fi';

export default function AdminExploreManagerPage() {
  const [activeTab, setActiveTab] = useState('places'); // 'cities' | 'places' | 'featured'
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');

  // Modal States
  const [showCityModal, setShowCityModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [cityForm, setCityForm] = useState({ name: '', state: 'Bihar', desc: '', isActive: true });
  const [placeForm, setPlaceForm] = useState({
    cityId: 'gaya',
    region: 'city',
    title: '',
    category: 'historical',
    desc: '',
    longDesc: '',
    image: '',
    location: '',
    googleMapsUrl: '',
    isFeaturedHomepage: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/explore/public');
      const data = await res.json();
      if (data.success) {
        setCities(data.cities || []);
        setPlaces(data.places || []);
      }
    } catch (err) {
      console.error('Error loading explore data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered places
  const filteredPlaces = places.filter(p => {
    const matchesCity = selectedCityFilter === 'all' || p.cityId === selectedCityFilter;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const homepageFeaturedPlaces = places.filter(p => p.isFeaturedHomepage);

  // City Handlers
  const handleSaveCity = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingCity ? `/api/admin/explore/cities/${editingCity._id}` : '/api/admin/explore/cities';
      const method = editingCity ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cityForm)
      });
      const data = await res.json();

      if (data.success) {
        setShowCityModal(false);
        setEditingCity(null);
        setCityForm({ name: '', state: 'Bihar', desc: '', isActive: true });
        fetchData();
      } else {
        alert(data.message || 'Failed to save city');
      }
    } catch (err) {
      alert('Error saving city');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCityActive = async (city) => {
    try {
      const res = await fetch(`/api/admin/explore/cities/${city._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !city.isActive })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Toggle city failed:', err);
    }
  };

  const handleDeleteCity = async (id) => {
    if (!confirm('Are you sure you want to delete this city?')) return;
    try {
      const res = await fetch(`/api/admin/explore/cities/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      alert('Error deleting city');
    }
  };

  // Place Handlers
  const handleSavePlace = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingPlace ? `/api/admin/explore/places/${editingPlace._id}` : '/api/admin/explore/places';
      const method = editingPlace ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeForm)
      });
      const data = await res.json();

      if (data.success) {
        setShowPlaceModal(false);
        setEditingPlace(null);
        setPlaceForm({
          cityId: cities[0]?.cityId || 'gaya',
          region: 'city',
          title: '',
          category: 'historical',
          desc: '',
          longDesc: '',
          image: '',
          location: '',
          googleMapsUrl: '',
          isFeaturedHomepage: false
        });
        fetchData();
      } else {
        alert(data.message || 'Failed to save place');
      }
    } catch (err) {
      alert('Error saving place');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleHomepageFeatured = async (place) => {
    try {
      const res = await fetch(`/api/admin/explore/places/${place._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeaturedHomepage: !place.isFeaturedHomepage })
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      console.error('Toggle featured failed:', err);
    }
  };

  const handleDeletePlace = async (id) => {
    if (!confirm('Are you sure you want to delete this place?')) return;
    try {
      const res = await fetch(`/api/admin/explore/places/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      alert('Error deleting place');
    }
  };

  const openEditPlaceModal = (place) => {
    setEditingPlace(place);
    setPlaceForm({
      cityId: place.cityId,
      region: place.region || 'city',
      title: place.title,
      category: place.category,
      desc: place.desc,
      longDesc: place.longDesc || place.desc,
      image: place.image,
      location: place.location,
      googleMapsUrl: place.googleMapsUrl || '',
      isFeaturedHomepage: place.isFeaturedHomepage || false
    });
    setShowPlaceModal(true);
  };

  const openEditCityModal = (city) => {
    setEditingCity(city);
    setCityForm({
      name: city.name,
      state: city.state || 'Bihar',
      desc: city.desc || '',
      isActive: city.isActive !== undefined ? city.isActive : true
    });
    setShowCityModal(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto font-inter">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            <FiCompass className="w-3.5 h-3.5" /> Content Management System
          </div>
          <h1 className="text-2xl md:text-4xl font-black font-sora tracking-tight">Explore Cities & Famous Places CMS</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Manage cities, famous places, categories, image URLs, and homepage featured heritage cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition border border-slate-700"
            title="Refresh Data"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
          
          <button
            onClick={() => {
              setEditingPlace(null);
              setPlaceForm({
                cityId: cities[0]?.cityId || 'gaya',
                region: 'city',
                title: '',
                category: 'historical',
                desc: '',
                longDesc: '',
                image: '',
                location: '',
                googleMapsUrl: '',
                isFeaturedHomepage: false
              });
              setShowPlaceModal(true);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" /> Add Famous Place
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('places')}
          className={`px-6 py-3 font-black text-xs rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'places' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FiMapPin /> Famous Places ({places.length})
        </button>

        <button
          onClick={() => setActiveTab('cities')}
          className={`px-6 py-3 font-black text-xs rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cities' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FiGlobe /> Manage Cities ({cities.length})
        </button>

        <button
          onClick={() => setActiveTab('featured')}
          className={`px-6 py-3 font-black text-xs rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'featured' 
              ? 'bg-amber-600 text-white shadow-md' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FiStar className="text-amber-300" /> Homepage Featured Top 4 ({homepageFeaturedPlaces.length})
        </button>
      </div>

      {/* =========================================
          TAB 1: FAMOUS PLACES MANAGER
         ========================================= */}
      {activeTab === 'places' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter City:</span>
              <select 
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">All Cities</option>
                {cities.map(c => (
                  <option key={c.cityId} value={c.cityId}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Places Table / Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map(place => (
              <div key={place._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                
                {/* Thumbnail */}
                <div className="h-44 w-full relative bg-slate-900">
                  <img src={place.image} alt={place.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  
                  <span className="absolute top-3 left-3 bg-white/90 text-slate-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                    {place.cityId}
                  </span>

                  <button
                    onClick={() => handleToggleHomepageFeatured(place)}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md text-xs font-bold flex items-center gap-1 ${
                      place.isFeaturedHomepage 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                    title={place.isFeaturedHomepage ? 'Featured on Homepage' : 'Click to Feature on Homepage'}
                  >
                    <FiStar className={place.isFeaturedHomepage ? 'fill-slate-950' : ''} />
                    {place.isFeaturedHomepage && <span className="text-[10px] font-black">Featured</span>}
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base font-sora">{place.title}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mt-1">{place.desc}</p>
                    <span className="text-[11px] font-bold text-amber-700 mt-2 block flex items-center gap-1">
                      <FiMapPin className="w-3 h-3 text-amber-600" /> {place.location}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => openEditPlaceModal(place)}
                      className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1"
                    >
                      <FiEdit2 /> Edit
                    </button>

                    <button 
                      onClick={() => handleDeletePlace(place._id)}
                      className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 2: CITIES MANAGER
         ========================================= */}
      {activeTab === 'cities' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-slate-800 text-base font-sora">Registered Cities List</h2>
            <button
              onClick={() => {
                setEditingCity(null);
                setCityForm({ name: '', state: 'Bihar', desc: '', isActive: true });
                setShowCityModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
            >
              <FiPlus /> Add New City
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map(city => (
              <div key={city._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-xl font-sora text-slate-900">{city.name}</h3>
                    <button 
                      onClick={() => handleToggleCityActive(city)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        city.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {city.isActive ? 'Active' : 'Coming Soon'}
                    </button>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{city.state}</span>
                  <p className="text-slate-500 text-xs">{city.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button onClick={() => openEditCityModal(city)} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1">
                    <FiEdit2 /> Edit
                  </button>

                  <button onClick={() => handleDeleteCity(city._id)} className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================
          TAB 3: HOMEPAGE FEATURED TOP 4 PREVIEW
         ========================================= */}
      {activeTab === 'featured' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-6 rounded-3xl space-y-1">
            <h3 className="font-extrabold text-lg font-sora flex items-center gap-2">
              <FiStar className="fill-amber-500 text-amber-600" /> Homepage Featured Heritage Cards
            </h3>
            <p className="text-xs font-medium leading-relaxed">
              These 4 places are currently selected to appear on the main Homepage Explore section. You can toggle the star icon on any place to feature or remove it from the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepageFeaturedPlaces.map(place => (
              <div key={place._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
                <div className="h-44 w-full relative bg-slate-900">
                  <img src={place.image} alt={place.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 text-base">{place.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">{place.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CITY MODAL */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6">
            <h3 className="font-extrabold text-xl font-sora text-slate-900">
              {editingCity ? 'Edit City' : 'Add New City'}
            </h3>

            <form onSubmit={handleSaveCity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City Name</label>
                <input 
                  type="text" 
                  required
                  value={cityForm.name} 
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  placeholder="e.g. Patna, Nalanda, Rajgir"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                <input 
                  type="text" 
                  value={cityForm.state} 
                  onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={cityForm.desc} 
                  onChange={(e) => setCityForm({ ...cityForm, desc: e.target.value })}
                  placeholder="Short overview of the city..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="isActiveCity"
                  checked={cityForm.isActive}
                  onChange={(e) => setCityForm({ ...cityForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
                <label htmlFor="isActiveCity" className="text-xs font-bold text-slate-700">Set Active on Explore Directory</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCityModal(false)} className="px-5 py-2.5 font-bold text-xs text-slate-500 hover:text-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow">
                  {submitting ? 'Saving...' : 'Save City'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLACE MODAL */}
      {showPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8">
            <h3 className="font-extrabold text-xl font-sora text-slate-900">
              {editingPlace ? 'Edit Famous Place' : 'Add New Famous Place'}
            </h3>

            <form onSubmit={handleSavePlace} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target City</label>
                  <select
                    value={placeForm.cityId}
                    onChange={(e) => setPlaceForm({ ...placeForm, cityId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                  >
                    {cities.map(c => (
                      <option key={c.cityId} value={c.cityId}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Region Category</label>
                  <select
                    value={placeForm.region}
                    onChange={(e) => setPlaceForm({ ...placeForm, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                  >
                    <option value="city">District Main Spot</option>
                    <option value="nearby">Nearby Attraction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Place Title</label>
                <input 
                  type="text" 
                  required
                  value={placeForm.title} 
                  onChange={(e) => setPlaceForm({ ...placeForm, title: e.target.value })}
                  placeholder="e.g. Kakolat Waterfall, Mahabodhi Temple"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Type Category</label>
                  <select
                    value={placeForm.category}
                    onChange={(e) => setPlaceForm({ ...placeForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                  >
                    <option value="temples">Temples & Shrines</option>
                    <option value="historical">Historical & Heritage</option>
                    <option value="hills">Hills & Waterfalls</option>
                    <option value="malls">Malls & Markets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location Text</label>
                  <input 
                    type="text" 
                    required
                    value={placeForm.location} 
                    onChange={(e) => setPlaceForm({ ...placeForm, location: e.target.value })}
                    placeholder="e.g. Govindpur, Nawada"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input 
                  type="text" 
                  required
                  value={placeForm.image} 
                  onChange={(e) => setPlaceForm({ ...placeForm, image: e.target.value })}
                  placeholder="Direct image URL or /images/gaya/mahabodhi.png"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Short Description</label>
                <textarea 
                  rows={2}
                  required
                  value={placeForm.desc} 
                  onChange={(e) => setPlaceForm({ ...placeForm, desc: e.target.value })}
                  placeholder="Summary shown on place cards..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Detailed Guide</label>
                <textarea 
                  rows={3}
                  value={placeForm.longDesc} 
                  onChange={(e) => setPlaceForm({ ...placeForm, longDesc: e.target.value })}
                  placeholder="Full historical details shown inside popup guide..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input 
                  type="checkbox"
                  id="isFeaturedHomepage"
                  checked={placeForm.isFeaturedHomepage}
                  onChange={(e) => setPlaceForm({ ...placeForm, isFeaturedHomepage: e.target.checked })}
                  className="w-4 h-4 accent-amber-600"
                />
                <label htmlFor="isFeaturedHomepage" className="text-xs font-extrabold text-amber-900">
                  ⭐ Feature on Main Homepage (Top 4 Cards)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowPlaceModal(false)} className="px-5 py-2.5 font-bold text-xs text-slate-500 hover:text-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition shadow">
                  {submitting ? 'Saving...' : 'Save Place'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
