import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-white text-emerald-900 rounded-t-2xl shadow-2xl border-t border-emerald-100">
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-emerald-600 py-8 rounded-t-2xl">
        <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-extrabold md:w-2/5 text-white font-[Poppins]">
          <span className="text-amber-400">Subscribe</span> us for get news <br /> events and offers
        </h1>
        <div>
          <input
            type="text"
            required
            placeholder="Enter your email..."
            className="text-emerald-900 bg-white sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-2.5 rounded-full px-4 focus:outline-none shadow"
          />
          <button className="bg-emerald-600 hover:bg-emerald-700 duration-300 px-6 py-2.5 rounded-full text-white font-bold font-[Poppins] md:w-auto w-full shadow">
            Submit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <div className="flex flex-col items-center gap-2 mb-2">
            <span className="text-4xl font-extrabold tracking-wider font-[Poppins] text-emerald-600 drop-shadow-lg select-none">
              Market<span className="text-amber-400">Nest</span>
            </span>
          </div>
          <p className="text-emerald-800">The home and elements needed to create beautiful products.</p>
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer text-emerald-600 hover:text-amber-400 transition" />
            <AiOutlineTwitter size={25} className="ml-[15px] cursor-pointer text-emerald-600 hover:text-amber-400 transition" />
            <AiFillInstagram size={25} className="ml-[15px] cursor-pointer text-emerald-600 hover:text-amber-400 transition" />
            <AiFillYoutube size={25} className="ml-[15px] cursor-pointer text-emerald-600 hover:text-amber-400 transition" />
          </div>
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-bold text-emerald-700">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-emerald-500 hover:text-amber-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-bold text-emerald-700">Shop</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-emerald-500 hover:text-amber-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center sm:text-start">
          <h1 className="mb-1 font-bold text-emerald-700">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-emerald-500 hover:text-amber-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-emerald-400 text-sm pb-8 border-t border-emerald-100">
        <span>© 2020 MarketNest. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <div className="sm:block flex items-center justify-center w-full">
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt="Payment Methods"
            className="h-8 mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;