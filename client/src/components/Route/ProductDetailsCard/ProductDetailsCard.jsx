import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addToCart } from "../../../redux/reducers/cart";
import axios from "axios";

const GREEN = "#009966";
const YELLOW = "#FFC107";
const ORANGE = "#FFA500";
const LIGHT_BG = "#fff";
const SOFT_SHADOW = "0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
   const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
   const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = user._id + data.shop._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        });
        
        // The backend automatically checks for existing conversation and returns it if found
        // or creates a new one if it doesn't exist
        navigate(`/inbox?${res.data.conversation._id}`);
        toast.success("Opening conversation...");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to create conversation");
      }
    } else {
      toast.error("Please login to create a conversation");
    }
  };

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
    toast.success("Item added to wishlist!");
  };

  return (
    <div style={{ background: LIGHT_BG }}>
      {data ? (
        <div style={{ position: "fixed", width: "100%", height: "100vh", top: 0, left: 0, background: "rgba(0,0,0,0.18)", zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "90%", maxWidth: 900, height: "90vh", maxHeight: 700, overflowY: "auto", background: LIGHT_BG, borderRadius: 16, boxShadow: SOFT_SHADOW, position: "relative", padding: 24 }}>
            <RxCross1
              size={30}
              style={{ position: "absolute", right: 16, top: 16, zIndex: 50, cursor: "pointer", color: GREEN }}
              onClick={() => setOpen(false)}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <img src={`${data.images && data.images[0]?.url}`} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, boxShadow: SOFT_SHADOW, background: "#f8f8f8" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
                  <Link to={`/shop/preview/${data.shop._id}`} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img
                      src={`${data.shop.avatar && data.shop.avatar.url}`}
            alt=""
                      style={{ width: 50, height: 50, borderRadius: "50%", marginRight: 12, border: `2px solid ${GREEN}` }}
          />
                    <div>
                      <h3 style={{ color: GREEN, fontWeight: 700, fontSize: 18 }}>{data.shop.name}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        {[1,2,3,4,5].map(i => (
                          data?.ratings >= i ? (
                            <AiFillStar key={i} color={YELLOW} size={18} />
                          ) : (
                            <AiOutlineStar key={i} color={YELLOW} size={18} />
                          )
                        ))}
                        <span style={{ color: "#888", fontSize: 15, marginLeft: 6 }}>{data?.ratings} Ratings</span>
                        </div>
                    </div>
                  </Link>
                </div>
                <div
                  style={{ marginTop: 20, borderRadius: 8, background: GREEN, boxShadow: SOFT_SHADOW }}
                >
                  <button
                    style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", width: "100%", padding: "12px 0" }}
                    onClick={handleMessageSubmit}
                >
                    Send Message <AiOutlineMessage style={{ marginLeft: 8, color: YELLOW }} />
                  </button>
                </div>
                <h5 style={{ fontSize: 16, color: ORANGE, marginTop: 20, fontWeight: 700 }}>(50) Sold out</h5>
              </div>

              <div style={{ flex: 1, minWidth: 280, paddingTop: 16 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: GREEN, marginBottom: 8 }}>{data.name}</h1>
                <p style={{ color: "#444", marginBottom: 16 }}>{data.description}</p>

                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <h4 style={{ color: GREEN, fontWeight: 700, fontSize: 22 }}>{data.discountPrice}$</h4>
                  <h3 style={{ color: "#aaa", textDecoration: "line-through", fontWeight: 500, fontSize: 18 }}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
                  </h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: 32, justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <button
                      style={{ background: GREEN, color: "#fff", fontWeight: 700, borderRadius: "8px 0 0 8px", padding: "8px 16px", border: "none", boxShadow: SOFT_SHADOW, fontSize: 20, cursor: "pointer", transition: "background 0.2s" }}
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span style={{ background: "#f5f5f5", color: GREEN, fontWeight: 700, padding: "8px 20px", fontSize: 18, border: `1px solid ${GREEN}` }}>{count}</span>
                    <button
                      style={{ background: GREEN, color: "#fff", fontWeight: 700, borderRadius: "0 8px 8px 0", padding: "8px 16px", border: "none", boxShadow: SOFT_SHADOW, fontSize: 20, cursor: "pointer", transition: "background 0.2s" }}
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        style={{ cursor: "pointer" }}
                         onClick={() => removeFromWishlistHandler(data)}
                        color={click ? ORANGE : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        style={{ cursor: "pointer" }}
                         onClick={() => addToWishlistHandler(data)}
                        color={ORANGE}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{ marginTop: 32, borderRadius: 8, background: GREEN, boxShadow: SOFT_SHADOW }}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <button
                    style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", width: "100%", padding: "12px 0" }}
                  >
                    Add to cart <AiOutlineShoppingCart style={{ marginLeft: 8, color: YELLOW }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;