"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { navItems } from "../../static/data"
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { useSelector } from "react-redux"

// Import styles
const styles = {
  normalFlex: "flex items-center",
}

const Navbar = ({ active, setOpenCart, setOpenWishlist }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.user)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return (
    <nav className={`block ${windowWidth >= 800 ? styles.normalFlex : ""} gap-2 w-full justify-between items-center relative z-10  backdrop-blur-md`}> 
      <div className="flex gap-2 flex-1 justify-center">
        {navItems &&
          navItems.map((i, index) => (
            <div className="flex" key={index}>
              <Link
                to={i.url}
                className={`px-4 py-2 rounded-full transition font-semibold text-base
                  ${windowWidth >= 800
                    ? active === index + 1
                      ? "bg-amber-100 text-emerald-700"
                      : "text-white hover:bg-emerald-700 hover:text-amber-300"
                    : active === index + 1
                    ? "bg-amber-100 text-emerald-700"
                    : "text-white hover:bg-emerald-700 hover:text-amber-300"
                  }
                `}
              >
                {i.title}
              </Link>
            </div>
          ))}
      </div>
      {/* Cart and Wishlist icons on the right */}
      <div className="flex items-center gap-6 ml-4">
        <div className="relative cursor-pointer" onClick={() => setOpenWishlist && setOpenWishlist(true)}>
          <AiOutlineHeart size={28} className="text-white hover:text-amber-300 transition" />
          <span className="absolute -right-2 -top-2 rounded-full bg-amber-400 w-5 h-5 text-white font-bold text-xs flex items-center justify-center font-[Poppins]">
            {wishlist && wishlist.length}
          </span>
        </div>
        <div className="relative cursor-pointer" onClick={() => setOpenCart && setOpenCart(true)}>
          <AiOutlineShoppingCart size={28} className="text-white hover:text-amber-300 transition" />
          <span className="absolute -right-2 -top-2 rounded-full bg-amber-400 w-5 h-5 text-white font-bold text-xs flex items-center justify-center font-[Poppins]">
            {cart && cart.length}
          </span>
        </div>
        {/* Profile Icon */}
        <div className="relative cursor-pointer">
          {isAuthenticated ? (
            <Link to="/profile">
              <img 
                src={`${user?.avatar?.url}`} 
                className="w-[32px] h-[32px] rounded-full border-2 border-white object-cover shadow hover:scale-105 transition-transform" 
                alt="User" 
              />
            </Link>
          ) : (
            <Link to="/login">
              <CgProfile size={28} className="text-white hover:text-amber-300 transition" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar