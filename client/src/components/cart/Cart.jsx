
import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducers/cart";
import { removeFromCart } from "../../redux/reducers/cart";
import { toast } from "react-toastify";
import { removeFromcart } from "../../redux/actions/cart";
import { addTocart } from "../../redux/actions/cart";

const emerald = "#059669";
const amber = "#f59e42";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromcart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50 flex items-center justify-end">
      <div className="h-full w-[98vw] max-w-[480px] 800px:w-[480px] bg-white flex flex-col overflow-y-scroll overflow-x-hidden justify-between shadow-2xl rounded-l-2xl border-l-4 border-emerald-200">
        {cart && cart.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5">
              <RxCross1
                size={28}
                className="cursor-pointer text-emerald-600 hover:text-amber-500 transition"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5 className="text-lg text-emerald-700 font-semibold mt-8">Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={28}
                  className="cursor-pointer text-emerald-600 hover:text-amber-500 transition"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Item length */}
              <div className="flex items-center gap-3 p-4 border-b border-emerald-100">
                <IoBagHandleOutline size={26} className="text-emerald-500" />
                <h5 className="text-lg font-bold text-emerald-800">
                  {cart && cart.length} item{cart && cart.length !== 1 ? "s" : ""}
                </h5>
              </div>
              {/* cart Single Items */}
              <div className="w-full">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>
            <div className="px-5 mb-4 mt-2">
              {/* checkout buttons */}
              <Link to="/checkout">
                <div
                  className="h-[48px] flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg transition-all cursor-pointer group"
                >
                  <h1 className="text-white text-lg font-bold tracking-wide group-hover:scale-105 transition-transform">
                    Checkout Now <span className="ml-2">(USD${totalPrice})</span>
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPricePerQuantity = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock <= value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b border-emerald-100 p-4 flex items-center gap-3 bg-emerald-50/30 hover:bg-amber-50/40 transition-all rounded-xl my-2">
      <div className="flex flex-col items-center gap-2">
        <button
          className="bg-emerald-500 hover:bg-amber-400 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all"
          onClick={() => increment(data)}
          type="button"
        >
          <HiPlus size={18} />
        </button>
        <span className="font-semibold text-emerald-700">{value}</span>
        <button
          className="bg-emerald-100 hover:bg-amber-100 text-emerald-700 rounded-full w-8 h-8 flex items-center justify-center shadow-sm transition-all"
          onClick={() => decrement(data)}
          type="button"
        >
          <HiOutlineMinus size={16} />
        </button>
      </div>
      <img
        src={`${data?.images[0]?.url}`}
        alt=""
        className="w-[90px] h-[90px] object-cover rounded-lg border border-emerald-100 shadow-sm mx-2"
      />
      <div className="flex-1 pl-2">
        <h1 className="font-bold text-emerald-900 text-base mb-1 truncate">{data.name}</h1>
        <h4 className="font-medium text-sm text-emerald-600">
          ${data.discountPrice} <span className="text-gray-400">x</span> {value}
        </h4>
        <h4 className="font-bold text-lg pt-1 text-amber-500">
          US${totalPricePerQuantity}
        </h4>
      </div>
      <button
        className="ml-2 p-2 rounded-full hover:bg-amber-100 transition-colors"
        onClick={() => removeFromCartHandler(data)}
        type="button"
        aria-label="Remove from cart"
      >
        <RxCross1 className="text-rose-500 hover:text-rose-700" size={22} />
      </button>
    </div>
  );
};

export default Cart;
