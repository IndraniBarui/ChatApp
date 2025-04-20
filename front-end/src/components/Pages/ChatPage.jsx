import Box from '@mui/material/Box';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SideDrawer from '../mislennionc/SideDrawer';
import MyChat from '../mislennionc/MyChat';
import ChatBox from '../mislennionc/ChatBox';
// import {ChatContext} from "../context/ChatProvider"
export default function ChatPage() {
    const { user } = useSelector((state) => state.auth);
    const [fetchData, setFetchData]=useState(false)
    console.log(user,"userhn")
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box  sx={{ p: 2, border: '1px dashed grey',height:"91.5vh", display:"flex", 
justifyContent:"space-between", width:"100%"

      }}>
        {user && <MyChat fetchData={fetchData}/>}
        {user && <ChatBox  setFetchData ={setFetchData}/>}
        </Box>  
    </div>
  )
}
