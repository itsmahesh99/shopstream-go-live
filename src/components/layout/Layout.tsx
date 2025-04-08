
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

const Layout = () => {
  const location = useLocation();
  const isPlayFeedPage = location.pathname === "/play/feed";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isPlayFeedPage && <Navbar />}
      <main className={`flex-grow ${!isPlayFeedPage ? 'pb-16' : ''}`}>
        <Outlet />
      </main>
      {!isPlayFeedPage && <BottomNav />}
    </div>
  );
};

export default Layout;
