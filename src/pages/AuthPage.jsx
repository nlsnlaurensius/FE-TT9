import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TickItLogo from '../assets/TickItLogo.svg';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useApiClient } from '../api/api';
import Quote from '../assets/Quote.svg'

function AuthPage({ type }) {
  const isLogin = type === 'login';
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { post } = useApiClient();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      if (isAuthenticated) {
          navigate('/app', { replace: true });
      }
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthenticated) {
         navigate('/app');
         return;
    }

    setLoading(true);
    setError(null);

    const endpoint = `/users/${isLogin ? 'login' : 'register'}`;

    let requestBody = { email, password };
    if (!isLogin) {
      requestBody = { username, ...requestBody };
    }

    try {
      const data = await post(endpoint, requestBody);

      console.log(isLogin ? 'Login successful:' : 'Registration successful:', data);

      if (isLogin) {
        if (data && data.token) {
           login(data.token);
        }
      } else {
        alert('Registration successful! Please log in.');
        navigate('/login');
      }

    } catch (err) {
      console.error('API Call Error:', err);
      setError(err.details || err.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

   if (isAuthenticated) {
       return null;
   }

  return (
     <div className="min-h-screen md:flex-row items-center bg-gray-50">
       <Navbar />
       <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center md:items-start justify-center md:-space-x-64 flex-grow">
         <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
           <img src={TickItLogo} alt="TickIt Logo" className="h-10 mb-6 md:mb-8" />
           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
             {isLogin ? 'Log in' : 'Sign up'}
           </h1>

           <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto md:mx-0">
             {!isLogin && (
               <div className="mb-4">
                 <label htmlFor="username" className="block text-gray-700 text-sm font-semibold mb-2 text-left">
                   Username
                 </label>
                 <input
                   type="text"
                   id="username"
                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                   placeholder="Enter your username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   required
                   disabled={loading}
                 />
               </div>
             )}

             <div className="mb-4">
               <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2 text-left">
                 Email
               </label>
               <input
                 type="email"
                 id="email"
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                 placeholder="Enter your personal or work email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 disabled={loading}
               />
             </div>

             <div className="mb-6">
               <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2 text-left">
                 Password
               </label>
               <input
                 type="password"
                 id="password"
                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-tickitGreen-500"
                 placeholder="Enter your password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 disabled={loading}
               />
             </div>

             {error && (
               <p className="text-red-500 text-xs italic mb-4 text-left w-full max-w-sm mx-auto md:mx-0">{error}</p>
             )}

             <div className="flex items-center justify-between">
               <button
                 type="submit"
                 className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300
                   ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tickitGreen-500 hover:bg-tickitGreen-600'}`}
                 disabled={loading}
               >
                 {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log in' : 'Sign up with Email')}
               </button>
             </div>
           </form>

           <div className="w-full max-w-sm mx-auto md:mx-0 mt-6 text-sm text-gray-600">

             <p className="mb-4 text-center md:text-left">
               By continuing with Email, you agree to TickIt’s&nbsp;
               <a href="#" className="text-tickitGreen-600 hover:underline">Terms of Service</a>
               &nbsp;and&nbsp;
               <a href="#" className="text-tickitGreen-600 hover:underline">Privacy Policy</a>.
             </p>

             <p className="text-center md:text-left">
               {isLogin ? "Don't have an account?" : "Already signed up?"}&nbsp;
               <Link to={isLogin ? "/register" : "/login"} className="text-tickitGreen-600 hover:underline font-semibold">
                 {isLogin ? "Sign up" : "Go to login"}
               </Link>
             </p>
           </div>
         </div>

         <div className="hidden md:flex md:w-1/2 p-8 md:p-12 flex-col items-center justify-center">
           <div className="w-full max-w-xs h-64rounded-lg flex items-center justify-center">
           <img src={Quote} alt="Quote" className="h-full" />
           </div>

           <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md text-gray-700 text-center italic">
             ""Whatever you want to do, do it now. There are only so many tomorrows.""
             <br /><span className="not-italic font-semibold">- Michael Landon</span>
           </div>
         </div>
       </div>
     </div>
  );
}

export default AuthPage;