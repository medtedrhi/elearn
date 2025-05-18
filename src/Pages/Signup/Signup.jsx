import React, { useState } from "react";
import "./Styles.css";
import { NavLink, useNavigate } from "react-router-dom";
import Images from "../Images/Grammar-correction.svg";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Header from "../Home/Header/Header";
import toast from 'react-hot-toast';
import { id } from "date-fns/locale";

const Signup = () => {
  // State to hold user input and errors
  const [username, setUsername] = useState("");
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

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';
    }

    if (!userType) {
      newErrors.userType = 'Please select a user type';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Map userType to role
    const role = userType === 'teacher' ? 'professor' : 'student';

    // Prepare data object to send to the backend
    const data = {
      username,
      email,
      password,
      role
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Store the token and user data
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        if(!(userType == 'teacher')){
         navigate('/quiz');

        }else{
          console.log(responseData)
          navigate('/Teacher/Dashboard/' + responseData.user.username)
        }
        toast.success('Registration successful!');
        
      } else {
        // Handle validation errors from the server
        if (response.status === 422) {
          setErrors(responseData.errors || {});
        } else {
          toast.error(responseData.message || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('An error occurred during registration');
      console.error('Registration error:', error);
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
            <h3 className="head">WELCOME</h3>
            <h4 className="Sub-head">join us today !!</h4>
          </div>

          <div className="inpts">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-x input-4"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}

              <input
                type="email"
                className="input-x input-6"
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
                className="input-x input-7"
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
                <span>Already have an account? </span>
                <NavLink to="/login" style={{ color: "green" }} className="link">
                  login
                </NavLink>
              </div>
              <div className="btn">  
                <button 
                  type="submit" 
                  className="btn-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing up...' : 'Signup'}
                </button>
              </div>
            </form>
          </div>
        </article>

        <div className="right-part">
          <img src={Images} alt="" className="imgs" />
        </div>
      </div>
      <p className='text-sm text-red-400 absolute bottom-3 left-3'>
        * Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.
      </p>
    </>
  );
};

export default Signup;
