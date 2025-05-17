import React, { useState } from "react";
import HR from "../Login/Images/HR.svg";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";
import toast from 'react-hot-toast';

export default function Login() {
  // State to hold user input and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!userType) {
      newErrors.userType = "Please select a user type";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: userType === 'teacher' ? 'professor' : userType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user data
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast.success('Login successful!');
        
        // Navigate based on user role
        switch (data.user.role) {
          case 'admin':
            navigate(`/admin/${data.user.id}`);
            break;
          case 'professor':
            navigate(`/Teacher/Dashboard/${data.user.id}/Home`);
            break;
          case 'student':
            navigate(`/Student/Dashboard/${data.user.id}/Search`);
            break;
          default:
            navigate('/');
        }
      } else {
        // Handle different error cases
        if (response.status === 401) {
          toast.error("Invalid email or password");
        } else if (response.status === 422) {
          setErrors(data.errors || {});
          toast.error(data.message || "Validation error");
        } else {
          toast.error(data.message || "An error occurred during login");
        }
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <div className="section">
        <article className="article">
          <div className="header">
            <h3 className="head">WELCOME BACK</h3>
            <h4 className="Sub-head">Login to your account</h4>
          </div>

          <div className="inpts">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="input-x input-4"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}

              <input
                type="password"
                className="input-x input-5"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}

              <div className="rad-btns">
                <Radiobtn userType={userType} setUserType={setUserType} disabled={isLoading}/>
              </div>
              {errors.userType && (
                <div className="error-message">{errors.userType}</div>
              )}

              <div className="signupage">
                <span>Don't have an account? </span>
                <NavLink to="/signup" style={{ color: "green" }} className="link">
                  Signup
                </NavLink>
              </div>
              <div className="btn">  
                <button 
                  type="submit" 
                  className="btn-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </article>

        <div className="right-part">
          <img src={HR} alt="" className="imgs" />
        </div>
      </div>
    </>
  );
}
