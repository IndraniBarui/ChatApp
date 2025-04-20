import './App.css';
// import ChatContainer from './components/ChatContainer';
import Home from './components/Home';
import Login from './components/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './components/Pages/ChatPage';
import axiosInstance from './AxiosInstance';
import {useDispatch } from 'react-redux';
import { setAuthData } from './components/Rudux/AuthSlicer';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
function App() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');


  const getUser = async () => {
    try {
      const response = await axiosInstance.get(`/get-user-details/${userId}`);
      if (response.status === 200) {
        dispatch(setAuthData(response.data));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      getUser();
    }
  }, [userId]);
  setInterval(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > decodedToken.exp) {
        localStorage.removeItem("userId")
        localStorage.removeItem('authToken');
        window.location.reload()
      }
    }
  }, 10000);
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App;
