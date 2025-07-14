import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cart";
import { toast } from "react-toastify";

import { useState } from "react";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  // Wishlist demo state (replace with redux if needed)
  const [wish, setWish] = useState(false);

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full max-w-full bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-0 mb-12 overflow-hidden p-0 transition-all duration-300 group hover:shadow-[0_16px_64px_0_rgba(16,185,129,0.22)] border border-emerald-100">
  

      {/* Image section */}
      <div className="flex-shrink-0 w-full md:w-[340px] flex items-center justify-center bg-white p-8 md:p-10">
        <img
          src={`${data.images && data.images[0]?.url}`}
          alt=""
          className="w-[220px] h-[220px] object-contain rounded-2xl shadow-2xl bg-white border-4 border-white"
          style={{ boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.10), 0 1.5px 8px 0 rgba(251, 191, 36, 0.10)' }}
        />
      </div>

      {/* Content section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 md:py-10 md:px-10 relative">
        {/* Sold badge */}
        <span className="absolute top-4 right-4 bg-amber-100 text-amber-600 text-xs font-bold px-4 py-1 rounded-full shadow border border-amber-200 z-10">
          {data.sold_out} Sold
        </span>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-emerald-800 font-[Poppins] mb-2 drop-shadow leading-tight">{data.name}</h2>
        {data.description && (
          <p className="text-[16px] leading-snug font-sans font-medium text-emerald-900 bg-emerald-50/80 rounded-lg px-4 py-3 mb-3 shadow-sm border border-emerald-100 max-w-2xl">
            {data.description.length > 120 ? data.description.slice(0, 120) + "..." : data.description}
          </p>
        )}
        <div className="flex items-center gap-6 mb-3">
          <span className="text-lg text-amber-400 line-through font-semibold">{data.originalPrice}$</span>
          <span className="text-2xl font-bold text-emerald-700">{data.discountPrice}$</span>
        </div>
        <div className="mb-4">
                          <span className="inline-block bg-white text-emerald-700 font-bold px-8 py-3 rounded-full shadow-lg text-lg tracking-wide">
            <CountDown data={data} />
          </span>
        </div>
        <div className="flex gap-4 mt-2">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-[Poppins] text-base md:text-lg font-semibold px-8 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200">See Details</button>
          </Link>
          <button
            className="bg-amber-400 hover:bg-amber-500 text-emerald-900 font-[Poppins] text-base md:text-lg font-semibold px-8 py-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-200"
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
