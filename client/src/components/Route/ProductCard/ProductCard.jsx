import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import { addToWishlist
  ,removeFromWishlist
 } from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";
import "./ProductCard.css";

const ProductCard = ({ data, isEvent }) => {
     const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
     
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
      <div className="w-full min-h-[390px] bg-white rounded-2xl shadow-xl p-4 flex flex-col justify-between relative cursor-pointer border-2 border-transparent hover:border-emerald-200 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
        <div className="relative">
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
            className="z-10 relative"
        >
          <img
            src={`${data.images && data.images[0]?.url}`}
            alt=""
              className="w-full h-[170px] object-contain rounded-xl bg-white group-hover:scale-105 transition-transform duration-300 shadow"
            />
            {/* Action icons at the top right corner of the image */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 bg-white rounded-full shadow-lg p-2 z-20 border border-emerald-50">
              {click ? (
                <AiFillHeart
                  size={20}
                  className="cursor-pointer text-amber-500 drop-shadow hover:scale-110 transition-transform duration-200"
                  onClick={(e) => { e.preventDefault(); removeFromWishlistHandler(data); }}
                  color={click ? "#f59e42" : "#333"}
                  title="Remove from wishlist"
                />
              ) : (
                <AiOutlineHeart
                  size={20}
                  className="cursor-pointer text-emerald-500 drop-shadow hover:scale-110 transition-transform duration-200"
                  onClick={(e) => { e.preventDefault(); addToWishlistHandler(data); }}
                  color={click ? "#f59e42" : "#333"}
                  title="Add to wishlist"
                />
              )}
              <AiOutlineEye
                size={20}
                className="cursor-pointer text-emerald-400 drop-shadow hover:scale-110 transition-transform duration-200"
                onClick={(e) => { e.preventDefault(); setOpen(!open); }}
                color="#333"
                title="Quick view"
              />
              <AiOutlineShoppingCart
                size={22}
                className="cursor-pointer text-emerald-600 drop-shadow hover:scale-110 transition-transform duration-200"
                onClick={(e) => { e.preventDefault(); addToCartHandler(data._id); }}
                color="#444"
                title="Add to cart"
              />
            </div>
        </Link>
          <Link to={`/shop/preview/${data?.shop._id}`} className="z-10 relative">
            <h5 className="pt-3 text-[15px] text-emerald-500 font-semibold pb-3 font-[Poppins]">{data.shop.name}</h5>
        </Link>
        <Link
          to={`${
            isEvent === true
              ? `/product/${data._id}?isEvent=true`
              : `/product/${data._id}`
          }`}
            className="z-10 relative"
        >
            <h4 className="pb-3 font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors font-[Poppins] truncate">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
            {data.description && (
              <p className="text-[15px] leading-snug font-sans font-medium text-emerald-900 bg-emerald-50/60 rounded-lg px-3 py-2 mb-2 shadow-sm border border-emerald-100 text-left">
                {data.description && data.description.length > 100
                  ? data.description.slice(0, data.description.lastIndexOf(' ', 50)) + "..."
                  : data.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Ratings rating={data?.ratings} />
              <h1 className="text-slate-700 font-semibold">{data.ratings}</h1>
          </div>

          <div className="py-2 flex items-center justify-between">
              <div className="flex items-end gap-2">
                <h5 className="font-bold text-[20px] text-emerald-700 font-[Poppins]">
                {data.originalPrice === 0
                  ? data.originalPrice
                  : data.discountPrice}
                $
              </h5>
                <h4 className="font-[500] text-[16px] text-amber-400 pl-2 mt-[-4px] line-through font-[Poppins]">
                {data.originalPrice ? data.originalPrice + " $" : null}
              </h4>
            </div>
              <span className="font-[500] text-[15px] text-amber-500 bg-amber-50 px-3 py-1 rounded-full shadow font-[Poppins]">
                {data?.sold_out} sold
            </span>
          </div>
        </Link>
        </div>
        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;