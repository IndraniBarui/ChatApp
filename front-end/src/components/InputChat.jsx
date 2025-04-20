import React, { useState } from 'react'

export default function InputChat({addMessage}) {
const [message,setMessage]=useState()
const sendMessage =()=>{
  addMessage(message)
  setMessage("")
}
console.log(message,"bbbbbb")
  return (
    <div className="inputtext_container">
    <textarea
      name="message"
      id="message"
      rows="6"
      placeholder="Input Message ..."
      onChange={(e) => setMessage(e.target.value)}
        value={message}
     
    ></textarea>
    <button onClick={sendMessage}>Send</button>
  </div>
  )
}
