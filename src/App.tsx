
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Lazy load authentication pages
const RoleSelectionPage = React.lazy(() => import("./pages/RoleSelectionPage"));
const CustomerSignupPage = React.lazy(() => import("./pages/CustomerSignupPage"));
const WholesalerSignupPage = React.lazy(() => import("./pages/WholesalerSignupPage"));
const InfluencerSignupPage = React.lazy(() => import("./pages/InfluencerSignupPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));

// Lazy load dashboard pages
const CustomerDashboard = React.lazy(() => import("./pages/CustomerDashboard"));
const WholesalerDashboard = React.lazy(() => import("./pages/WholesalerDashboard"));
const InfluencerDashboard = React.lazy(() => import("./pages/InfluencerDashboard"));

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
  <div className="min-h-screen flex items-center justify-center bg-white">
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
          <Route path="/" element={<Index />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false}>
                <RoleSelectionPage />
              </ProtectedRoute>
            } 
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
            path="/signup/wholesaler" 
            element={
              <ProtectedRoute requireAuth={false}>
                <WholesalerSignupPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup/influencer" 
            element={
              <ProtectedRoute requireAuth={false}>
                <InfluencerSignupPage />
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
          <Route path="/m" element={<MobileLandingPage />} />
          <Route path="/shop" element={<ReelsPage />} />
          
          {/* Role-based Dashboards */}
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wholesaler/dashboard" 
            element={
              <ProtectedRoute>
                <WholesalerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/influencer/dashboard" 
            element={
              <ProtectedRoute>
                <InfluencerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route element={<Layout />}>
            <Route 
              path="/home" 
              element={<HomePage />} 
            />
            <Route path="/shop/browse" element={<ShopPage />} />
            <Route path="/shop/clothing" element={<ClothingPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account-settings" 
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
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
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/livestream/:id" element={<LiveStreamPage />} />
            <Route 
              path="/wishlist" 
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/play/feed" element={<PlayFeedPage />} />
            <Route 
              path="/seller" 
              element={
                <ProtectedRoute>
                  <SellerDashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/kein-live" element={<KeinLivePage />} />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
          </Route>
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
