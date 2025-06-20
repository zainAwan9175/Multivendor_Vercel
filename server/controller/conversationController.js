const express = require("express");
const Conversation = require("../model/conversation"); // Make sure model name is correct in the file too
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { isAuthenticated, isSeller } = require("../middleware/auth");

const router = express.Router();

// Create a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    const { groupTitle, userId, sellerId } = req.body;


    if (!groupTitle || !userId || !sellerId) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const existingConversation = await Conversation.findOne({ groupTitle });

    if (existingConversation) {
            console.log(existingConversation)
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    }

    const conversation = await Conversation.create({
      members: [userId, sellerId],
      groupTitle,
    });
     console.log(conversation)
    res.status(201).json({
      success: true,
      conversation,
    });
  })
);

// Get all conversations for seller
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const sellerId = req.params.id;
    console.log("Seller ID:", sellerId);

    const conversations = await Conversation.find({
      members: { $in: [sellerId] },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  })
);

// Get all conversations for user
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(req.params.id);
      const conversations = await Conversation.find({
        members: { $in: [req.params.id] },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update the last message in a conversation
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;
      const conversation = await Conversation.findByIdAndUpdate(
        req.params.id,
        {
          lastMessage,
          lastMessageId,
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
