import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const inputsRef = useRef([]);
  const navigate = useNavigate();


  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = inputsRef.current.map(input => input.value).join("");
    console.log("Entered OTP:", otp);
  };

  const newpassword = () => {
    navigate('/newpassword')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e9f2fb]">
      <div className="max-w-[500px] rounded-[40px] border-4 border-white bg-gradient-to-b from-white to-[#f4f7fb] p-6 shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]">
        <h1 className="text-center text-3xl font-black text-[#1089d3]">Enter OTP</h1>
        <p className="mt-4 text-center text-sm text-gray-500">
          We've sent a 6-digit code to your email.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none"
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          <button
            type="submit" onClick={newpassword}
            className="w-full rounded-[20px] bg-gradient-to-r from-[#1089d3] to-[#12b1d1] py-3 font-bold text-white shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
          >
            Verify Code
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          Didn't get the code?
          <a href="" className="text-[#0099ff] hover:underline ml-1">Resend</a>
        </div>

        <a href="#" className="mt-4 block text-center text-[9px] text-[#0099ff]">
          Learn user licence agreement
        </a>
      </div>
    </div>
  );
};

export default OtpVerify;
