import React from 'react'

const OtpVerification = () => {
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#e9f2fb]">
            <div
                className="max-w-[400px] rounded-[40px] border-4 border-white bg-gradient-to-b
           from-white to-[#f4f7fb] p-6 shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]"
            >

                <h1 className="text-center text-3xl font-black text-[#1089d3]">
                    Enter OTP
                </h1>

                <p className="mt-4 text-center text-sm text-gray-500">
                    We've sent a 6-digit code to your email. Enter it below to verify.
                </p>

                <form className="mt-6 space-y-4" action="#">
                    <div className="flex justify-between gap-2">
                        <input type="text" maxLength="1" className="otp-input w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none" />
                        <input type="text" maxLength="1" className="otp-input w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none" />
                        <input type="text" maxLength="1" className="otp-input w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none" />
                        <input type="text" maxLength="1" className="otp-input w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none" />
                        <input type="text" maxLength="1" className="otp-input w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none" />
                        <input type="text" maxLength="1" className="otp-input w-10 h-12 rounded-xl border border-gray-300 bg-white text-center text-xl text-gray-700 shadow-[0_10px_10px_-5px_#cff0ff] focus:border-[#12b1d1] focus:outline-none" />
                    </div>

                    <button
                        type="button"
                        className="w-full rounded-[20px] bg-gradient-to-r from-[#1089d3] to-[#12b1d1]
               py-3 font-bold text-white shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)]
               transition-transform duration-200
               hover:scale-[1.03] hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)]
               active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                    >
                        Verify Code
                    </button>
                </form>

                <div className="mt-4 text-center text-xs text-gray-500">
                    Didn't get the code?
                    <a href="#" className="text-[#0099ff] hover:underline">Resend</a>
                </div>

                <a href="#" className="mt-4 block text-center text-[9px] text-[#0099ff]">
                    Learn user licence agreement
                </a>
            </div>
        </div>
    )
}

export default OtpVerification