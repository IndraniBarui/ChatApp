import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Rudux/AuthSlicer"
const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default Store;
