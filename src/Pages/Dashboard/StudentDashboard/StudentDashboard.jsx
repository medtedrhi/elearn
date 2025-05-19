import React, { useEffect, useState } from 'react'
import teachingImg from '../../Images/Teaching.svg'
import { NavLink, useParams, useNavigate } from 'react-router-dom'
import logo from '../../Images/logo.svg'
import { toast } from 'react-hot-toast'


function StudentDashboard() {
  const { ID } = useParams();
  const navigator = useNavigate();
  const [data, setdata] = useState([]);
  const [error, setError] = useState(null);

  const Handlelogout = async() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token exists, just redirect to login
        navigator('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Clear localStorage and redirect regardless of response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (response.ok) {
        toast.success('Logged out successfully');
      } else {
        console.error('Logout failed:', await response.json());
      }
      navigator('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear localStorage and redirect even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigator('/login');
    }
  }

  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigator('/login');
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${ID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return navigator('/login');
      }

      const user = await response.json();
      if (!response.ok) throw new Error('Fetch failed');

      setdata(user.data || user);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  fetchData();
}, []);


  return (
    <>
    {/* navbar */}
      <nav className='bg-[#04253A] px-10 py-3 flex justify-between items-center'>
      
        <div className='flex items-center gap-3'>
          <img src={logo}
            className="w-14" alt="" />
          <h1 className='text-2xl text-[#4E84C1] font-bold'>eduwise</h1>
        </div>
    
        <button 
          onClick={Handlelogout}
          className='bg-[#4E84C1] hover:bg-[#3a6da3] text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-colors duration-200'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm7 4a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0V7zm2.707 1.293a1 1 0 0 0-1.414 1.414L12.586 11H7a1 1 0 1 0 0 2h5.586l-1.293 1.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </nav>

      <div className='bg-[#008280] flex justify-between items-center'>
        <div className=' text-white font-semibold text-5xl ml-72'>
          <h1 className='mb-5 text-[#071645]'>Welcome to <span className='text-white'>eduwise</span></h1>
          <h3 className='ml-16 text-[#071645]'>{data.Firstname} {data.Lastname}</h3>
        </div>
        <div className='m-5 mr-20'>
          <img src={teachingImg} alt="teaching" width={300}/>
        </div>
      </div>

      {/* sidebar */}
      <div className='bg-[#071645] w-52 min-h-[120vh] max-h-[130vh] absolute top-20'>
        <div className='flex flex-col gap-5 text-xl items-center text-white mt-8 mb-10'>
          <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={50} />
          <p>{data.Firstname} {data.Lastname}</p>
        </div>

        <div className='flex flex-col gap-1'>
          <NavLink to = {`/Student/Dashboard/${ID}/Search`} className={({isActive}) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#4E84C1]" : "p-3 text-center font-semibold text-[#4E84C1]" }> 
          Teacher
          </NavLink>

          <NavLink to = {`/Student/Dashboard/${ID}/Classes`} className={({isActive}) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#4E84C1]" : "p-3 text-center font-semibold text-[#4E84C1]" }> 
          Classes
          </NavLink>

          <NavLink to = {`/Student/Dashboard/${ID}/Courses`} className={({isActive}) => isActive ? "bg-white p-3 px-[4.61rem] text-center font-semibold text-[#4E84C1]" : "p-3 text-center font-semibold text-[#4E84C1]" }> 
          Courses
          </NavLink>
        </div>

      </div>
    </>
  )
}

export default StudentDashboard 