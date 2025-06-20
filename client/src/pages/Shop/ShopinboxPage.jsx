import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashBoardMessages from "../../components/Shop/DashBoardMessages";
const ShopInboxPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className=" w-[300px]">
          <DashboardSideBar active={8} />
        </div>
        <DashBoardMessages />
      </div>
    </div>
  );
};

export default ShopInboxPage;