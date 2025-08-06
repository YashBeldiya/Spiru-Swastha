const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs')
const generateOtp = require('../utils/generateOtp');
const nodemailer = require('nodemailer');
const html = fs.readFileSync('./views/email.html','utf-8')

// wvxb elyd ppbd geeh


// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'Yash');
    if (decoded.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
const registerUser = async (req,res) => {
    const {name,lastName,email,password,role} = req.body
    const existingUser = await User.findOne({email})
    try{
        if(existingUser) return res.status(404).json({
            success : false,
            message : "User already registered...!"
        })

        const hashPassword = await bcrypt.hash(password, 10);
        const payload = {
        name,
        email,
        lastName,
        password : hashPassword,
        role : role ? role : "Admin"
       }
       const user = await User.create(payload)

       return res.status(201).json({
        success : true,
        data : {...user._doc,password:undefined,otp:undefined},
        message : "User register successfully...!"
    })
    }
    catch (error){
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

const LoginUser = async (req,res) => {
    const {email,password} = req.body
    try{
        if(!(email && password)) return res.status(400).json({
            success : false,
            message : "All feilds are required...!!"
        })
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success : false,
                message:'Please enter valid email or password'
            })
        }
       const token = jwt.sign({
        email: email,
        userId : user._id,
        role : user.role
       },"Yash",{expiresIn : "1d"})
        const existingUserpassword = await bcrypt.compare(password, user.password);
        if(existingUserpassword) return res.status(200).cookie('accessToken',token,{
            maxAge : 1000*60*60*24,
            httpOnly : true,
            sameSite : 'none',
            secure : true
        }).json({
            success : true,
            data:token,
            user : user,
            message:'Login Successfully...!'
        })
        return res.status(404).json({
            success : false,
            message:'Please enter valid email or password'
        })  
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

const LoginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required...!!",
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Please enter valid email or password",
        });
      }
  
      // Check if the user is an Admin
      if (user.role !== "Admin") {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to access this page...!!",
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(404).json({
          success: false,
          message: "Please enter valid email or password",
        });
      }
  
      const token = jwt.sign(
        {
          email: email,
          userId: user._id,
          role: user.role,
        },
        "Yash",
        { expiresIn: "1d" }
      );
  
      return res
        .status(200)
        .cookie("accessToken", token, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({
          success: true,
          data: token,
          user: { ...user._doc, password: undefined },
          message: "Login Successfully...!",
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const verifyEmail = async (req,res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({success : false,message : "User not found...!"})
        const otp = generateOtp()
        const otpexpireAt = Date.now() + 1000 * 60;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'yashbeladiya0306@gmail.com',
              pass: 'wvxb elyd ppbd geeh'
            }
          });
          const mailOptions = {
            from: 'yashbeladiya0306@gmail.com',
            to: 'laxilov830@iridales.com',
            subject: 'Sending Email using Node.js',
            html: html.replace("{{otp}}",otp)
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        await User.updateOne({email},{$set : {otp : otp,otpexpireAt : otpexpireAt}})
        return res.status(200).json({success : true,data:user._id,message : "Email verify successfully...!"})
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

const verifyOtp = async (req,res) => {
    const {otp,userId : _id, type } = req.body
    try {
        const user = await User.findOne({_id,otp, otpexpireAt : {$gt : Date.now()}})
        if(!user) return res.status(404).json({success:false,message:"Invalid otp or expired...!"})

        const isVerify = type === 'resetPassword' ? user.isVerify : true;

        await User.updateOne({_id : user?._id},{$set : {otp : null,otpexpireAt: Date.now(),isVerify}})

        return res.status(200).json({success:true,data : user._id,message:"Otp verify successfully...!"})
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

const resetPassword = async (req,res) => {
    const {password,userId : _id} = req.body
    try {
        const user = await User.findById(_id)
        if(!user) return res.status(404).json({success:false,message:"User not found...!"})
        
        const hashPassword = await bcrypt.hash(password, 10);

        await User.updateOne({_id : user._id},{$set : {password : hashPassword }})

        return res.status(200).json({success : true,message:"Reset password successfully...!"})
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

const userProfile = async (req,res) => {
    const user = await User.findOne({_id : req.user._id})
    try {
        return res.status(200).json({success : true,data : {...user._doc,password:undefined,otp:undefined,otpexpireAt:undefined},message:"User get successfully...!"})
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

const changePassword = async (req,res) => {
    const {oldPassword , newPassword} = req.body
    try {
        const existingUserpassword = await bcrypt.compare(oldPassword, req.user.password);
        if(!existingUserpassword) return res.status(404).json({success:false,message:"Incorrect Old Password...!"})
        const hashPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne({_id:req.user._id},{$set : {password : hashPassword}})
        return res.status(200).json({success:true,message:"Password change successfully...!"})

        
    } catch (error) {
        return res.status(500).json({
            success : false,
            message:error.message
        })
    }
}

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -otp -otpexpireAt');
    return res.status(200).json({
      success: true,
      data: users,
      message: 'Users fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isVerify } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isVerify = isVerify !== undefined ? isVerify : user.isVerify;
    await user.save();
    return res.status(200).json({
      success: true,
      data: { ...user._doc, password: undefined, otp: undefined, otpexpireAt: undefined },
      message: 'User updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, lastName } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.lastName = lastName || user.lastName;
    await user.save();
    return res.status(200).json({
      success: true,
      data: { ...user._doc, password: undefined, otp: undefined, otpexpireAt: undefined },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {verifyAdmin,registerUser,LoginUser,verifyEmail,verifyOtp,resetPassword,userProfile,changePassword,LoginAdmin,getAllUsers,
  updateUser,
  updateProfile,
  deleteUser,}