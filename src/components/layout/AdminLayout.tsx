import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;