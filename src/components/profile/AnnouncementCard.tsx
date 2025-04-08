
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnnouncementCard = () => {
  return (
    <div className="px-4 mt-4 mb-4">
      <div className="bg-[#E5F0F9] rounded-lg px-4 py-3 flex items-start justify-between">
        <div>
          <h3 className="font-medium text-sm">Announcement</h3>
          <p className="text-xs text-gray-600 mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt labore et dolore
          </p>
        </div>
        <Button size="icon" variant="ghost" className="h-5 w-5 text-gray-400">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
