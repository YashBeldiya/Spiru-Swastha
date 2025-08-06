const generateOtp = () => {
    return 100000 + Math.trunc(Math.random()*900000);
}

module.exports = generateOtp