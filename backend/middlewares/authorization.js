const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports =(role) => async (req,res,next) => {
    const authorization = req.get("Authorization");
    // const token = req.cookies.accessToken
    if(!authorization) return res.status(401).json({success : false,message : "Token Required...!!"})
   

    const token = authorization.split(" ")[1];
    // console.log(token);
    try{
        const decodeToken = jwt.verify(token,"Yash");
        console.log(decodeToken,"DecodeToken");

        const user = await User.findById(decodeToken.userId).select(" -otp -otpexpireAt")
        console.log(user)
        if(!role.includes(user.role)) return res.status(401).json({success:false,message:"Unauthorized User..!"})
        req.user = user;
        next()
        
    }catch(error) {
        return res.status(403).json({success : false,message : error.message})
    }
}