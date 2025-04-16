
import React from "react";
import InfluencersRow from "@/components/home/InfluencersRow";
import LiveNowCarousel from "@/components/home/LiveNowCarousel";
import HeroCarousel from "@/components/home/HeroCarousel";
import LiveShoppingSection from "@/components/home/LiveShoppingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import BigShowBanners from "@/components/home/BigShowBanners";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import UpcomingShows from "@/components/home/UpcomingShows";

// Mock data
const influencers = [
  { id: "1", name: "Sophie Lin", image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png", isLive: true },
  { id: "2", name: "Alex Wang", image: "/lovable-uploads/9f9465c9-14a1-4b53-b185-257751bc97c5.png", isLive: true },
  { id: "3", name: "Art vintage", image: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png", isLive: false },
  { id: "4", name: "Mike Chen", image: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png", isLive: false },
  { id: "5", name: "Ryan Lee", image: "/lovable-uploads/0652f2bb-af03-464d-856b-32325f54b8c6.png", isLive: false },
];

const liveStreams = [
  {
    id: "1",
    title: "Tech Review - Latest smartphones",
    influencer: "Mike Chen",
    thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    viewCount: 2530,
    isLive: true,
  },
  {
    id: "2",
    title: "Women's Fashion Summer Collection",
    influencer: "Sophie Lin",
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    viewCount: 1845,
    isLive: true,
  },
];

const products = [
  {
    id: "1",
    title: "Women solid top and jeans",
    price: 999,
    discountPrice: 499,
    discountPercentage: 50,
    image: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    category: "Clothing"
  },
  {
    id: "2",
    title: "Premium headphones with noise cancellation",
    price: 2499,
    discountPrice: 1999,
    discountPercentage: 20,
    image: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    category: "Electronics"
  },
  {
    id: "3",
    title: "Stylish sunglasses UV protection",
    price: 1299,
    discountPrice: 999,
    discountPercentage: 23,
    image: "/lovable-uploads/521c827c-efca-4963-a702-e528830c.png",
    category: "Accessories"
  },
  {
    id: "4",
    title: "Casual summer dress floral pattern",
    price: 1499,
    discountPrice: 1199,
    discountPercentage: 20,
    image: "/lovable-uploads/d9b61dc1-74ba-423d-8b21-9e83e8e1ff97.png",
    category: "Clothing"
  },
];

const categories = [
  { id: "1", name: "Clothing", count: 359, image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png" },
  { id: "2", name: "Shoes", count: 230, image: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png" },
  { id: "3", name: "Bags", count: 87, image: "/lovable-uploads/2840b6e9-4e3c-4070-8eb6-13ed21836285.png" },
  { id: "4", name: "Lingerie", count: 218, image: "/lovable-uploads/1842d9df-d938-4f42-b696-292518197638.png" },
  { id: "5", name: "Watch", count: 234, image: "/lovable-uploads/5238184c-1188-4352-a959-30046823f005.png" },
  { id: "6", name: "Hoodies", count: 218, image: "/lovable-uploads/b919bc4e-ae0e-4d85-9cba-1168285b252c.png" },
  { id: "7", name: "Mobile phones", count: 87, image: "/lovable-uploads/5112d7a4-a073-42da-9f08-2f9ad3a1c2ce.png" },
  { id: "8", name: "Laptops", count: 218, image: "/lovable-uploads/7954c3c0-a433-4e95-9d0e-e746eb76a920.png" },
];

// Add more detailed live streams data for the carousel
const currentLiveStreams = [
  {
    id: "1",
    title: "Unboxing the latest iPhone Pro",
    influencer: "Mike Chen",
    influencerImage: "/lovable-uploads/a758d528-4f86-47ab-8952-b84d3f2e2b2c.png",
    thumbnail: "/lovable-uploads/7c48c057-d4b0-4193-9473-be6c8eee605c.png",
    viewCount: 2532,
    isLive: true,
  },
  {
    id: "2",
    title: "Summer Fashion Haul 2025",
    influencer: "Sophie Lin",
    influencerImage: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    thumbnail: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
    viewCount: 1845,
    isLive: true,
  },
  {
    id: "3",
    title: "Best Accessories under $50",
    influencer: "Emma Lou",
    influencerImage: "/lovable-uploads/bcb73b7f-2144-4a7d-aaca-a22c1dce107d.png",
    thumbnail: "/lovable-uploads/521c827c-efca-4963-a702-e528830c.png",
    viewCount: 1247,
    isLive: true,
  },
  {
    id: "4",
    title: "Vintage Clothing Collection",
    influencer: "Art vintage",
    influencerImage: "/lovable-uploads/4448d6cf-1254-4262-a2a2-cb90ffd97796.png",
    thumbnail: "/lovable-uploads/37fa901f-5b94-426f-ac68-07a4249941e7.png",
    viewCount: 958,
    isLive: true,
  },
];

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 pb-20">
      {/* Influencers scrollable row */}
      <InfluencersRow influencers={influencers} />
      
      {/* Welcome banner */}
      <h1 className="text-2xl font-bold mt-4 mb-4">Welcome to Kein!</h1>
      
      {/* Live Now carousel */}
      <LiveNowCarousel streams={currentLiveStreams} />
      
      {/* Hero carousel */}
      <HeroCarousel />
      
      {/* Live shopping section */}
      <LiveShoppingSection streams={liveStreams} />
      
      {/* Categories section */}
      <CategoriesSection categories={categories} />
      
      {/* Big show banners */}
      <BigShowBanners />
      
      {/* Featured products section */}
      <FeaturedProducts products={products} />
      
      {/* Upcoming show banners */}
      <UpcomingShows />
    </div>
  );
};

export default HomePage;
