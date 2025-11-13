import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { HeaderProvider } from './context/HeaderContext';
import { PaymentProvider } from './context/PaymentContext';
import { PointsProvider } from './context/PointsContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const About = lazy(() => import('./pages/About'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard') as Promise<{ default: React.ComponentType<unknown> }>);
const LoginForm = lazy(() => import('./assets/cart/LoginForm'));
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CustomDesignPage = lazy(() => import('./pages/EnhancedCustomDesignPage'));
const LookbookPage = lazy(() => import('./pages/LookbookPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const ClientCenter = lazy(() => import('./pages/ClientCenter'));
const CSMDashboard = lazy(() => import('./pages/CSMDashboard'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentCancel = lazy(() => import('./pages/PaymentCancel'));
const EnhancedCheckoutPage = lazy(() => import('./pages/EnhancedCheckoutPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <LoadingSpinner
      variant="gradient"
      size="xl"
      color="purple"
      text="Loading page..."
    />
  </div>
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

  return (
    <AuthProvider>
      <CartProvider>
        <PaymentProvider>
          <PointsProvider>
            <HeaderProvider>
              <WishlistProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <Layout>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/lookbook" element={<LookbookPage />} />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/custom-design" element={<CustomDesignPage />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    
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
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/csm" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <CSMDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    </Routes>
                  </Suspense>
                </Layout>
              </Router>
            </WishlistProvider>
            </HeaderProvider>
          </PointsProvider>
        </PaymentProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;