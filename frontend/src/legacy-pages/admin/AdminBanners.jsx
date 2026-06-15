import { useEffect, useState } from 'react';
import { fetchActiveBanners } from '../../services/bannerService';
import BannerManager from './components/BannerManager';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  useEffect(() => { fetchActiveBanners().then(setBanners); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Banner Management</h1>
      <BannerManager banners={banners} />
    </div>
  );
}
