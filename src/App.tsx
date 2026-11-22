import { Suspense, useEffect, memo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { HeaderProvider } from './context/HeaderContext';
import { PaymentProvider } from './context/PaymentContext';
import { PointsProvider } from './context/PointsContext';
import { ProductDataProvider } from './context/ProductDataContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './components/ui/ToastProvider';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CanonicalPathRedirect from './components/seo/CanonicalPathRedirect';
import RouteSeo from './components/seo/RouteSeo';
import CustomCursor from './components/ui/CustomCursor';

// TEMP (to fix live blank page): remove route-level lazy() so Rollup can't create a circular
// `vendor <-> react-vendor` chunk graph that crashes at runtime on some hosts.
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import NewArrivalsPage from './pages/NewArrivalsPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminPortalDashboard from './pages/admin/AdminPortalDashboard';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import SupportPage from './pages/SupportPage';
import DesignBriefPage from './pages/DesignBriefPage';
import AdminTicketsPage from './pages/admin/AdminTicketsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminEmailPage from './pages/admin/AdminEmailPage';
import AdminSubscribersPage from './pages/admin/AdminSubscribersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LookbookPage from './pages/LookbookPage';
import ReviewsPage from './pages/ReviewsPage';
import ClientCenter from './pages/ClientCenter';
import VirtualStylistPage from './pages/VirtualStylistPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import EnhancedCheckoutPage from './pages/EnhancedCheckoutPage';
import PrintingHubPage from './pages/PrintingHubPage';
import PrintingLocationPage from './pages/PrintingLocationPage';
import PrintingServicePage from './pages/PrintingServicePage';

// Optimized loading fallback component - memoized to prevent re-renders
const PageLoader = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="flex flex-col items-center space-y-6">
      <LoadingSpinner
        variant="default"
        size="xl"
        color="white"
        text=""
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider mb-2">
          SKIPAMAN
        </h2>
        <p className="text-sm text-gray-400 uppercase tracking-wider">
          Loading page...
        </p>
      </motion.div>
    </div>
  </div>
));
PageLoader.displayName = 'PageLoader';

const AppShell = () => (
  <>
    <CanonicalPathRedirect />
    <RouteSeo />
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  </>
);

const AdminPortalShell = () => (
  <>
    <CanonicalPathRedirect />
    <RouteSeo />
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  </>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route element={<AppShell />}>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/lookbook" element={<LookbookPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/custom-design" element={<Navigate to="/virtual-stylist" replace />} />
      <Route path="/virtual-stylist" element={<VirtualStylistPage />} />
      <Route path="/printing" element={<PrintingHubPage />} />
      <Route path="/locations/:slug" element={<PrintingLocationPage />} />
      <Route path="/services/:slug" element={<PrintingServicePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route
        path="/design-brief"
        element={
          <ProtectedRoute>
            <DesignBriefPage />
          </ProtectedRoute>
        }
      />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/admin/login" element={<LoginForm redirectTo="/admin" showAdminButton={false} adminPortal />} />

      {/* Payment Routes */}
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />
      <Route path="/checkout" element={<EnhancedCheckoutPage />} />

      {/* Protected Routes */}
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <OrderTrackingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client-center"
        element={
          <ProtectedRoute>
            <ClientCenter />
          </ProtectedRoute>
        }
      />
      <Route path="/csm" element={<Navigate to="/admin/tickets" replace />} />

      {/* 404 Catch-all route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-6xl font-black text-white mb-4">404</h1>
              <p className="text-xl text-gray-400 mb-8">Page not found</p>
              <button
                onClick={() => (window.location.href = '/')}
                className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        }
      />
    </Route>

    <Route path="/admin" element={<AdminPortalShell />}>
      <Route index element={<AdminPortalDashboard />} />
      <Route path="orders" element={<AdminOrdersPage />} />
      <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
      <Route path="tickets" element={<AdminTicketsPage />} />
      <Route path="subscribers" element={<AdminSubscribersPage />} />
      <Route path="reviews" element={<AdminReviewsPage />} />
      <Route path="announcements" element={<AdminAnnouncementsPage />} />
      <Route path="analytics" element={<AdminAnalyticsPage />} />
      <Route path="design-requests" element={<Navigate to="/admin/tickets?tab=design" replace />} />
      <Route path="email" element={<AdminEmailPage />} />
      <Route path="csm" element={<Navigate to="/admin/tickets" replace />} />
    </Route>
    </>,
  ),
  {
    // TS note: some react-router-dom versions ship future flags before the typings.
    // We still enable them at runtime to remove the console warnings.
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    } as unknown as Record<string, boolean>,
  },
);

function App() {
  // Remove HTML loading screen immediately when React app loads
  useEffect(() => {
    const removeLoadingScreen = () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        // Force remove with multiple methods
        loadingScreen.style.display = 'none';
        loadingScreen.remove();
      }
      // Also add CSS class to body as backup
      document.body.classList.add('app-loaded');
      // Force hide with CSS
      const style = document.createElement('style');
      style.textContent = '#loading-screen { display: none !important; }';
      document.head.appendChild(style);
    };

    // Remove immediately - no need to wait
    removeLoadingScreen();

    // Also remove on window load as backup
    window.addEventListener('load', removeLoadingScreen);

    return () => {
      window.removeEventListener('load', removeLoadingScreen);
    };
  }, []);

  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <ProductDataProvider>
            <CartProvider>
              <PaymentProvider>
                <PointsProvider>
                  <HeaderProvider>
                    <WishlistProvider>
                      <ToastProvider>
                        <CustomCursor />
                        <RouterProvider router={router} />
                      </ToastProvider>
                    </WishlistProvider>
                  </HeaderProvider>
                </PointsProvider>
              </PaymentProvider>
            </CartProvider>
          </ProductDataProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;