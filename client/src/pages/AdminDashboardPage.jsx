import React from "react";
import AdminHeader from "../components/Admin/Layout/AdminHeader.jsx";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AdminDashBoardMain from "../components/Admin/Layout/AdminDashBoardMain.jsx";
const AdminDashboardPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="800px:w-[330px] w-[80px]">
          <AdminSidebar active={1} />
        </div>
        <AdminDashBoardMain />
      </div>
    </div>
  );
};

export default AdminDashboardPage;