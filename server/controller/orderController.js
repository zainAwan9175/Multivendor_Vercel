const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { isAuthenticated,isSeller } = require("../middleware/auth");
const Order = require("../model/orderMoel");
const Shop = require("../model/shopModel");
const Product = require("../model/productModel");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymnentInfo } = req.body;

      //   create map with key shopId to seprate each  items of the shop
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        console.log("hi",items)
let calculatedTotalPrice = 0;

for (let i = 0; i < items.length; i++) {
  calculatedTotalPrice += items[i].discountPrice * items[i].qty;
  
}
  const shipping = calculatedTotalPrice * 0.1;
  calculatedTotalPrice=calculatedTotalPrice+shipping;
  const shop = await Shop.findById(shopId);
shop.availableBalance = shop.availableBalance + calculatedTotalPrice;
await shop.save({ validateBeforeSave: false });

  await shop.save({validateBeforeSave:false})
          const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice:calculatedTotalPrice,
          paymnentInfo,
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        console.log("Updating stock for order:", req.params.id);
        for (const o of order.cart) {
          console.log("Updating product:", o._id, "qty:", o.qty);
          await updateOrder(o._id, o.qty);
        }
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymnentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          console.log("Before update - Product:", product.name, "Stock:", product.stock, "Sold:", product.sold_out);
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
          console.log("After update - Product:", product.name, "Stock:", product.stock, "Sold:", product.sold_out);
        } else {
          console.log("Product not found with ID:", id);
        }
      }

      async function updateSellerInfo(amount) {}
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        for (const o of order.cart) {
          await updateOrder(o._id, o.qty);
        }
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock += qty;
          product.sold_out -= qty;
          await product.save({ validateBeforeSave: false });
        }
      } 
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
//   isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;