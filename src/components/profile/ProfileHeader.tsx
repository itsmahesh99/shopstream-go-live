
import React from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: {
    name: string;
    image: string;
  };
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const { toast } = useToast();
  
  const handleBecomeSeller = () => {
    toast({
      title: "Become a seller",
      description: "Taking you to the seller onboarding page",
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white">
      <div className="flex items-center">
        <img
          src={user.image}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover mr-3"
        />
        <h1 className="text-xl font-bold">Hello, {user.name}!</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button 
          variant="outline"
          size="sm"
          className="border-[#003366] text-[#003366] h-8"
          onClick={handleBecomeSeller}
        >
          Become seller
        </Button>
        <Link to="/settings" className="text-gray-500">
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;
