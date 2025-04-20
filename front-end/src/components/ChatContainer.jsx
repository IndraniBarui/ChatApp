import React, { useEffect, useState } from 'react'
import { FaYoutube } from 'react-icons/fa6'
import ChatLists from './ChatLists'
import InputChat from './InputChat'
import Login from "./Login"
import socketIoClient from "socket.io-client"
export default function ChatContainer() {
  const[user,setUser]=useState(localStorage.getItem('user'))
const [chats,setChats]=useState([])
const socketio= socketIoClient('http://localhost:8001')
useEffect(()=>{
  socketio.on('chat',(chats)=>{
    setChats(chats)
  })
  socketio.on('message', (msg)=>{
    setChats((prevChats)=>[...prevChats,msg])
  })
  return()=>{
    socketio.off('chat')
    socketio.off('message')
  }
},[]);


console.log(chats,"chatschats")
const addMessage=(chat)=>{
 const newChat= {
  user:localStorage.getItem('user'),
  message:chat,
   avatar:localStorage.getItem('avatar')
  }
socketio.emit('newMessage', newChat)
}

const Logout =()=>{
  localStorage.removeItem('user')
  localStorage.removeItem('avatar')
  setUser('')
}
  return (
    <div>
    {user ? (
      <div className="home">
        <div className="chats_header">
          <h4>Username:{user}</h4>
          <p>
            <FaYoutube className="chats_icon" /> Code With Indrani
          </p>
          <p className="chats_logout" onClick={Logout}>
            <strong>Logout</strong>
          </p>
        </div>
        <ChatLists chats={chats}/>
       <InputChat addMessage={addMessage}/>
      </div>
     ) : (
      // <Login setUser={setUser} />
      <Login setUser={setUser}/>
    )} 
  </div>
  )
}
