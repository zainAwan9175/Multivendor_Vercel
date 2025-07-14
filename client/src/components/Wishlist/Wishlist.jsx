import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const emerald = "#059669";
const amber = "#d97706";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50 flex items-center justify-end">
      <div className="h-full w-[98vw] max-w-[480px] 800px:w-[480px] bg-white flex flex-col overflow-y-scroll overflow-x-hidden justify-between shadow-2xl rounded-l-2xl border-l-4 border-emerald-200">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5">
              <RxCross1
                size={28}
                className="cursor-pointer text-emerald-600 hover:text-amber-500 transition"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5 className="text-lg text-emerald-700 font-semibold mt-8">Wishlist is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={28}
                  className="cursor-pointer text-emerald-600 hover:text-amber-500 transition"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Item length */}
              <div className="flex items-center gap-3 p-4 border-b border-emerald-100">
                <AiOutlineHeart size={26} className="text-emerald-500" />
                <h5 className="text-lg font-bold text-emerald-800">
                  {wishlist && wishlist.length} item{wishlist && wishlist.length !== 1 ? "s" : ""}
                </h5>
              </div>
              {/* Wishlist Single Items */}
              <div className="w-full">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <WishlistSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WishlistSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <div className="border-b border-emerald-100 p-4 flex items-center gap-3 bg-emerald-50/30 hover:bg-amber-50/40 transition-all rounded-xl my-2">
      <button
        className="ml-2 p-2 rounded-full hover:bg-amber-100 transition-colors"
        onClick={() => removeFromWishlistHandler(data)}
        type="button"
        aria-label="Remove from wishlist"
      >
        <RxCross1 className="text-rose-500 hover:text-rose-700" size={22} />
      </button>
      <img
        src={`${data?.images[0]?.url}`}
        alt=""
        className="w-[90px] h-[90px] object-cover rounded-lg border border-emerald-100 shadow-sm mx-2"
      />
      <div className="flex-1 pl-2">
        <h1 className="font-bold text-emerald-900 text-base mb-1 truncate">{data.name}</h1>
        <h4 className="font-medium text-sm text-emerald-600">
          US${totalPrice}
        </h4>
      </div>
      <button
        className="ml-2 p-2 rounded-full bg-emerald-100 hover:bg-amber-100 text-emerald-700 flex items-center justify-center transition-colors"
        onClick={() => addToCartHandler(data)}
        type="button"
        aria-label="Add to cart"
        title="Add to cart"
      >
        <BsCartPlus size={22} />
      </button>
    </div>
  );
};

export default Wishlist;