import { Box, Typography,TextField  } from "@mui/material";
import React,{useEffect, useState,useRef} from "react";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowBack } from "@mui/icons-material";
import GroupChatModel from "./GroupChatModel";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../Rudux/AuthSlicer";
import { getSender, getSenderAll } from "../config/ChatLogics";
import UserProfileModal from "./ProfileModel";
import UpdateGroupModel from "./UpdateGroupModel";
import {CircularProgress} from "@mui/material";
import axiosInstance from "../../AxiosInstance";
import ScrollableChat from "./ScrollableChat";
import {io} from "socket.io-client"
// import "../../components/style.css"
export default function ChatBox() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, selectedChat } = useSelector(
    (state) => state.auth
  );
  console.log()
  const dispatch=useDispatch()
  const [message, setMessage] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const[socketConneted, setSocketConnected]=useState(false)
// console.log(selectedChat.users
//   , "selectedChatselectedChat")
const socket = useRef(); 
const ENDPOINT = "http://localhost:5000";
var  selectedChatCompare;
const fetchMessages = async()=>{
  if(!selectedChat)
    return;

  try{
    setLoading(true)
const response = await axiosInstance.get(`/message/${selectedChat._id}`)

setMessage(response.data)
setLoading(false)

// if (socketConneted) {
  socket.current.emit('join chat', selectedChat?._id);
// }
  }catch(err){
    console.log(err)
  }
}
useEffect(() => {
  socket.current = io(ENDPOINT);
  socket.current.emit("setup", user);

  socket.current.on("connected", () => {
    setSocketConnected(true);
    console.log("✅ Socket connected");
  });

  return () => {
    socket.current.disconnect();
  };
}, [user]);
useEffect(()=>{
  fetchMessages()
  selectedChatCompare=selectedChat
},[selectedChat])



useEffect(()=>{
 socket.current.on("message recieved", (newMessageRecieved)=>{
  if(!selectedChatCompare || selectedChatCompare._id !==newMessageRecieved.chat._id)
  {

  }else{
    setMessage([...message, newMessageRecieved])
  }
 })
})

console.log(selectedChat?._id,"selectedChat")

const sendMessage = async (event) => {
  
  if (event.key === "Enter" && newMessage) {
   

    try {
      setNewMessage("");
      const response = await axiosInstance.post("/message", {
        content: newMessage,
        chatId: selectedChat._id,
      });

      console.log(response.data, "sent message response");

   socket.current.emit("new message", response.data)
      setMessage((prevMessages) => [...prevMessages, response.data]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }
};
const typingHandler = (e) => {
  setNewMessage(e.target.value);
  // Optional: set isTyping logic if needed
};


  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "flex" : "none", md: "flex" },
        alignItems: "center",
        flexDirection: "column",
        p: 6,
        bgcolor: "white",
        width: { xs: "100%", md: "68%" },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.300",
      }}
    >
      {selectedChat && selectedChat.length !== 0  ? (
        <>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "28px", md: "30px" },
              pb: 3,
              px: 2,
              width: "100%",
              fontFamily: "'Work Sans', sans-serif",
              display: "flex",
              justifyContent: { xs: "space-between" },
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
              }}
             onClick={()=> dispatch(setSelectedChat(null))}
            >
             <ArrowBack/>
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <>
              
              {getSender(user, selectedChat.users)}
              <UserProfileModal user={getSenderAll(user, selectedChat?.users)}/>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupModel
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}/>
              </>
            )}
          </Typography>
          <Box sx={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"flex-end",
            p:3,
            bgcolor:"#E8E8E8",
            width:"100%",
            height:"100%",
            borderRadius:"lg",
            overflowY:"hidden"
          }}>
             {loading ? (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100%"
  >
    <CircularProgress size={80} />
  </Box>
) : (
  <div className="messages">
    <ScrollableChat messages={message} />
  </div>
)}
<Box
  component="form"
  onKeyDown={sendMessage}
  mt={3}
  sx={{ width: '100%' }}
>
  {istyping && (
    <div>
      <Lottie
        options={defaultOptions}
        width={70}
        style={{ marginBottom: 15, marginLeft: 0 }}
      />
    </div>
  )}

  <TextField
    fullWidth
    variant="filled"
    placeholder="Enter a message.."
    value={newMessage}
    onChange={typingHandler}
    required
   
  />
</Box>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              pb: 3,
              fontFamily: "'Work Sans', sans-serif",
            }}
          >
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </Box>
  );
}
