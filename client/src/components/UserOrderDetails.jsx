import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { loadOrder } from "../redux/actions/order";

import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const GREEN = "#009966";
const YELLOW = "#FFC107";
const ORANGE = "#FFA500";
const LIGHT_BG = "#fff";
const SOFT_SHADOW = "0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(loadOrder(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(loadOrder(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refundHandler = async () => {
    await axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/order/order-refund/${id}`, {
        status: "Processing refund",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(loadOrder(user._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated && data?.cart?.length > 0) {
      const groupTitle = user._id + data.cart[0].shopId;
      const userId = user._id;
      const sellerId = data.cart[0].shopId;
      
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
    } else if (!isAuthenticated) {
      toast.error("Please login to create a conversation");
    } else {
      toast.error("No items found in this order");
    }
  };

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", padding: "2rem 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ padding: 12, background: GREEN, borderRadius: 16, boxShadow: SOFT_SHADOW }}>
              <BsFillBagFill size={28} color="#fff" />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: GREEN, fontFamily: 'Poppins, sans-serif' }}>Order Details</h1>
          </div>
          <div style={{ background: LIGHT_BG, borderRadius: 20, padding: 24, boxShadow: SOFT_SHADOW, border: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#444", fontWeight: 500 }}>Order ID:</span>
                <span style={{ fontFamily: "monospace", color: GREEN, fontWeight: 600 }}>#{data?._id?.slice(0, 8)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#444", fontWeight: 500 }}>Placed on:</span>
                <span style={{ color: "#222", fontWeight: 500 }}>{data?.createdAt?.slice(0, 10)}</span>
              </div>
        </div>
      </div>
      </div>

        {/* Order Items */}
        <div style={{ marginBottom: 32 }}>
      {data &&
            data?.cart.map((item, index) => (
              <div key={index} style={{ background: LIGHT_BG, borderRadius: 20, padding: 24, boxShadow: SOFT_SHADOW, border: "1px solid #f0f0f0", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 16, transition: "transform 0.2s, box-shadow 0.2s" }}>
              <img
                src={`${item.images[0]?.url}`}
                  alt={item.name}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12, boxShadow: SOFT_SHADOW }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 600, color: "#222", marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ color: "#444", fontWeight: 500 }}>
                    US${item.discountPrice} × {item.qty}
                  </p>
              </div>
              {!item.isReviewed && data?.status === "Delivered" ? (
                  <button
                    style={{ padding: "12px 24px", background: GREEN, color: "#fff", fontWeight: 600, borderRadius: 12, boxShadow: SOFT_SHADOW, border: "none", cursor: "pointer", transition: "background 0.2s, transform 0.2s", marginLeft: 8 }}
                    onClick={() => { setOpen(true); setSelectedItem(item); }}
                >
                  Write a review
                  </button>
              ) : null}
            </div>
            ))}
        </div>

        {/* Review Popup */}
    {open && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: LIGHT_BG, borderRadius: 24, boxShadow: SOFT_SHADOW, maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: GREEN }}>Give a Review</h2>
                  <button
                onClick={() => setOpen(false)}
                    style={{ padding: 8, background: "#f5f5f5", borderRadius: "50%", border: "none", cursor: "pointer" }}
                  >
                    <RxCross1 size={24} color="#444" />
                  </button>
            </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, background: "#f8f8f8", borderRadius: 16, padding: 16 }}>
              <img
                src={`${selectedItem?.images[0]?.url}`}
                    alt={selectedItem?.name}
                    style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 12 }}
              />
              <div>
                    <h3 style={{ fontWeight: 600, color: "#222" }}>{selectedItem?.name}</h3>
                    <p style={{ color: "#444" }}>
                      US${selectedItem?.discountPrice} × {selectedItem?.qty}
                    </p>
              </div>
            </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontWeight: 600, color: "#222", marginBottom: 8 }}>
                    Give a Rating <span style={{ color: ORANGE }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                        <button
                    key={i}
                    onClick={() => setRating(i)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                        >
                          <AiFillStar color={YELLOW} size={28} />
                        </button>
                ) : (
                        <button
                    key={i}
                    onClick={() => setRating(i)}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                        >
                          <AiOutlineStar color={YELLOW} size={28} />
                        </button>
                )
              )}
            </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontWeight: 600, color: "#222", marginBottom: 8 }}>
                Write a comment
                    <span style={{ marginLeft: 8, fontWeight: 400, fontSize: 14, color: "#888" }}>(optional)</span>
              </label>
              <textarea
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                    placeholder="How was your product? Write your expression about it!"
                    style={{ width: "100%", padding: 12, border: "1px solid #eee", borderRadius: 10, outline: "none", resize: "none", fontSize: 16 }}
                    rows={4}
                  />
            </div>
                <button
                  style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontWeight: 700, fontSize: 18, background: rating > 1 ? GREEN : "#eee", color: rating > 1 ? "#fff" : "#aaa", border: "none", cursor: rating > 1 ? "pointer" : "not-allowed", boxShadow: SOFT_SHADOW, transition: "background 0.2s, transform 0.2s" }}
              onClick={rating > 1 ? reviewHandler : null}
            >
                  Submit Review
                </button>
              </div>
          </div>
        </div>
      )}

        {/* Total Price */}
        <div style={{ background: LIGHT_BG, borderRadius: 20, padding: 24, boxShadow: SOFT_SHADOW, border: "1px solid #f0f0f0", marginBottom: 32 }}>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: GREEN }}>
              Total Price: <span style={{ color: ORANGE }}>US${data?.totalPrice}</span>
            </h3>
      </div>
        </div>

        {/* Shipping & Payment Info */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 2, minWidth: 280 }}>
            <div style={{ background: LIGHT_BG, borderRadius: 20, padding: 24, boxShadow: SOFT_SHADOW, border: "1px solid #f0f0f0" }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, color: GREEN, marginBottom: 12 }}>Shipping Address</h4>
              <div style={{ color: "#444", fontWeight: 500, lineHeight: 1.6 }}>
                <p>{data?.shippingAddress.address1 + " " + data?.shippingAddress.address2}</p>
                <p>{data?.shippingAddress.country}</p>
                <p>{data?.shippingAddress.city}</p>
                <p>{data?.user?.phoneNumber}</p>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ background: LIGHT_BG, borderRadius: 20, padding: 24, boxShadow: SOFT_SHADOW, border: "1px solid #f0f0f0" }}>
              <h4 style={{ fontSize: 20, fontWeight: 700, color: GREEN, marginBottom: 12 }}>Payment Info</h4>
              <div style={{ color: "#444", fontWeight: 500, marginBottom: 16 }}>
                Status: <span style={{ color: data?.paymnentInfo?.status ? GREEN : ORANGE, fontWeight: 700 }}>{data?.paymnentInfo?.status ? data?.paymnentInfo?.status : "Not Paid"}</span>
              </div>
          {data?.status === "Delivered" && (
                <button
                  style={{ width: "100%", padding: "12px 0", background: ORANGE, color: "#fff", fontWeight: 600, borderRadius: 12, border: "none", boxShadow: SOFT_SHADOW, cursor: "pointer", transition: "background 0.2s, transform 0.2s" }}
              onClick={refundHandler}
            >
                  Request Refund
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 16 }}>
          <button
            style={{ flex: 1, padding: "14px 0", background: YELLOW, color: GREEN, fontWeight: 700, borderRadius: 12, border: "none", boxShadow: SOFT_SHADOW, fontSize: 18, cursor: "pointer", transition: "background 0.2s, transform 0.2s" }}
            onClick={handleMessageSubmit}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;