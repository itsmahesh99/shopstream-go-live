
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import AnnouncementCard from "@/components/profile/AnnouncementCard";
import UserActivityMenu from "@/components/profile/UserActivityMenu";
import OrdersTabs from "@/components/profile/OrdersTabs";
import ServicesSection from "@/components/profile/ServicesSection";
import AboutSection from "@/components/profile/AboutSection";
import ProfileFooter from "@/components/profile/ProfileFooter";

// Mock data
const user = {
  name: "Romina",
  image: "/lovable-uploads/f8d1a83b-970d-4d3a-966a-e0e1deaddb20.png",
};

const ProfilePage = () => {
  return (
    <div className="pb-20 bg-gray-50">
      <ProfileHeader user={user} />
      <AnnouncementCard />
      <UserActivityMenu />
      <OrdersTabs />
      <ServicesSection />
      <AboutSection />
      <ProfileFooter />
    </div>
  );
};

export default ProfilePage;
