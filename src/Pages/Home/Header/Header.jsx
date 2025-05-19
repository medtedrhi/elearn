import './Header.css'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../Images/logo.svg'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Logged out successfully');
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  return (
    <>
    <header className="flex items-center justify-evenly bg-[#042439] w-full fixed z-10 gap-[20rem]">
      <NavLink to='/'>
      <div className="logo">
        <img src={Logo} alt="logo" />
        <h1 className='text-2xl text-[#4E84C1] font-bold'>Eduwise</h1>
      </div>
      </NavLink>
      <div className="link-nav">
        <ul>
          <li><NavLink to='/' className={({isActive}) => isActive ? "active" : "deactive" }> Home </NavLink></li>
          {user && <li><NavLink to='/courses' className={({isActive}) => isActive ? "active" : "deactive"}> Courses </NavLink></li>}
          <li><NavLink to='/about' className={({isActive}) => isActive ? "active" : "deactive"}> About </NavLink></li>
          <li><NavLink to='/contact' className={({isActive}) => isActive ? "active" : "deactive"}> Contact us </NavLink></li>
        </ul>
      </div>
      <div className='flex gap-6'>
        {user ? (
          <div className='flex items-center gap-4'>
            <span className='text-white'>{user.username}</span>
            <button 
              onClick={handleLogout}
              className='bg-[#4E84C1] hover:bg-[#3a6da3] text-white py-2 px-4 rounded-lg transition-colors duration-200'
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <NavLink to='/login' className={({isActive}) => isActive ? "deactive" : "deactive"}><button>Login</button></NavLink>
            <NavLink to='/signup' className={({isActive}) => isActive ? "deactive" : "deactive"}><button>Signup</button></NavLink>
          </>
        )}
      </div>
    </header>
    <div className="gapError"></div>
    </>
  )
}

export default Header
