module.exports = (req,res,next) => {
    return res.status(400).json({success :false,message : "Invalid API Path"})
}