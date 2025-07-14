"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi"
import { IoCloudUploadOutline } from "react-icons/io5"
import axios from "axios"
import { toast } from "react-toastify"

import styles from "../../styles/styles.js"

const SignUp = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileInputChange = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result)
      }
    }

    reader.readAsDataURL(e.target.files[0])
  }

  const submitFormHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    const userData = {
      name,
      email,
      password,
      file: avatar,
    }

    const uri = `${process.env.REACT_APP_BACKEND_URL}/user/create-user`

    try {
      const response = await axios.post(uri, userData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      setName("")
      setPassword("")
      setEmail("")
      setAvatar(null)

      console.log("Success response:", response)
      toast.success(response.data.message)
    } catch (error) {
      console.error("Error response:", error)
      toast.error(error.response?.data?.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

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
          <h2 className="text-xl font-bold text-emerald-800 mb-1">Create Your Account</h2>
          <p className="text-emerald-600 text-xs">Join thousands of satisfied customers</p>
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md py-6 px-5 shadow-2xl rounded-2xl border border-emerald-100">
          <form className="space-y-4" onSubmit={submitFormHandler}>
            {/* Full Name Input */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-semibold text-emerald-800">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="h-4 w-4 text-emerald-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="block w-full pl-9 pr-3 py-2 border-2 border-emerald-200 rounded-lg shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-emerald-800 font-medium transition-all duration-200 disabled:bg-emerald-50 disabled:cursor-not-allowed text-sm"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                  id="email"
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
                  id="password"
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  className="block w-full pl-9 pr-10 py-2 border-2 border-emerald-200 rounded-lg shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-emerald-800 font-medium transition-all duration-200 disabled:bg-emerald-50 disabled:cursor-not-allowed text-sm"
                  placeholder="Create a strong password"
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

            {/* Avatar Upload */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-emerald-800">
                Profile Picture
              </label>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-12 w-12 rounded-full object-cover border-3 border-emerald-200 shadow-lg"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-emerald-100 border-3 border-emerald-200 flex items-center justify-center">
                      <RxAvatar className="h-6 w-6 text-emerald-500" />
                    </div>
                  )}
                </div>
                
                <label
                  htmlFor="file-input"
                  className={`flex items-center justify-center px-4 py-2 border-2 border-emerald-300 rounded-lg shadow-sm text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-amber-400 transition-all duration-200 cursor-pointer ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <IoCloudUploadOutline className="h-4 w-4 mr-1" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    name="file"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    disabled={loading}
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
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
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-emerald-700 text-xs">
                Already have an account?{" "}
                <Link 
                  to="/Login" 
                  className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
