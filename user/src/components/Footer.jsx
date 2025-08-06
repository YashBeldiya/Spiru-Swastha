import React from "react";
import logo from '../assets/img/spiru_logo.svg';

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Logo & Description */}
        <div>
          <img src={logo} alt="SpiruSwastha" className=" mb-3" />
          <p className="mb-4">Swastha for Life with Spirulina & Superfood Goodness</p>
          
          {/* Social Icons with Tooltips */}
          <div className="flex gap-2 mt-20 items-center">
            <div className="relative group">
              <FaFacebookF className="text-white bg-green-700 p-2 w-8 h-8  hover:bg-blue-600  transition transform group-hover:-translate-y-1" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Facebook</span>
            </div>
            <div className="relative group">
              <FaInstagram className="text-white bg-green-700 p-2 w-8 h-8  hover:bg-pink-500 transition transform group-hover:-translate-y-1" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">Instagram</span>
            </div>
            <div className="relative group">
              <FaYoutube className="text-white bg-green-700 p-2 w-8 h-8  hover:bg-red-700 transition transform group-hover:-translate-y-1" />
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">YouTube</span>
            </div>
          </div>
        </div>

        {/* Company Section in Two Columns */}
        <div>
          <h4 className="font-semibold text-3xl mb-3">Company</h4>
          <div className="grid grid-cols-2 gap-x-6 font-semibold">
            <ul className="space-y-5">
              <li className="text-green-700 cursor-pointer hover:underline">Home</li>
              
              <li className="cursor-pointer hover:text-green-700">
              <NavLink to='/collection/shop-all'>Shop all </NavLink>
             </li>
              <li className="cursor-pointer hover:text-green-700">Blog</li>
              <li className="cursor-pointer hover:text-green-700">Faqs</li>
              <li className="cursor-pointer hover:text-green-700">Training Center</li>
            </ul>
            <ul className="space-y-5">
              <li className="cursor-pointer hover:text-green-700">About Us</li>
              <li className="cursor-pointer hover:text-green-700">Contact Us</li>
            <NavLink to='/login' >
            <li className="cursor-pointer hover:text-green-700 mb-4">My Account</li>
            </NavLink>
              <li className="cursor-pointer hover:text-green-700">Track Your Order</li>
            </ul>
          </div>
        </div>

        {/* Best Selling Products */}
        <div>
          <h4 className="font-semibold text-3xl mb-3">Best Selling<br />Products</h4>
          <ul className="space-y-5 font-semibold">
            <li className="cursor-pointer hover:text-green-700">Spirulina Tablet</li>
            <li className="cursor-pointer hover:text-green-700">Spirulina Capsule</li>
            <li className="cursor-pointer hover:text-green-700">Spiruvita Oil</li>
            <li className="cursor-pointer hover:text-green-700">Spirushine Shampoo</li>
            <li className="cursor-pointer hover:text-green-700">Moringa Tablet</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-3xl mb-3">Contact Us</h4>
          <p><strong>Address :</strong> 2nd Floor, Flat No. A/203,<br />
            Dev Prayag Residency, Opp.<br />
            Shraddhadip Society, Causeway<br />
            Singanpor Road, Singanpor, Surat,<br />
            Gujarat, 395004</p>
          <p className="mt-3"><strong>E-mail:</strong> info@spiruswastha.com</p>
        </div>
      </div>

      {/* Bottom Policy Links */}
      <div className="mt-10 pt-6 flex flex-wrap justify-center gap-40 text-gray-600 text-sm">
        <a href="#" className="hover:text-green-700">Privacy Policy</a>
        <a href="#" className="hover:text-green-700">Terms of Service</a>
        <a href="#" className="hover:text-green-700">Return and Refund Policy</a>
        <a href="#" className="hover:text-green-700">Shipping Policy</a>
        <a href="#" className="hover:text-green-700">Contact Information</a>
      </div>
    </footer>
  );
};

export default Footer;
