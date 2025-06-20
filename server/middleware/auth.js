const ErrorHandler =require("../utils/ErrorHandler");
const catchAsyncError =require("./catchAsyncError");

const User = require("../model/userModel");
const Shop=require("../model/shopModel")
const  jwt  = require("jsonwebtoken");
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {

    const { token } = req.cookies;

  
    if (!token) {
      return next(new ErrorHandler("Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
const user= await User.findById(decodedData.id);
if (!user) {
    return next(new ErrorHandler("Login to access this resource", 401));
  }
req.user =user;
  
    return next();
  });



  exports.isSeller = catchAsyncError(async (req, res, next) => {
    const { seller_token } = req.cookies;

  
    if (!seller_token) {
      return next(new ErrorHandler("Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  
    const seller = await Shop.findById(decodedData.id);
    if (!seller) {
      return next(new ErrorHandler("Login to access this resource", 401));
    }
    
    req.seller = seller;
    return next();
  });
  