import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false); // <-- loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/shop/create-shop`, {
          name,
          email,
          password,
          avatar,
          zipCode,
          address,
          phoneNumber,
        })
        .then((res) => {
          toast.success(res.data.message);
          // Reset all fields
          setName("");
          setEmail("");
          setPassword("");
          setAvatar(null);
          setZipCode("");
          setAddress("");
          setPhoneNumber("");
          setLoading(false); // stop loading
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            error.response?.data?.message || "An error occurred while creating shop"
          );
          setLoading(false); // stop loading on error
        });
    } catch (error) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-800">
          Register as a seller
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-white py-8 px-4 shadow-lg rounded-xl border border-emerald-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-emerald-700"
              >
                Shop Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-emerald-200 rounded-md shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-emerald-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone-number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-emerald-200 rounded-md shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-emerald-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-emerald-200 rounded-md shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-emerald-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-emerald-200 rounded-md shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-emerald-700"
              >
                Zip Code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="zipCode"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-emerald-200 rounded-md shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-emerald-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-emerald-200 rounded-md shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Avatar Upload */}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-emerald-700"
              >
                Avatar
              </label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8 text-emerald-400" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-emerald-200 rounded-md shadow-sm text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    onChange={handleFileInputChange}
                    className="sr-only"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full h-[40px] flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  loading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Submit"
                )}
              </button>
            </div>

            {/* Already have account */}
            <div className={`${styles.normalFlex} w-full`}>
              <h4 className="text-emerald-700">Already have an account?</h4>
              <Link to="/shop-login" className="text-amber-600 hover:text-amber-700 pl-2">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;
