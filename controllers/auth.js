import crypto from "crypto";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/user.js" ;
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//LOGIN
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    
    const oldUser = await User.findOne({ email }).select("+password");

    if (!oldUser) {
      return next(new ErrorResponse("Incorrect password or email address", 401));
    };
  
   const isMatch = await bcrypt.compare(password, oldUser.password )
    if (!isMatch) {
      return next(new ErrorResponse("Incorrect password or email address", 401));
    }
    
    const token = jwt.sign( { email: oldUser.email, id: oldUser._id }, process.env.JWT_SECRET, { expiresIn: '10min' } );

      res.status(201).json({result: oldUser, token});
    
 } catch (err) {
    next(err);
  }
};

// @desc    Register user
export const register = async (req, res, next) => {
  const {username, email, password, firstname, lastname } = req.body;

  try {
     const oldUsername = await User.findOne({ username })
    const oldEmail = await User.findOne({ email });

    if (oldEmail) {
      return next(new ErrorResponse("Email address already exists. Please login", 401));
    }
    if (oldUsername) {
      return next (new ErrorResponse("Username already exists. Please choose another one", 401))
    }

    const salt = await bcrypt.genSalt(12);
     const hashedPassword = await bcrypt.hash(password, salt);


    const result = await User.create({ username, email, password: hashedPassword, firstname, lastname });

    const token = jwt.sign( { email: result.email, id: result._id }, process.env.JWT_SECRET , { expiresIn: '10min' });
    res.status(201).json({result, token});
    
  
  } catch (err) {
    next(err);
  }
};



//FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email address not found. Please try another email address or register.", 404));
    }

    // Reset Token Gen and add to database hashed version of token
    const resetToken = user.getResetPasswordToken();
  //save the token to the database
    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `https://mhatu.onrender.com/#/passwordreset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <h4>If you did not request to reset your password, or you did by mistake, simply ignore this email. Your old password will still work</h4>
      <p>This link is only valid for 10 minutes</p>
      <p>Click on the link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
       
      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

//RESET PASSWORD
export const resetPassword = async (req, res, next) => {

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");


  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Link not valid, please try again", 400));
    }

    
    const salt = await bcrypt.genSalt(12);
    
//get the password from the body and hash it with salt and delete/undefine the resetPasswordToken and resetPasswordExpire token
    const hashed = await bcrypt.hash(req.body.password, salt);
    user.password = (hashed);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    //saves to the database 
     await user.save(); 


    //the token must match the token sent to database when the forgot button was pressed
    res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token : jwt.sign({ user }  ,process.env.JWT_SECRET , { expiresIn: '10min' }),
    });
  } catch (err) {
    next(err);
  }
};
