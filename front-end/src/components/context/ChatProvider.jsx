// import React, { Children } from 'react'
// import { createContext,useEffect,useState } from 'react';
// import {useHistory} from "react-router-dom"
// const ChatContext = createContext();
// export default function ChatProvider() {
//     const [user,setUser]=useState()
//     const history=useHistory()
//     useEffect(()=>{
//       const userInfo =  JSON.parse(localStorage.getItem("userinfo"))
//       setUser(userInfo)
//       if(!userInfo){
//         history.pushState('/')
//       }
//     },[history])

//   return (
//     <ChatContext.Provider value={{user, setUser}}>
//       {Children}
//     </ChatContext.Provider>
//   )
// }
