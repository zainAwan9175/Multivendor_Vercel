import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useEffect } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
 import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";

import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    window.scrollTo(0, 0);
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const paymentHandler = async (e) => {
    e.preventDefault();

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const responce  = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/payment/process`,
        paymentData,
        config
      );

      const client_secret = responce.data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymnentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status, 
            type: "Credit Card",
          };
    
          await axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymnentInfo = {
      type: "Cash On Delivery",
    };

    await axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8 bg-emerald-50 min-h-screen">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex gap-8">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
             onApprove={onApprove}
            createOrder={createOrder}
             paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
   cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-xl p-6 pb-8 shadow-lg border border-emerald-100">
      <h5 className="text-[20px] font-bold text-emerald-800 mb-6">Payment Methods</h5>
      {/* select buttons */}
      <div className="space-y-6">
        <div className="flex w-full pb-4 border-b border-emerald-200 mb-4">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-emerald-400 relative flex items-center justify-center cursor-pointer hover:border-emerald-600 transition-colors"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-emerald-600 rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-3 font-semibold text-emerald-800">
            Pay with Debit/Credit Card
          </h4>
        </div>

        {/* pay with card */}
        {select === 1 ? (
          <div className="w-full pb-6">
            <form className="w-full space-y-4" onSubmit={paymentHandler}>
              <div className="w-full flex gap-4">
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-semibold text-emerald-700">Name On Card</label>
                  <input
                    required
                    placeholder={user && user.name}
                    className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-emerald-800"
                    value={user && user.name}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-semibold text-emerald-700">Exp Date</label>
                  <CardExpiryElement
                    className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#065f46",
                        },
                        empty: {
                          color: "#065f46",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#059669",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-semibold text-emerald-700">Card Number</label>
                  <CardNumberElement
                    className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#065f46",
                        },
                        empty: {
                          color: "#065f46",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#059669",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2 text-sm font-semibold text-emerald-700">CVV</label>
                  <CardCvcElement
                    className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#065f46",
                        },
                        empty: {
                          color: "#065f46",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#059669",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <input
                type="submit"
                value="Submit Payment"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 mt-4"
              />
            </form>
          </div>
        ) : null}
      </div>

      {/* paypal payment */}
      <div>
        <div className="flex w-full pb-4 border-b border-emerald-200 mb-4">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-emerald-400 relative flex items-center justify-center cursor-pointer hover:border-emerald-600 transition-colors"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-emerald-600 rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-3 font-semibold text-emerald-800">
            Pay with PayPal
          </h4>
        </div>

        {/* pay with payement */}
        {select === 2 ? (
          <div className="w-full pb-6">
            <div
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 text-center"
              onClick={() => setOpen(true)}
            >
              Pay with PayPal
            </div>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
                  <div className="w-full flex justify-end p-3">
                    <RxCross1
                      size={30}
                      className="cursor-pointer absolute top-3 right-3"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      onApprove={onApprove}
                      createOrder={createOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* cash on delivery */}
      <div>
        <div className="flex w-full pb-4 border-b border-emerald-200 mb-4">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-emerald-400 relative flex items-center justify-center cursor-pointer hover:border-emerald-600 transition-colors"
            onClick={() => setSelect(3)}
          >
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-emerald-600 rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-3 font-semibold text-emerald-800">
            Cash on Delivery
          </h4>
        </div>

        {/* cash on delivery */}
        {select === 3 ? (
          <div className="w-full pb-6">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Confirm Order"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105"
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
  return (
    <div className="w-full bg-white rounded-xl p-6 pb-8 shadow-lg border border-emerald-100">
      <h5 className="text-[20px] font-bold text-emerald-800 mb-4">Order Summary</h5>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <h3 className="text-[16px] font-medium text-emerald-700">Subtotal:</h3>
          <h5 className="text-[18px] font-semibold text-emerald-800">${orderData?.subTotalPrice}</h5>
      </div>
        <div className="flex justify-between items-center py-2">
          <h3 className="text-[16px] font-medium text-emerald-700">Shipping:</h3>
          <h5 className="text-[18px] font-semibold text-emerald-800">${shipping}</h5>
      </div>
        <div className="flex justify-between items-center py-2 border-b border-emerald-200 pb-4">
          <h3 className="text-[16px] font-medium text-emerald-700">Discount:</h3>
          <h5 className="text-[18px] font-semibold text-amber-600">
          {orderData?.discountPrice ? "$" + orderData.discountPrice : "-"}
        </h5>
      </div>
        <div className="flex justify-between items-center pt-2">
          <h3 className="text-[20px] font-bold text-emerald-800">Total:</h3>
          <h5 className="text-[22px] font-bold text-emerald-800">
        ${orderData?.totalPrice}
      </h5>
        </div>
      </div>
    </div>
  );
};

export default Payment;