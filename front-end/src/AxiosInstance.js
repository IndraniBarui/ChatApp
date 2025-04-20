
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/auth",

  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await localStorage.getItem("authToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
     
      console.error("Failed to retrieve token from localStorage", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
