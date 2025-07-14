import React, { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar.jsx";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className={`${styles.section} flex bg-[#f5f5f5] py-12 items-start min-h-[80vh] gap-8`}>
            <div className="w-[70px] 800px:w-[240px] flex-shrink-0">
              <ProfileSideBar active={active} setActive={setActive} />
            </div>
            <div className="flex-1 z-10">
              <ProfileContent active={active} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;