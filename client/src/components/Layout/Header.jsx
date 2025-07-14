"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { categoriesData } from "../../static/data"
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io"
import { BiMenuAltLeft } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"
import DropDown from "./DropDown"
import Navbar from "./Navbar"
import { useSelector } from "react-redux"
import { RxCross1 } from "react-icons/rx"
import Cart from "../cart/Cart"
import Wishlist from "../Wishlist/Wishlist"

// Import styles
const styles = {
  section: "w-11/12 mx-auto",
  normalFlex: "flex items-center",
  button: "bg-[#3321c8] text-white px-4 py-2 rounded-md cursor-pointer",
}

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user) 
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  // const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("")
  const [searchData, setSearchData] = useState(null)
  const [active, setActive] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [openWishlist, setOpenWishlist] = useState(false)
  const [open, setOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)


    // const wishlist = [
    //   {
    //       id: 1,
    //       name: "Gaming Headphone Asus with mutiple color and free delivery",
    //       description:
    //         "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    //       image_Url: [
    //         {
    //           public_id: "test",
    //           url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
    //         },
    //         {
    //           public_id: "test",
    //           url: "https://eratablet.com/wp-content/uploads/2022/08/H51ba6537405f4948972e293927673546u.jpg",
    //         },
    //       ],
    //       shop: {
    //         name: "Asus Ltd",
    //         shop_avatar: {
    //           public_id: "test",
    //           url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
    //         },
    //         ratings: 4.2,
    //       },
    //       price: 300,
    //       discount_price: 239,
    //       rating: 4.5,
    //       reviews: [
    //         {
    //           user: {
    //             // user object will be here
    //           },
    //           comment: "IT's so cool!",
    //           rating: 5,
    //         },
    //       ],
    //       total_sell: 20,
    //       stock: 10,
    //       category: "Music and Gaming",
    //       qty:6
    //     },
    //     {
    //       id: 4,
    //       name: "New Fashionable Watch for men 2023 with multiple colors",
    //       description:
    //         "Product details are a crucial part of any eCommerce website or online marketplace. These details help the potential customers to make an informed decision about the product they are interested in buying. A well-written product description can also be a powerful marketing tool that can help to increase sales.Product details typically include information about the product's features, specifications, dimensions, weight, materials, and other relevant information that can help customers to understand the product better. The product details section should also include high-quality images and videos of the product, as well as customer reviews and ratings.",
    //       image_Url: [
    //         {
    //           public_id: "test",
    //           url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
    //         },
    //         {
    //           public_id: "test",
    //           url: "https://i0.wp.com/eccocibd.com/wp-content/uploads/2022/01/1802NL02_1.png?fit=550%2C550&ssl=1",
    //         },
    //       ],
    //       shop: {
    //         name: "Shahriar Watch House",
    //         shop_avatar: {
    //           public_id: "test",
    //           url: "https://www.hatchwise.com/wp-content/uploads/2022/05/amazon-logo-1024x683.png",
    //         },
    //         ratings: 4.2,
    //       },
    //       price: 100,
    //       discount_price: 79,
    //       rating: 4,
    //       total_sell: 62,
    //       stock: 10,
    //       qty:2
    //     },
      
       
    //   ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    // const filteredProducts =
    //   allProducts &&
    //   allProducts.filter((product) =>
    //     product.name.toLowerCase().includes(term.toLowerCase())
    //   );
    // setSearchData(filteredProducts);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true)
      } else {
        setActive(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      {/* Desktop Header */}
      <header
        className="w-full relative z-20 border-b border-emerald-100 bg-white/90 backdrop-blur-md shadow"
      >
        {/* Removed gradient and shadow background for a clean look */}
        {/* Decorative background circles removed to prevent blocking UI elements */}
        <div className={windowWidth >= 800 ? "grid grid-cols-3 h-[100px] px-12 max-w-[1400px] mx-auto items-center place-items-center mb-2 relative z-10" : "hidden"}>
          {/* Logo and Brand */}
          <div className="flex items-center gap-4 justify-self-start">
            <Link to="/" className="flex items-center">
              <span className="text-3xl 800px:text-4xl font-extrabold tracking-wider font-[Poppins] text-emerald-600 drop-shadow-lg select-none">
                Market<span className="text-amber-400">Nest</span>
              </span>
            </Link>
          </div>
          
          {/* Search box - centered above nav links */}
          <div className="w-full max-w-2xl justify-self-center">
            <div className="relative">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchTerm}
              onChange={handleSearchChange}
                className="h-[52px] w-full px-8 border-2 border-emerald-200 focus:border-amber-400 rounded-full shadow text-base outline-none transition placeholder:text-emerald-400 bg-white/90 font-[Poppins]"
            />
              <button className="absolute right-6 top-3 text-emerald-600 hover:text-amber-500 transition">
              <AiOutlineSearch size={28} />
            </button>
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-white shadow-xl z-[9] p-4 rounded-xl mt-2 w-full">
                {searchData &&
                  searchData.map((i, index) => (
                    <Link to={`/product/${i._id}`} key={index}>
                      <div className="w-full flex items-center py-2 hover:bg-amber-50 rounded-lg transition">
                        <img src={`${i.images[0]?.url}`} alt="" className="w-[40px] h-[40px] mr-3 rounded" />
                        <h1 className="text-emerald-900 font-semibold">{i.name}</h1>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : null}
          </div>
          </div>
          
          {/* Right side - Become Seller button and Profile */}
          <div className="flex items-center gap-8 justify-self-end">
          {/* Become Seller / Dashboard */}
          <div>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-md transition-all font-[Poppins]"
              >
              {isSeller ? "Go Dashboard" : "Become Seller"}
              <IoIosArrowForward />
            </Link>
          </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <div
        className={`$${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } transition ${windowWidth >= 800 ? "flex" : "hidden"} items-center justify-between w-full bg-emerald-600 h-[70px] sticky top-0 z-20`}
      >
        {/* No gradient, just a clean white background */}
        <div className={`${styles.section} relative ${styles.normalFlex} justify-between  `}>
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)} className="relative">
            <div className={`relative h-[60px] mt-3 w-[270px] ${windowWidth >= 1000 ? "block" : "hidden"} bg-white backdrop-blur-md rounded-t-xl shadow border border-emerald-100`}> 
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[70px] w-full flex justify-between items-center pl-10 bg-transparent font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? <DropDown categoriesData={categoriesData} setDropDown={setDropDown} /> : null}
            </div>
          </div>
          {/* navitems */}
          <div className={`${styles.normalFlex} flex-1 justify-center`}>
            <Navbar active={activeHeading} setOpenCart={setOpenCart} setOpenWishlist={setOpenWishlist} />
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm ${windowWidth >= 800 ? "hidden" : "block"}`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft size={40} className="ml-4" onClick={() => setOpen(true)} />
          </div>
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt="Logo"
                className="mt-3 cursor-pointer"
              />
            </Link>
          </div>
          <div>
            <div className="relative mr-[20px]" onClick={() => setOpenCart(!openCart)}>
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* wishlist popup */}
         {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null} 
        </div>

        {/* Mobile Sidebar */}
        {open && (
          <div className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}>
            <div className="fixed w-[70%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div className="relative mr-[15px]" onClick={() => setOpenWishlist(true) || setOpen(false)}>
                     <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span> 
                  </div>
                </div>
                <RxCross1 size={30} className="ml-4 mt-5" onClick={() => setOpen(false)} />
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i, index) => {
                      const d = i.name
                      const Product_name = d.replace(/\s+/g, "-")
                      return (
                        <Link to={`/product/${Product_name}`} key={index}>
                          <div className="flex items-center">
                            <img src={i.image_Url[0]?.url || "/placeholder.svg"} alt="" className="w-[50px] mr-2" />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} setOpenCart={setOpenCart} setOpenWishlist={setOpenWishlist} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Beome Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${user?.avatar?.url}`}
                        alt="User"
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-[18px] pr-[10px] text-[#000000b7]">
                      Login /
                    </Link>
                    <Link to="/sign-up" className="text-[18px] text-[#000000b7]">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Popup */}
      {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

      {/* Wishlist Popup */}
      {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
    </>
  )
}

export default Header