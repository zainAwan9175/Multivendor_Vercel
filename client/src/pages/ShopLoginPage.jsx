import React, { useEffect } from "react";
import ShopLogin from "../components/Shop/ShopLogin.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isloading, isSeller, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true && seller && seller._id) {
      navigate(`/dashboard`);
    }
  }, [isSeller, seller, navigate]);

  return (
    <div>
      <ShopLogin />
    </div>
  );
};

export default ShopLoginPage;
