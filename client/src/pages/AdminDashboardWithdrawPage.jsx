import React from "react";
import AdminHeader from "../components/Admin/Layout/AdminHeader.jsx";
import AdminSidebar from "../components/Admin/Layout/AdminSidebar";
import AllWithdraw from "../components/Admin/AllWithdraw";
const AdminDashboardWithdrawPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="800px:w-[330px] w-[80px]">
          <AdminSidebar active={7} />
        </div>
        <AllWithdraw />
      </div>
    </div>
  );
};

export default AdminDashboardWithdrawPage;