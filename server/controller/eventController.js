const express = require("express");
const Shop = require("../model/shopModel");
const Event = require("../model/eventModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const router = express.Router();
const cloudinary = require("cloudinary");

// create event
router.post(
  "/create-event",
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

        const eventData = req.body;
        eventData.images = imagesLinks;
        eventData.shop = shop;

        const event = await Event.create(eventData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);


      if (!event) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      for (let i = 0; i < event.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          event.images[i].public_id
        );
      }

      await event.deleteOne();

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// // all events --- for admin
// router.get(
//   "/admin-all-events",
//   isAuthenticated,
//   isAdmin("Admin"),
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const events = await Event.find().sort({
//         createdAt: -1,
//       });
//       res.status(201).json({
//         success: true,
//         events,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;