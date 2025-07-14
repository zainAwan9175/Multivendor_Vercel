"use client"
import { AiOutlineLogin, AiOutlineMessage, AiOutlineCreditCard } from "react-icons/ai"
import { RiLockPasswordLine } from "react-icons/ri"
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi"
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md"
import { TbAddressBook } from "react-icons/tb"
import { RxPerson } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

const emerald = "#059669";
const amber = "#f59e42";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const logoutHandler = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message)
        navigate("/login")
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const sidebarItems = [
    {
      key: 1,
      icon: <RxPerson size={22} color={active === 1 ? emerald : "#555"} />,
      label: "Profile",
      onClick: () => setActive(1),
    },
    {
      key: 2,
      icon: <HiOutlineShoppingBag size={22} color={active === 2 ? emerald : "#555"} />,
      label: "Orders",
      onClick: () => setActive(2),
    },
    {
      key: 3,
      icon: <HiOutlineReceiptRefund size={22} color={active === 3 ? emerald : "#555"} />,
      label: "Refunds",
      onClick: () => setActive(3),
    },
    {
      key: 4,
      icon: <AiOutlineMessage size={22} color={active === 4 ? emerald : "#555"} />,
      label: "Inbox",
      onClick: () => setActive(4) || navigate("/inbox"),
    },
    {
      key: 5,
      icon: <MdOutlineTrackChanges size={22} color={active === 5 ? emerald : "#555"} />,
      label: "Track Order",
      onClick: () => setActive(5),
    },
    {
      key: 6,
      icon: <RiLockPasswordLine size={22} color={active === 6 ? emerald : "#555"} />,
      label: "Change Password",
      onClick: () => setActive(6),
    },
    
    {
      key: 8,
      icon: <TbAddressBook size={22} color={active === 8 ? emerald : "#555"} />,
      label: "Address",
      onClick: () => setActive(8),
    },
  ];

  return (
    <div className="w-[70px] md:w-[240px] bg-white shadow-lg rounded-2xl p-4 pt-8 transition-all duration-300">
      <div className="flex flex-col space-y-2">
        {sidebarItems.map((item) => (
          <div
            key={item.key}
            onClick={item.onClick}
            className={`flex items-center gap-3 cursor-pointer w-full p-2 rounded-xl transition-all font-medium select-none
              ${active === item.key
                ? "bg-emerald-50 border-l-4 border-amber-400 text-emerald-700 shadow"
                : "hover:bg-amber-50 hover:text-emerald-700"}
            `}
            style={{
              background: active === item.key ? "linear-gradient(90deg, #fefce8 0%, #d1fae5 100%)" : undefined,
            }}
          >
            {item.icon}
            <span className={`pl-1 ${active === item.key ? "text-emerald-700 font-semibold" : "text-gray-700"} hidden md:block`}>{item.label}</span>
          </div>
        ))}

        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <div
              className={`flex items-center gap-3 cursor-pointer w-full p-2 rounded-xl transition-all font-medium select-none
                ${active === 9
                  ? "bg-emerald-50 border-l-4 border-amber-400 text-emerald-700 shadow"
                  : "hover:bg-amber-50 hover:text-emerald-700"}
              `}
              style={{
                background: active === 9 ? "linear-gradient(90deg, #fefce8 0%, #d1fae5 100%)" : undefined,
              }}
              onClick={() => setActive(9)}
            >
              <MdOutlineAdminPanelSettings size={22} color={active === 9 ? emerald : "#555"} />
              <span className={`pl-1 ${active === 9 ? "text-emerald-700 font-semibold" : "text-gray-700"} hidden md:block`}>
                Admin Dashboard
              </span>
            </div>
          </Link>
        )}

        <div
          className="flex items-center gap-3 cursor-pointer w-full p-2 rounded-xl transition-all font-medium select-none mt-4 border-t pt-4 hover:bg-amber-50 hover:text-emerald-700"
          onClick={logoutHandler}
        >
          <AiOutlineLogin size={22} color={"#e11d48"} />
          <span className="pl-1 text-rose-600 font-semibold hidden md:block">Log out</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidebar
