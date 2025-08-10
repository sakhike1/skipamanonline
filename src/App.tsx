import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { HeaderProvider } from './context/HeaderContext';
import { ProfileProvider } from './context/ProfileContext';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
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
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const RegisterForm = lazy(() => import('./components/auth/RegisterForm'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const DemoAuthPage = lazy(() => import('./pages/DemoAuthPage'));

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
  return (
    <AuthProvider>
      <ProfileProvider>
        <OrderProvider>
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
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
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
        </OrderProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;