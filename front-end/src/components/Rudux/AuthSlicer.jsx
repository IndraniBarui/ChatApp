import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    user: null,
    cartData: [],
    selectedChat: null,
    chats:[]
  },
  reducers: {
    setAuthData: (state, action) => {
     
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearAuthData: (state,action) => {
      state.token = null;
      state.user = null;
      state.user = action.payload.user;
    },
    setSelectedChat: (state,action) => {
      state.selectedChat = action.payload || null; 
    },
    setChats: (state,action) => {
      state.chats = action.payload || []; 
    },
    
   
  },
});

export const {
  setAuthData, 
  clearAuthData,
  setSelectedChat,
  setChats
  
} = authSlice.actions;
export default authSlice.reducer;
