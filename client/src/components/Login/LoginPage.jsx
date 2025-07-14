import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { toast } from "react-toastify";
import axios from "axios";

import styles from "../../styles/styles.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/user/login`,
          { email, password },
          { withCredentials: true }
        )
        .then((res) => {
          toast.success("Login success");
          navigate("/");
          window.location.reload(true);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
          setLoading(false);
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold tracking-wider font-[Poppins] text-emerald-600 mb-1">
            Market<span className="text-amber-400">Nest</span>
          </h1>
          <h2 className="text-xl font-bold text-emerald-800 mb-1">Welcome Back</h2>
          <p className="text-emerald-600 text-xs">Sign in to your account</p>
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md py-6 px-5 shadow-2xl rounded-2xl border border-emerald-100">
          <form className="space-y-4" onSubmit={submitFormHandler}>
            {/* Email Input */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-emerald-800">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="h-4 w-4 text-emerald-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="block w-full pl-9 pr-3 py-2 border-2 border-emerald-200 rounded-lg shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-emerald-800 font-medium transition-all duration-200 disabled:bg-emerald-50 disabled:cursor-not-allowed text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-emerald-800">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-4 w-4 text-emerald-500" />
                </div>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="block w-full pl-9 pr-10 py-2 border-2 border-emerald-200 rounded-lg shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-emerald-800 font-medium transition-all duration-200 disabled:bg-emerald-50 disabled:cursor-not-allowed text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setVisible(!visible)}
                >
                  {visible ? (
                    <AiOutlineEye className="h-4 w-4 text-emerald-500 hover:text-amber-500 transition-colors" />
                  ) : (
                    <AiOutlineEyeInvisible className="h-4 w-4 text-emerald-500 hover:text-amber-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-emerald-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-emerald-700 font-medium"
                >
                  Remember Me
                </label>
              </div>

              <div className="text-xs">
                <a
                  href="/forgot-password"
                  className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full h-10 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-bold rounded-lg text-white transition-all duration-200 ${
                  loading 
                    ? "bg-emerald-300 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <p className="text-emerald-700 text-xs">
                Don't have an account?{" "}
                <Link 
                  to="/sign-up" 
                  className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
