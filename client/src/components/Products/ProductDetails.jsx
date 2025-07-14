"use client"

import { useState } from "react"
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart, AiFillStar, AiOutlineStar } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { getAllProductsShop } from "../../redux/actions/product"
import styles from "../../styles/styles"
import { addToCart } from "../../redux/reducers/cart"
import { toast } from "react-toastify"
import Ratings from "./Ratings"
import { addToWishlist,removeFromWishlist } from "../../redux/actions/wishlist"
import { useEffect } from "react"
import axios from "axios"
import React, { useRef } from "react";
const GREEN = "#009966";
const YELLOW = "#FFC107";
const ORANGE = "#FFA500";
const LIGHT_BG = "#fff";
const SOFT_SHADOW = "0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)";
const glowShadow = '0 0 12px 2px rgba(0, 153, 102, 0.15)';
const ProductDetails = ({ data }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
     const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user)
    const { products } = useSelector((state) => state.product);
  const [count, setCount] = useState(1)
  const [click, setClick] = useState(false)
  const [select, setSelect] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const mainImgRef = useRef(null);
    useEffect(() => {
      dispatch(getAllProductsShop(data && data?.shopId));
      if (wishlist && wishlist.find((i) => i._id === data?._id)) {
        setClick(true);
      } else {
        setClick(false);
      }
    }, [data]);

  const incrementCount = () => {
    setCount(count + 1)
  }

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  const removeFromWishlistHandler = (data) => {
    setClick(!click)
     dispatch(removeFromWishlist(data));
  }

  const addToWishlistHandler = (data) => {
    setClick(!click)
    dispatch(addToWishlist(data));
    toast.success("Item added to wishlist!");
  }

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

    const totalReviewsLength =
      products &&
      products.reduce((acc, product) => acc + product.reviews.length, 0);

    const totalRatings =
      products &&
      products.reduce(
        (acc, product) =>
          acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
        0
      );

    const avg = totalRatings / totalReviewsLength || 0;

    const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = user._id + data.shop._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: LIGHT_BG, borderRadius: 20, boxShadow: SOFT_SHADOW, padding: '32px 0', minHeight: '100vh' }}>
      {data ? (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ padding: '32px 0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
              <div style={{ flex: 1, minWidth: 340 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f5f6fb',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 24,
                    height: 520,
                    minHeight: 320,
                    maxHeight: 600,
                    boxShadow: SOFT_SHADOW,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    ref={mainImgRef}
                    src={`${data && data.images[select]?.url}`}
                    alt=""
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      borderRadius: 12,
                      transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
                      boxShadow: SOFT_SHADOW,
                      cursor: 'zoom-in',
                      position: 'relative',
                      zIndex: 2,
                    }}
                    onMouseMove={e => {
                      const img = mainImgRef.current;
                      if (!img) return;
                      const rect = img.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      img.style.transform = `scale(2) translate(-${x - 50}%, -${y - 50}%)`;
                      img.style.zIndex = 3;
                    }}
                    onMouseLeave={e => {
                      const img = mainImgRef.current;
                      if (!img) return;
                      img.style.transform = 'scale(1)';
                      img.style.zIndex = 2;
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'flex-start' }}>
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        style={{
                          border: select === index ? `2px solid ${GREEN}` : '1px solid #e0e0e0',
                          borderRadius: 8,
                          overflow: 'hidden',
                          width: 80,
                          height: 80,
                          cursor: 'pointer',
                          boxShadow: select === index ? glowShadow : 'none',
                          transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
                        }}
                        onClick={() => setSelect(index)}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = glowShadow; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = select === index ? glowShadow : 'none'; }}
                      >
                        <img src={`${i?.url}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 340, paddingTop: 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: GREEN, marginBottom: 16, letterSpacing: '-1px' }}>{data.name}</h1>
                <div style={{ marginBottom: 24, background: '#f5f6fb', padding: 20, borderRadius: 12, fontSize: 18, color: '#444', lineHeight: 1.7, boxShadow: SOFT_SHADOW }}>{data.description}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 32 }}>
                  <h4 style={{ color: GREEN, fontWeight: 800, fontSize: 28, letterSpacing: '-1px' }}>${data.discountPrice}</h4>
                  {data.price && (
                    <h3 style={{ color: '#aaa', textDecoration: 'line-through', fontWeight: 500, fontSize: 20 }}>${data.price}</h3>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 32, justifyContent: 'space-between', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1px solid #e0e0e0`, borderRadius: 10, overflow: 'hidden', boxShadow: SOFT_SHADOW }}>
                    <button
                      style={{ background: GREEN, color: '#fff', fontWeight: 700, fontSize: 22, padding: '10px 18px', border: 'none', outline: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', borderRadius: '10px 0 0 10px' }}
                      onClick={decrementCount}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = glowShadow; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      -
                    </button>
                    <span style={{ background: '#fff', color: GREEN, fontWeight: 700, padding: '10px 28px', fontSize: 20, minWidth: 50, textAlign: 'center' }}>{count}</span>
                    <button
                      style={{ background: GREEN, color: '#fff', fontWeight: 700, fontSize: 22, padding: '10px 18px', border: 'none', outline: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', borderRadius: '0 10px 10px 0' }}
                      onClick={incrementCount}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = glowShadow; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={34}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s, filter 0.2s', color: ORANGE }}
                        onClick={() => removeFromWishlistHandler(data)}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.18)'; e.currentTarget.style.filter = 'drop-shadow(0 0 6px #FFA50088)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={34}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s, filter 0.2s', color: '#333' }}
                        onClick={() => addToWishlistHandler(data)}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.18)'; e.currentTarget.style.filter = 'drop-shadow(0 0 6px #FFC10788)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{ marginTop: 36, borderRadius: 10, background: GREEN, boxShadow: SOFT_SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onClick={() => addToCartHandler(data._id)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = glowShadow; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = SOFT_SHADOW; }}
                >
                  <span style={{ color: '#fff', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 20, padding: '16px 0', letterSpacing: '-0.5px' }}>
                    Add to cart <AiOutlineShoppingCart style={{ marginLeft: 12, color: YELLOW, fontSize: 26 }} />
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #e0e0e0', marginTop: 40, paddingTop: 32, gap: 24 }}>
                  <Link to={`/shop/preview/${data?.shop._id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full mr-4 border-2"
                      style={{ borderColor: GREEN, padding: 2, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: SOFT_SHADOW }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = glowShadow; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = SOFT_SHADOW; }}
                    />
                  </Link>
                  <div style={{ paddingRight: 32 }}>
                    <Link to={`/shop/preview/${data?.shop._id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ color: GREEN, fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {data.shop.name}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {[1,2,3,4,5].map(i => (
                            averageRating >= i ? (
                              <AiFillStar key={i} color={YELLOW} size={22} style={{ transition: 'filter 0.2s' }} />
                            ) : (
                              <AiOutlineStar key={i} color={YELLOW} size={22} style={{ transition: 'filter 0.2s' }} />
                            )
                          ))}
                        </span>
                      </h3>
                    </Link>
                    <h5 style={{ color: '#888', fontSize: 16, marginTop: 2 }}>({averageRating}/5) Ratings</h5>
                  </div>
                  <div
                    style={{
                      background: GREEN,
                      borderRadius: 10,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: SOFT_SHADOW,
                      marginLeft: 'auto',
                      cursor: 'pointer',
                      padding: '0 28px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      whiteSpace: 'nowrap',
                      minWidth: 180,
                      maxWidth: 300,
                      overflow: 'hidden',
                    }}
                    onClick={handleMessageSubmit}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = glowShadow; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = SOFT_SHADOW; }}
                  >
                    <span style={{ color: '#fff', display: 'inline-flex', alignItems: 'center', fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Send Message <AiOutlineMessage style={{ marginLeft: 10, color: YELLOW, fontSize: 22 }} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo
            data={data}
             products={products}
             totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  )
}

const ProductDetailsInfo = ({ data, products, totalReviewsLength, averageRating }) => {
  const [active, setActive] = useState(1)

  return (
    <div style={{ background: '#f5f6fb', borderRadius: 16, boxShadow: SOFT_SHADOW, padding: '24px 0', marginTop: 32 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        background: '#fff',
        borderRadius: 12,
        boxShadow: SOFT_SHADOW,
        padding: '12px 0',
        margin: '0 24px',
        position: 'relative',
      }}>
        {[1,2,3].map(tab => (
          <div
            key={tab}
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: active === tab ? GREEN : '#444',
              cursor: 'pointer',
              padding: '8px 28px',
              borderRadius: 8,
              background: active === tab ? '#e6f9f2' : 'transparent',
              boxShadow: active === tab ? glowShadow : 'none',
              transition: 'all 0.18s',
              transform: active === tab ? 'scale(1.06)' : 'scale(1)',
              marginBottom: active === tab ? -4 : 0,
              borderBottom: active === tab ? `3px solid ${GREEN}` : '3px solid transparent',
            }}
            onClick={() => setActive(tab)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = active === tab ? 'scale(1.06)' : 'scale(1)'; }}
          >
            {tab === 1 && 'Product Details'}
            {tab === 2 && 'Product Reviews'}
            {tab === 3 && 'Seller Information'}
        </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: SOFT_SHADOW, margin: '32px 24px 0 24px', padding: '32px 24px', minHeight: 200 }}>
        {active === 1 && (
        <>
            <p style={{ fontSize: 18, color: '#444', lineHeight: 1.7, marginBottom: 24 }}>{data.description}</p>
          <Ratings rating={data?.ratings} />
        </>
        )}
        {active === 2 && (
          <div style={{ width: '100%', minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, maxHeight: 400, overflowY: 'auto' }}>
            {data && data.reviews.length > 0 ? data.reviews.map((item, index) => (
              <div key={index} style={{ width: '100%', background: '#f8f8f8', borderRadius: 10, boxShadow: SOFT_SHADOW, padding: 18, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <img src={`${item.user.avatar?.url}`} alt="" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${GREEN}` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h1 style={{ fontWeight: 700, color: GREEN, fontSize: 18 }}>{item.user.name}</h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p style={{ color: '#444', fontSize: 16 }}>{item.comment}</p>
                </div>
              </div>
            )) : (
              <h5 style={{ color: '#888', fontWeight: 600, fontSize: 18, marginTop: 32 }}>No Reviews have for this product!</h5>
            )}
          </div>
        )}
      {active === 3 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <Link to={`/shop/preview/${data.shop._id}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img src={`${data?.shop?.avatar?.url}`} style={{ width: 50, height: 50, borderRadius: '50%', border: `2px solid ${GREEN}`, padding: 2, boxShadow: SOFT_SHADOW, transition: 'transform 0.2s, box-shadow 0.2s' }} alt="" />
                  <div>
                    <h3 style={{ color: GREEN, fontWeight: 700, fontSize: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {data.shop.name}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {[1,2,3,4,5].map(i => (
                          averageRating >= i ? (
                            <AiFillStar key={i} color={YELLOW} size={18} />
                          ) : (
                            <AiOutlineStar key={i} color={YELLOW} size={18} />
                          )
                        ))}
                      </span>
                    </h3>
                    <h5 style={{ color: '#888', fontSize: 15, marginTop: 2 }}>({averageRating}/5) Ratings</h5>
                </div>
              </div>
            </Link>
              <p style={{ color: '#444', fontSize: 16, marginTop: 16 }}>{data.shop.description}</p>
          </div>
            <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'flex-start' }}>
              <h5 style={{ fontWeight: 700, color: '#222' }}>
                Joined on: <span style={{ fontWeight: 500 }}>{data.shop?.createdAt?.slice(0, 10)}</span>
              </h5>
              <h5 style={{ fontWeight: 700, color: '#222' }}>
                Total Products: <span style={{ fontWeight: 500 }}>{products && products.length}</span>
              </h5>
              <h5 style={{ fontWeight: 700, color: '#222' }}>
                Total Reviews: <span style={{ fontWeight: 500 }}>{totalReviewsLength}</span>
              </h5>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ background: GREEN, borderRadius: 8, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SOFT_SHADOW, marginTop: 12, cursor: 'pointer', padding: '0 20px', fontWeight: 700, color: '#fff', fontSize: 16, transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  Visit Shop
                </div>
              </Link>
            </div>
          </div>
        )}
        </div>
    </div>
  )
}

export default ProductDetails
