import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TickItLogo from '../assets/TickItLogo.svg';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
       <div className="flex items-center">
         <Link to="/" className="flex items-center">
           <img src={TickItLogo} alt="TickIt Logo" className="h-8 mr-2" />
           <span className="text-2xl font-bold text-gray-800">TickIt</span>
         </Link>
       </div>


       <div className="flex items-center space-x-4">
         {isAuthenticated ? (
           <>
             <button
               onClick={handleLogout}
               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
             >
               Logout
             </button>
           </>
         ) : (
           <>
             <Link to="/login" className="text-gray-600 hover:text-gray-900 transition duration-300">
                Log in
             </Link>
             <Link to="/register" className="bg-tickitGreen-500 hover:bg-tickitGreen-600 text-white px-4 py-2 rounded-md transition duration-300">
                Sign Up
             </Link>
           </>
         )}
       </div>
    </nav>
  );
}

export default Navbar;