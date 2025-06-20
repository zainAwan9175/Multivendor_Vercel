"use client"

import { useState } from "react"
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai"
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
      const groupTitle = data._id + user._id;
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

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] mx-auto`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex gap-8">
              <div className="w-full 800px:w-[50%]">
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 mb-4 h-[400px] overflow-hidden">
                  <img
                    src={`${data && data.images[select]?.url}`}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="w-full flex flex-wrap gap-2 justify-start">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === index ? "border-2 border-teal-500" : "border border-gray-300"
                        } cursor-pointer rounded-md overflow-hidden w-[80px] h-[80px]`}
                        onClick={() => setSelect(index)}
                      >
                        <img src={`${i?.url}`} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle} text-2xl font-bold mb-2`}>{data.name}</h1>
                <div className="mb-4 mt-2 bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{data.description}</p>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <h4 className={`${styles.productDiscountPrice} text-2xl font-bold text-teal-600`}>
                    ${data.discountPrice}
                  </h4>
                  {data.price && (
                    <h3 className={`${styles.originalPrice} text-lg line-through text-gray-500`}>${data.price}</h3>
                  )}
                </div>

                <div className="flex items-center mt-8 justify-between pr-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold px-4 py-2 hover:opacity-90 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-white text-gray-800 font-medium px-6 py-2 text-center min-w-[50px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold px-4 py-2 hover:opacity-90 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => addToWishlistHandler(data)}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded-lg !h-12 flex items-center justify-center hover:opacity-90 transition-opacity`}
                    onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center text-lg">
                    Add to cart <AiOutlineShoppingCart className="ml-2" size={22} />
                  </span>
                </div>
                <div className="flex items-center pt-8 border-t mt-8 border-gray-200">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt=""
                      className="w-[60px] h-[60px] rounded-full mr-4 border-2 border-teal-500 p-1"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} text-lg font-semibold hover:text-teal-600 transition-colors`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] hover:bg-[#5636b8] transition-colors !rounded-lg !h-12 ml-auto`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-2" />
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
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"}
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"}
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className={"text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"}
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">{data.description}</p>
          <Ratings rating={data?.ratings} />
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2" key={index}>
                <img src={`${item.user.avatar?.url}`} alt="" className="w-[50px] h-[50px] rounded-full" />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && <h5>No Reviews have for this product!</h5>}
          </div>
        </div>
      ) : null}

      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img src={`${data?.shop?.avatar?.url}`} className="w-[50px] h-[50px] rounded-full" alt="" />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-2 text-[15px]">({averageRating}/5) Ratings</h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on: <span className="font-[500]">{data.shop?.createdAt?.slice(0, 10)}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products: <span className="font-[500]">{products && products.length}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews: <span className="font-[500]">{totalReviewsLength}</span>
              </h5>
              <Link to="/">
                <div className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}>
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetails
