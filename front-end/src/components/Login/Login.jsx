import React, { useState } from 'react';
import { UserPlus, LogIn, Mail, Lock, User } from 'lucide-react';
import axiosInstance from "../../AxiosInstance";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../Rudux/AuthSlicer';
import { toast } from "react-toastify";
function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const json = { firstName, email, password };

    try {
      const response = await axiosInstance.post('/signUp', json);
      if (response.status === 200) {
        alert('Account created successfully! Redirecting to login...');
        toggleForm(); // Switch to login form after signup
      } else {
        alert('Sign-up failed. Please try again.');
      }
    } catch (error) {
      console.error('Sign-up Error:', error);
      alert('An error occurred while signing up. Please try again later.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const json = { email, password };

    try {
      const response = await axiosInstance.post('/signIn', json);
      if (response.status === 200) {
       
        const { token, user } = response.data;
        dispatch(setAuthData({ user, token }));
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userInfo', user);
          toast.success('Successfully logged in!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
               
                });
        navigate('/chat');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred while logging in. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        <div className="text-center mb-8">
          {isLogin ? <LogIn className="w-12 h-12 text-green-600 mx-auto mb-2" /> : <UserPlus className="w-12 h-12 text-green-600 mx-auto mb-2" />}
          <h2 className="text-3xl font-bold text-gray-800">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500 mt-2">{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</p>
        </div>

        <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>
          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">Forgot Password?</a>
            </div>
          )}
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm} className="ml-2 text-green-600 hover:text-green-700 font-medium">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
