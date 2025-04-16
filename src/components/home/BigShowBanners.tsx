
import React from "react";
import { Link } from "react-router-dom";

const BigShowBanners: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/live/special1"
          className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
        >
          <h3 className="font-bold text-sm">BIG SHOW PART 2</h3>
          <p className="text-xs">Non Stop Givey's</p>
          <span className="text-xs text-gray-500">Electronics</span>
        </Link>
        
        <Link
          to="/search?tag=vintage"
          className="bg-gray-100 rounded-lg p-4 flex flex-col justify-between h-24"
        >
          <h3 className="font-bold text-sm">FS VINTAGE SWEATSHIRTS</h3>
          <p className="text-xs">Limited Collection</p>
          <span className="text-xs text-gray-500">Clothing</span>
        </Link>
      </div>
    </div>
  );
};

export default BigShowBanners;
