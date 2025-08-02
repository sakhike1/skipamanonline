import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { HeaderProvider } from './context/HeaderContext';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages with preloading
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const About = lazy(() => import('./pages/About'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const DemoAuthPage = lazy(() => import('./pages/DemoAuthPage'));

// Optimized loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
  </div>
);

// Preload critical routes on app start
const preloadCriticalRoutes = () => {
  // Preload home page immediately
  import('./pages/HomePage');
  
  // Preload shop page after a short delay
  setTimeout(() => {
    import('./pages/ShopPage');
  }, 1000);
  
  // Preload auth pages after user interaction
  const preloadAuth = () => {
    import('./components/auth/LoginForm');
    import('./components/auth/RegisterForm');
    document.removeEventListener('click', preloadAuth);
  };
  
  document.addEventListener('click', preloadAuth, { once: true });
};

function App() {
  useEffect(() => {
    // Start preloading critical routes
    preloadCriticalRoutes();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <HeaderProvider>
            <LoadingScreen />
            <Router>
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
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/demo-auth" element={<DemoAuthPage />} />
                    
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
                      path="/checkout" 
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute roles={['admin']}>
                          <AdminPage />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </HeaderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;