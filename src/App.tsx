
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import WelcomePage from "./pages/WelcomePage";
import SignupPage from "./pages/SignupPage";
import ShopPage from "./pages/ShopPage";
import ClothingPage from "./pages/ClothingPage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from "./pages/ProductPage";
import LiveStreamPage from "./pages/LiveStreamPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import PlayPage from "./pages/PlayPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import MobileLandingPage from "./pages/MobileLandingPage";
import KeinLivePage from "./pages/KeinLivePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/m" element={<MobileLandingPage />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<ShopPage />} />
        <Route path="/shop/clothing" element={<ClothingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/livestream/:id" element={<LiveStreamPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/seller" element={<SellerDashboardPage />} />
        <Route path="/kein-live" element={<KeinLivePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
