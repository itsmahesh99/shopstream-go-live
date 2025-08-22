import React from "react";
import { useNavigate } from "react-router-dom";
import Reels from "@/components/shop/Reels";

const ReelsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black">
      <Reels onClose={handleClose} />
    </div>
  );
};

export default ReelsPage;
