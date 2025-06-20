const express = require("express")
const Messages = require("../model/messages")
const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncError")
const cloudinary = require("cloudinary").v2

const router = express.Router()

router.post(
  "/create-new-message",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sender, text, conversationId, images } = req.body
      let myCloud

      if (images) {
        myCloud = await cloudinary.uploader.upload(images, {
          folder: "messages",
        })
      }

      const messageData = {
        conversationId,
        sender,
      }

      if (text) {
        messageData.text = text
      }

      if (images && myCloud) {
        messageData.images = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
      }

      const message = new Messages(messageData)
      await message.save()

      res.status(201).json({
        success: true,
        message,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  }),
)

// get all messages with conversation ID
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      }).sort({ createdAt: 1 })

      res.status(201).json({
        success: true,
        messages,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500))
    }
  }),
)

module.exports = router
