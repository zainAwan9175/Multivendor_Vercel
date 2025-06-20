"use client"
import { AiOutlineLogin, AiOutlineMessage, AiOutlineCreditCard } from "react-icons/ai" // Added AiOutlineCreditCard
import { RiLockPasswordLine } from "react-icons/ri"
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi"
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md"
import { TbAddressBook } from "react-icons/tb"
import { RxPerson } from "react-icons/rx"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)
  const logoutHandler = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message)
        // window.location.reload(true);
        navigate("/login")
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div className="w-[70px] md:w-[240px] bg-white shadow-md rounded-[10px] p-4 pt-8 transition-all duration-300">
      <div className="flex flex-col space-y-6">
        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 1 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(1)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <RxPerson size={20} color={active === 1 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 1 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Profile
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 2 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(2)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 2 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Orders
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 3 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(3)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 3 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Refunds
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 4 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(4) || navigate("/inbox")}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <AiOutlineMessage size={20} color={active === 4 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 4 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Inbox
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 5 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(5)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 5 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Track Order
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 6 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(6)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <RiLockPasswordLine size={20} color={active === 6 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 6 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Change Password
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 7 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(7)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <AiOutlineCreditCard size={20} color={active === 7 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 7 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Payment Method
            </span>
          </div>
        </div>

        <div
          className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 8 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
          onClick={() => setActive(8)}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <TbAddressBook size={20} color={active === 8 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 8 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Address
            </span>
          </div>
        </div>

        {user && user?.role === "Admin" && (
          <Link to="/admin/dashboard">
            <div
              className={`flex items-center cursor-pointer w-full p-2 rounded-md transition-all ${active === 9 ? "bg-gray-100 text-[red]" : "hover:bg-gray-50"}`}
              onClick={() => setActive(9)}
            >
              <div className="flex justify-center md:justify-start w-full md:w-auto">
                <MdOutlineAdminPanelSettings size={20} color={active === 9 ? "red" : "#555"} />
                <span className={`pl-3 ${active === 9 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
                  Admin Dashboard
                </span>
              </div>
            </div>
          </Link>
        )}

        <div
          className="flex items-center cursor-pointer w-full p-2 rounded-md transition-all hover:bg-gray-50 mt-4 border-t pt-4"
          onClick={logoutHandler}
        >
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <AiOutlineLogin size={20} color={active === 10 ? "red" : "#555"} />
            <span className={`pl-3 ${active === 10 ? "text-[red] font-medium" : "text-gray-700"} hidden md:block`}>
              Log out
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSidebar
