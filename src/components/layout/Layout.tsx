
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

const Layout = () => {
  const location = useLocation();
  const isPlayFeedPage = location.pathname === "/play/feed";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isPlayFeedPage && <Navbar />}
      <main className={`flex-grow ${!isPlayFeedPage ? 'pb-16 md:pb-0' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      {!isPlayFeedPage && (
        <>
          <Footer />
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Layout;
