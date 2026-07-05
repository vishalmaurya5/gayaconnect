import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './utils/protectedRoute';

import HomePage from './legacy-pages/user/HomePage';
import VendorsPage from './legacy-pages/user/VendorsPage';
import VendorDetailPage from './legacy-pages/user/VendorDetailPage';
import BookingPage from './legacy-pages/user/BookingPage';
import LoginPage from './legacy-pages/user/LoginPage';
import RegisterPage from './legacy-pages/user/RegisterPage';
import ForgotPasswordPage from './legacy-pages/user/ForgotPasswordPage';
import ResetPasswordPage from './legacy-pages/user/ResetPasswordPage';
import CommunityPage from './legacy-pages/user/CommunityPage';

import VendorDashboard from './legacy-pages/vendor/VendorDashboard';
import VendorProfile from './legacy-pages/vendor/VendorProfile';
import VendorBookings from './legacy-pages/vendor/VendorBookings';
import VendorAnalytics from './legacy-pages/vendor/VendorAnalytics';
import VendorPayment from './legacy-pages/vendor/VendorPayment';

import Sidebar from './legacy-pages/admin/components/Sidebar';
import AdminDashboard from './legacy-pages/admin/AdminDashboard';
import AdminVendors from './legacy-pages/admin/AdminVendors';
import AdminUsers from './legacy-pages/admin/AdminUsers';
import AdminBanners from './legacy-pages/admin/AdminBanners';
import AdminCategories from './legacy-pages/admin/AdminCategories';
import AdminBookings from './legacy-pages/admin/AdminBookings';
import AdminPayments from './legacy-pages/admin/AdminPayments';
import AdminAnalytics from './legacy-pages/admin/AdminAnalytics';
import AdminSettings from './legacy-pages/admin/AdminSettings';

const AdminLayout = ({ children }) => (
  <div className="lg:flex">
    <Sidebar />
    <main className="flex-1 p-4">{children}</main>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6 min-h-[70vh]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/vendors/:slug" element={<VendorDetailPage />} />
            <Route path="/booking" element={<ProtectedRoute roles={['user', 'admin']}><BookingPage /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute roles={['user', 'admin']}><CommunityPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

            <Route path="/vendor/dashboard" element={<ProtectedRoute roles={['vendor', 'admin']}><VendorDashboard /></ProtectedRoute>} />
            <Route path="/vendor/profile" element={<ProtectedRoute roles={['vendor', 'admin']}><VendorProfile /></ProtectedRoute>} />
            <Route path="/vendor/bookings" element={<ProtectedRoute roles={['vendor', 'admin']}><VendorBookings /></ProtectedRoute>} />
            <Route path="/vendor/analytics" element={<ProtectedRoute roles={['vendor', 'admin']}><VendorAnalytics /></ProtectedRoute>} />
            <Route path="/vendor/payment" element={<ProtectedRoute roles={['vendor', 'admin']}><VendorPayment /></ProtectedRoute>} />

            <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/vendors" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminVendors /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/banners" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminBanners /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminBookings /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminAnalytics /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
