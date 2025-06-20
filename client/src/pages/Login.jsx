import React from 'react'
import LoginPage from '../components/Login/LoginPage'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Login = () => {
  const {user,isAuthenticated}=useSelector((state)=>state.user)
  const navigate=useNavigate()
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div><LoginPage/></div>
  )
}

export default Login