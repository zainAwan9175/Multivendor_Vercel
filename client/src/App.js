import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login, ActivationPage, SignUpPage, HomePage, ProductsPage,
  BestSellingPage, EventsPage, FAQPage, ProductDetailsPage,
  AdminDashboardPage,AdminDashboardWithdrawPage,
  ProfilePage, ShopCreatePage, ShopLogin, ShopActivationPage,CheckoutPage,PaymentPage,OrderDetailsPage,TrackOrder,UserInboxPage
} from './routes/Routes';
import {
 ShopinboxPage, ShopWithDrawMoneyPage,ShopSettingsPage,ShopHomepage,ShopAllRefunds,ShopAllOrders,ShopOrderDetails, ShopDashboardPage, ShopCreateProduct,ShopAllProducts,ShopAllEvents,ShopCreateEvents,ShopAllCoupouns,ShopPreviewPage
} from './routes/ShopRoutes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from './redux/store';
import { loadUser, loadSeller } from './redux/actions/user';
import { useSelector } from 'react-redux';
import ProtectedRoute from './routes/ProctectedRoute';
import SellerProtectedRoute from "./routes/sellerProtectedRoute";
import { useDispatch } from 'react-redux';
import { getAllProductsShop } from './redux/actions/product';
import { getAllEvents } from './redux/actions/event';
import { getAllEventsShop } from './redux/actions/event';
import { getAllProducts } from './redux/actions/product';
import axios from 'axios';
import { useState } from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
function App() {
     const [stripeApikey, setStripeApiKey] = useState("");
  const dispatch = useDispatch();
    const { seller } = useSelector((state) => state.seller);
      async function getStripeApikey() {
    const { data } = await axios.get(`https://multivendor-server.vercel.app/payment/stripeapikey`);
    console.log("in this the stipe api key",data);
    setStripeApiKey(data.stripeApikey);
  }
     useEffect(() => {
      if(seller)
      {
        dispatch(getAllProductsShop(seller._id));
        dispatch(getAllEventsShop(seller._id));
    
        }
        
      }, [dispatch, seller]);
  useEffect(() => {
    dispatch(loadUser());
    dispatch(loadSeller());
        dispatch(getAllEvents())
        dispatch(getAllProducts())
     getStripeApikey()
  }, [dispatch]);
  
 


  return (
    <>
      <BrowserRouter>

        <Routes>
               <Route
  path="/payment"
  element={
    <ProtectedRoute>
      {stripeApikey ? (
        <Elements stripe={loadStripe(stripeApikey)}>
          <PaymentPage />
        </Elements>
      ) : null}
    </ProtectedRoute>
  }
   />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/activate/:activation_token" element={<ActivationPage />} />
          <Route path="/ShopActivationPage/:activation_token" element={<ShopActivationPage />} />
          <Route path="/test" element={<ActivationPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLogin />} />
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

          <Route path="/shop/:id" element={
            <SellerProtectedRoute>
              <ShopHomepage />
            </SellerProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-products" element={
            <SellerProtectedRoute>
            <ShopAllProducts/>
            </SellerProtectedRoute>
          } />
                 <Route path="/dashboard-refunds" element={
            <SellerProtectedRoute>
            <ShopAllRefunds/>
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-orders" element={
            <SellerProtectedRoute>
            <ShopAllOrders/>
            </SellerProtectedRoute>
          } />
          <Route path="/dashboard-events" element={
            <SellerProtectedRoute>
          <ShopAllEvents></ShopAllEvents>
            </SellerProtectedRoute>
          } />

          <Route path="/dashboard-create-product" element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          } />
             <Route path="/dashboard-withdraw-money" element={
            <SellerProtectedRoute>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
          } />
           <Route path="/settings" element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
          } />
            <Route path="/dashboard-messages" element={
            <SellerProtectedRoute>
              <ShopinboxPage
               />
            </SellerProtectedRoute>
          } />
            <Route path="/order/:id" element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
            </SellerProtectedRoute>
          } />
            <Route path="/dashboard-coupons" element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
            </SellerProtectedRoute>
          } />
            <Route path="/dashboard-create-event" element={
            <SellerProtectedRoute>
             <ShopCreateEvents></ShopCreateEvents>
            </SellerProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
            <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
              <Route path="/admin" element={
        
              <AdminDashboardPage />
         
          } />

           <Route path="/admin-withdraw-request" element={
        
              <AdminDashboardWithdrawPage />
         
          } />
          
             <Route path="/inbox" element={
            <ProtectedRoute>
              <UserInboxPage />
            </ProtectedRoute>
          } />
           <Route path="/user/order/:id" element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
<Route path="/user/track/order/:id" element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          } />
            <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
