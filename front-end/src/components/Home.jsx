import React from 'react'
import Header from './Header'
import Sidebar from './ChatSideBar'
import ChatWindow from './ChatWindow'
export default function Home() {
  return (
    <div>
     <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
    </div>
  )
}
