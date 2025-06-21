const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const router = express.Router();
const Product = require("../model/productModel");
// const Order = require("../model/orderModel");
const Shop = require("../model/shopModel");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// create product
router.post(
    "/create-product",
    catchAsyncErrors(async (req, res, next) => {
      try {
  
        const shopId = req.body.shopId;
   
        const shop = await Shop.findById(shopId);
        if (!shop) {
          return next(new ErrorHandler("Shop Id is invalid!", 400));
        } else {
          let images = [];
  
          // Check if images[] exists and is not a string
          if (Array.isArray(req.body.images)) {
            images = req.body.images; // directly assign if it's already an array
          } else if (req.body.images) {
            // If images[] is a string (Base64), convert it into an array
            images = [req.body.images];
          }
  
          const imagesLinks = [];
  
          // Upload images to Cloudinary
          for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
              folder: "avatar",
              width: 150,
              crop: "scale",
            });

            imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
          }
  
          const productData = req.body;
          productData.images = imagesLinks;
          productData.shop = shop;
  

  
          const product = await Product.create(productData);
  
          res.status(201).json({
            success: true,
            product,
          });
        }
      } catch (error) {
        return next(new ErrorHandler(error.message || error, 400));
      }
    })
  );
  

  // get all products of a shop
router.get(
    "/get-all-products-shop/:id",
    
    catchAsyncErrors(async (req, res, next) => {
      try {
        console.log(req.params.id)
        const products = await Product.find({ shopId: req.params.id });
  
        res.status(201).json({
          success: true,
          products,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );

 // delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      for (let i = 0; 1 < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }

      await product.deleteOne();


      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      console.log(products)

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


router.put(
  "/create-new-review",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId } = req.body;

      if (!user || !user._id || !rating || !productId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Check if user already reviewed
      const existingReview = product.reviews.find(
        (rev) => rev.user._id.toString() === user._id.toString()
      );

      if (existingReview) {
        // Update existing review
        existingReview.rating = rating;
        existingReview.comment = comment;
      } else {
        // Add new review
        product.reviews.push({
          user,
          rating,
          comment,
          createdAt: new Date(),
        });
      }

      // Recalculate average rating
      let totalRating = 0;
      product.reviews.forEach((rev) => {
        totalRating += rev.rating;
      });

      product.ratings = totalRating / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      res.status(201).json({
        success: true,
        message: "Reviewed successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

module.exports = router;