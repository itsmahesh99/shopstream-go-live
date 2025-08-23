
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CustomerLayout from "./components/layout/CustomerLayout";
import InfluencerLayout from "./components/layout/InfluencerLayout";
import WholesalerLayout from "./components/layout/WholesalerLayout";
import Index from "./pages/Index";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleBasedRedirect from "./components/common/RoleBasedRedirect";

// Lazy load authentication pages
const CustomerSignupPage = React.lazy(() => import("./pages/CustomerSignupPage"));
const WholesalerSignupPage = React.lazy(() => import("./pages/WholesalerSignupPage"));
const InfluencerSignupPage = React.lazy(() => import("./pages/InfluencerSignupPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));

// Lazy load dashboard pages
const CustomerDashboard = React.lazy(() => import("./pages/CustomerDashboard"));
const WholesalerDashboard = React.lazy(() => import("./pages/WholesalerDashboard"));
const InfluencerDashboard = React.lazy(() => import("./pages/InfluencerDashboard"));

// Lazy load influencer pages
const InfluencerDashboardMain = React.lazy(() => import("./pages/influencer/InfluencerDashboardMain"));
const InfluencerLiveManagement = React.lazy(() => import("./pages/influencer/InfluencerLiveManagement"));

// Lazy load shop pages
const ShopPage = React.lazy(() => import("./pages/ShopPage"));
const ClothingPage = React.lazy(() => import("./pages/ClothingPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));

// Lazy load live streaming pages
const LiveStreamPage = React.lazy(() => import("./pages/LiveStreamPage"));
const PlayPage = React.lazy(() => import("./pages/PlayPage"));
const PlayFeedPage = React.lazy(() => import("./pages/PlayFeedPage"));
const KeinLivePage = React.lazy(() => import("./pages/KeinLivePage"));

// Lazy load other pages
const ReelsPage = React.lazy(() => import("./pages/ReelsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const SellerDashboardPage = React.lazy(() => import("./pages/SellerDashboardPage"));
const MobileLandingPage = React.lazy(() => import("./pages/MobileLandingPage"));
const AccountSettingsPage = React.lazy(() => import("./pages/AccountSettingsPage"));
const AuthDemoPage = React.lazy(() => import("./pages/AuthDemoPage"));
const SupabaseTestPage = React.lazy(() => import("./pages/SupabaseTestPage"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing and Welcome Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/m" element={<MobileLandingPage />} />
          
          {/* Authentication Routes */}
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false}>
                <CustomerSignupPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup/wholesaler" 
            element={<WholesalerSignupPage />} 
          />
          <Route 
            path="/signup/influencer" 
            element={<InfluencerSignupPage />} 
          />
          <Route 
            path="/signup/customer" 
            element={
              <ProtectedRoute requireAuth={false}>
                <CustomerSignupPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPasswordPage />
              </ProtectedRoute>
            } 
          />

          {/* Role-Based Dashboard Routes */}
          
          {/* Customer Routes - Public shopping experience */}
          <Route element={<CustomerLayout />}>
            <Route 
              path="/home" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shop" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ReelsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shop/browse" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ShopPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shop/clothing" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ClothingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ProductPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <WishlistPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/play" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <PlayPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/play/feed" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <PlayFeedPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <AccountSettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <SearchPage />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Influencer Routes - Creator dashboard */}
          <Route element={<InfluencerLayout />}>
            <Route 
              path="/influencer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <InfluencerDashboardMain />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/live" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <InfluencerLiveManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/schedule" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <div className="p-6">Schedule Management - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/analytics" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <div className="p-6">Analytics Dashboard - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/audience" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <div className="p-6">Audience Management - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/earnings" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <div className="p-6">Earnings Dashboard - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/settings" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <div className="p-6">Settings - Coming Soon</div>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Wholesaler Routes - Business dashboard (ON HOLD as requested) */}
          <Route element={<WholesalerLayout />}>
            <Route 
              path="/wholesaler/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['wholesaler']}>
                  <div className="p-6">
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">Wholesaler Dashboard</h1>
                      <p className="text-gray-600">This feature is currently under development.</p>
                      <p className="text-sm text-gray-500 mt-2">Please check back soon for updates.</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Legacy routes and shared features */}
          <Route element={<Layout />}>
            <Route 
              path="/livestream/:id" 
              element={<LiveStreamPage />} 
            />
            <Route 
              path="/kein-live" 
              element={<KeinLivePage />} 
            />
            <Route 
              path="/seller" 
              element={
                <ProtectedRoute>
                  <SellerDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/auth-demo" 
              element={
                <ProtectedRoute>
                  <AuthDemoPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supabase-test" 
              element={<SupabaseTestPage />} 
            />
          </Route>

          {/* Fallback Routes */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <Toaster />
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
