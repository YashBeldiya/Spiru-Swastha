import React from 'react';

const SubscribeEmail = () => {
  return (
    <div className="bg-gray-50 py-40 flex flex-col items-center justify-center px-4 relative overflow-hidden subscribe-email">
      <h2 className="text-xl md:text-4xl font-extrabold text-center text-black mb-8">
        Stay Up to Date with All News <br /> and Exclusive Offers
      </h2>

      <div className="flex w-full max-w-2xl items-center border border-green-600 rounded-full overflow-hidden shadow-md">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-grow px-6 py-3 text-lg outline-none text-black"
        />
        <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-2.5 text-lg me-0.5 rounded-full transition-all duration-300">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default SubscribeEmail;
