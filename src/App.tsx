
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CustomerLayout from "./components/layout/CustomerLayout";
import InfluencerLayout from "./components/layout/InfluencerLayout";
import Index from "./pages/Index";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleBasedRedirect from "./components/common/RoleBasedRedirect";
import LiveStreamErrorBoundary from "./components/common/LiveStreamErrorBoundary";

// Lazy load authentication pages
const CustomerSignupPage = React.lazy(() => import("./pages/CustomerSignupPage"));
const InfluencerSignupPage = React.lazy(() => import("./pages/InfluencerSignupPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));
const AuthCallbackPage = React.lazy(() => import("./pages/AuthCallbackPage"));


// Lazy load admin pages
const AdminPanel = React.lazy(() => import("./pages/admin/AdminPanel"));
const AdminLogin = React.lazy(() => import("./pages/admin/AdminLogin"));
const AdminProtectedRoute = React.lazy(() => import("./components/admin/AdminProtectedRoute"));
const AdminLayout = React.lazy(() => import("./components/layout/AdminLayout"));

// Lazy load influencer pages
const InfluencerDashboardWrapper = React.lazy(() => import("./components/influencer/InfluencerDashboardWrapper"));
const InfluencerProfileCompletionPage = React.lazy(() => import("./pages/InfluencerProfileCompletionPage"));
const ProfileCompletionGuard = React.lazy(() => import("./components/influencer/ProfileCompletionGuard"));
const InfluencerLiveStreamPageNew = React.lazy(() => import("./pages/influencer/InfluencerLiveStreamPage"));
const InfluencerSchedule = React.lazy(() => import("./pages/influencer/InfluencerSchedule"));
const InfluencerSettings = React.lazy(() => import("./pages/influencer/InfluencerSettings"));
const InfluencerProfile = React.lazy(() => import("./pages/influencer/InfluencerProfile"));
const ProductCatalogManager = React.lazy(() => import("./components/product-catalog/ProductCatalogManager"));

// Lazy load shop pages
const ShopPage = React.lazy(() => import("./pages/ShopPage"));
const ClothingPage = React.lazy(() => import("./pages/ClothingPage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));

// Lazy load live streaming pages
const LiveStreamViewerPage = React.lazy(() => import("./pages/LiveStreamViewerPage"));
const PlayPage = React.lazy(() => import("./pages/PlayPage"));
const PlayFeedPage = React.lazy(() => import("./pages/PlayFeedPage"));
const KeinLivePage = React.lazy(() => import("./pages/KeinLivePage"));

// Lazy load other pages
const ReelsPage = React.lazy(() => import("./pages/ReelsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const SellerDashboardPage = React.lazy(() => import("./pages/SellerDashboardPage"));
const MobileLandingPage = React.lazy(() => import("./pages/MobileLandingPage"));
const AccountSettingsPage = React.lazy(() => import("./pages/AccountSettingsPage"));
const AuthDemoPage = React.lazy(() => import("./pages/AuthDemoPage"));
const SupabaseTestPage = React.lazy(() => import("./pages/SupabaseTestPage"));
const InfluencerTestPage = React.lazy(() => import("./pages/InfluencerTestPage"));
const LiveStreamTestPage = React.lazy(() => import("./pages/LiveStreamTestPage"));
const LiveStreamDemoPage = React.lazy(() => import("./pages/LiveStreamDemoPage"));

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
          <Route 
            path="/auth/callback" 
            element={<AuthCallbackPage />} 
          />

          {/* Role-Based Dashboard Routes */}
          
          {/* Customer Routes - Public shopping experience */}
          <Route element={<CustomerLayout />}>
            <Route 
              path="/home" 
              element={<HomePage />}
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
              path="/influencer/profile-completion" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <InfluencerProfileCompletionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <ProfileCompletionGuard>
                    <InfluencerDashboardWrapper />
                  </ProfileCompletionGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/live" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <ProfileCompletionGuard>
                    <LiveStreamErrorBoundary>
                      <InfluencerLiveStreamPageNew />
                    </LiveStreamErrorBoundary>
                  </ProfileCompletionGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/schedule" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <ProfileCompletionGuard>
                    <InfluencerSchedule />
                  </ProfileCompletionGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/profile" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <ProfileCompletionGuard>
                    <InfluencerProfile />
                  </ProfileCompletionGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/settings" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <ProfileCompletionGuard>
                    <InfluencerSettings />
                  </ProfileCompletionGuard>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/influencer/products" 
              element={
                <ProtectedRoute allowedRoles={['influencer']}>
                  <ProfileCompletionGuard>
                    <ProductCatalogManager />
                  </ProfileCompletionGuard>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Legacy routes and shared features */}
          <Route element={<Layout />}>
            <Route 
              path="/livestream/:id" 
              element={<LiveStreamViewerPage />} 
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
            <Route 
              path="/influencer-test" 
              element={<InfluencerTestPage />} 
            />
            <Route 
              path="/live-stream-test" 
              element={<LiveStreamTestPage />} 
            />
            <Route 
              path="/live-stream-demo" 
              element={<LiveStreamDemoPage />} 
            />

          </Route>

          {/* Admin Routes - Separate layout without bottom navigation */}
          <Route element={<AdminLayout />}>
            <Route 
              path="/admin/login" 
              element={<AdminLogin />} 
            />
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <AdminPanel />
                </AdminProtectedRoute>
              } 
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
