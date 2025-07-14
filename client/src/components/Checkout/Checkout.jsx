import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
   if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
      toast.error("Please choose your delivery address!")
   } else{
    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    }

    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
   }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${process.env.REACT_APP_BACKEND_URL}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {          
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentenge);

  return (
    <div className="w-full flex flex-col items-center py-8 bg-emerald-50 min-h-screen">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-8">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>
      <div
        className="w-[150px] 800px:w-[280px] mt-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 flex items-center justify-center"
        onClick={paymentSubmit}
      >
        <h5 className="text-white text-center whitespace-nowrap">Go to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-xl p-6 pb-8 shadow-lg border border-emerald-100">
      <h5 className="text-[20px] font-bold text-emerald-800 mb-4">Shipping Address</h5>
      <form>
        <div className="w-full flex pb-4">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              className="w-[95%] px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        <div className="w-full flex pb-4">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className="w-[95%] px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        <div className="w-full flex pb-4">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Country</label>
            <select
              className="w-[95%] px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">City</label>
            <select
              className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-4">
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Address1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-[95%] px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2 text-sm font-semibold text-emerald-700">Address2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
            />
          </div>
        </div>

        <div></div>
      </form>
      <h5
        className="text-[16px] cursor-pointer inline-block text-amber-600 hover:text-amber-700 font-semibold mt-4 transition-colors"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex items-center mt-2 p-2 hover:bg-emerald-100 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  className="mr-3 text-amber-600 focus:ring-amber-500 border-emerald-300 rounded"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                <h2 className="text-emerald-800 font-medium">{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,  
  totalPrice, 
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) => {
  return (
    <div className="w-full bg-white rounded-xl p-6 pb-8 shadow-lg border border-emerald-100">
      <h5 className="text-[20px] font-bold text-emerald-800 mb-4">Order Summary</h5>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <h3 className="text-[16px] font-medium text-emerald-700">Subtotal:</h3>
          <h5 className="text-[18px] font-semibold text-emerald-800">${subTotalPrice}</h5>
      </div>
        <div className="flex justify-between items-center py-2">
          <h3 className="text-[16px] font-medium text-emerald-700">Shipping:</h3>
          <h5 className="text-[18px] font-semibold text-emerald-800">${shipping.toFixed(2)}</h5>
      </div>
        <div className="flex justify-between items-center py-2 border-b border-emerald-200 pb-4">
          <h3 className="text-[16px] font-medium text-emerald-700">Discount:</h3>
          <h5 className="text-[18px] font-semibold text-amber-600">
          - {discountPercentenge ? "$" + discountPercentenge.toString() : null}
        </h5>
        </div>
        <div className="flex justify-between items-center pt-2">
          <h3 className="text-[20px] font-bold text-emerald-800">Total:</h3>
          <h5 className="text-[22px] font-bold text-emerald-800">${totalPrice}</h5>
        </div>
      </div>
      <br />
      {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form> */}
    </div>
  );
};

export default Checkout;