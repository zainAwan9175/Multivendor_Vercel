const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const cloudinary = require("cloudinary");
const mongoose=require("mongoose")
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");

cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
});

router.post(
  "/create-user",
  catchAsyncError(async (req, res, next) => {
    console.log("Received data:", req.body)

    const { name, email, password, file } = req.body

    if (!name || !email || !password || !file) {
      return next(new ErrorHandler("All fields are required", 400)) // Fixed: message first, then status code
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return next(new ErrorHandler(400,`User with this email ${email} already exists.`)) // Fixed: message first, then status code
    }

    try {
      const myCloud = await cloudinary.uploader.upload(file, {
        folder: "avatar",
        width: 150,
        crop: "scale",
      })

      const user = {
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      }

      const activation_token = createActivationToken(user)
      const activationUrl = `https://multivendor-client.vercel.app/activate/${activation_token}`

      await sendEmail({
        email: user.email,
        subject: "Complete your signup by clicking the link inside",
        emailMessage: `Hi ${user.name}!\n\nClick the following link to activate your account:\n\n${activationUrl}`,
      })

      res.status(201).json({
        success: true,
        message: `Please check your email (${user.email}) to activate your account.`,
      })
    } catch (error) {
      console.error("Error in user creation:", error)
      return next(new ErrorHandler(500,"Failed to create user: " + error.message)) // Fixed: message first, then status code
    }
  }),
)


const createActivationToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, {
    expiresIn: "10m",
  });
};

router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    const { activation_token } = req.body;
    const newUser = jwt.verify(activation_token, process.env.JWT_SECRET_KEY);

    if (!newUser) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler(400, "User already exists"));
    }
    user = await User.create({
      name,
      email,
      avatar,
      password,
    });

    sendToken(user, 201, res);
  })
);

// login user
router.post(
  "/login",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler(400, "Please provide the all fields!"));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler(400, "User doesn't exists!"));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler(400, "Please provide the correct information")
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler(401, "User does'nt exist."));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// logout user
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.put(
  "/update-avatar",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { avatar } = req.body ;
      const userId = req.user?._id;

      const user = await User.findById(userId);

      if (!user) {
          return next(new ErrorHandler("User not found", 404));
      }

      if (avatar) {
          // Delete the old avatar if it exists
          if (user.avatar?.public_id) {
              await cloudinary.v2.uploader.destroy(user.avatar.public_id);
          }

          // Upload the new avatar
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
              folder: "avatar",
              width: 150,
          });

          // Update user's avatar
          user.avatar = {
              public_id: myCloud.public_id,
              url: myCloud.url,
          };

          // Save updated user information
          await user.save();
    
      }

      // Respond to the client
      res.status(200).json({
          success: true,
           user
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
router.put(
  "/update-user-password",
  isAuthenticated, // Assuming isAuthenticated is a middleware for checking the user's authentication
  catchAsyncError(async (req, res, next) => {
    try {
      // Get the data from the request body
      const { oldPassword, newPassword, confirmPassword } = req.body;

      // Debugging line to check the user ID
      console.log('User ID:', req.user._id);

      // Check if new password and confirm password match
      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("New password and confirm password do not match", 400));
      }

      // Check if the user exists
      const user = await User.findById(req.user._id.toString()).select('+password');

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      console.log(user)

      // Check if the old password matches
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }




      await user.save();

      // Respond with a success message
      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      // Pass the error to the error handling middleware
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



router.put("/update-user-info", isAuthenticated, catchAsyncError(async (req, res, next) => {
  try {
    const { email, password, phoneNumber, name } = req.body;
    console.log(req.body.email)

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Please provide the correct information", 400));
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(201).json({
      success: true,
      message: "User info updated successfully",
      user:user
    });

  } catch (error) {
    return next(error);
  }
}));


// update user addresses
router.put("/update-user-addresses", isAuthenticated, catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(req.body);

    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (sameTypeAddress) {
      return next(new ErrorHandler(`${req.body.addressType} address already exists`));
    }

    const existsAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );

    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      // add the new address to the array
      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User addresses updated successfully",
      user: user,
    });
    
  } catch (error) {
    return next(error);
  }
}));

router.delete("/delete-user-address/:id", isAuthenticated, catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Filter out the address by ID
    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      user:user
    });

  } catch (error) {
    return next(error);
  }
}));

//find user infromation with the userId
router.get(
  "/user-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;