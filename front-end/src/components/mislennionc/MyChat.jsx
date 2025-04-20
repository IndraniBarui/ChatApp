import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../AxiosInstance";
import { useDispatch } from "react-redux";
import { setChats, setSelectedChat } from "../Rudux/AuthSlicer";
import AddIcon from "@mui/icons-material/Add";
import ChatLoading from "./ChatLoading";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  Modal,
  TextField,
  Badge,
  IconButton
} from "@mui/material";
import { getSender } from "../config/ChatLogics";
import { toast } from "react-toastify";
import UserListItem from "../ChatList/UserListItem";
export default function MyChat() {
  const [users, setUsers] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { user, selectedChat, chats } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem("authToken");
  const getAllUsers = async () => {
    if (!user || !token) {
      console.error("User or token is missing");
      return;
    }
    try {
      const response = await axiosInstance.get(`/chat`);

      const data = response.data;
      console.log(response.data, "bbbbbbbbbb");
      dispatch(setChats(data));
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  console.log(chats, selectedChat, "chats");

  useEffect(() => {
    setUsers(localStorage.getItem("userInfo"));
    getAllUsers();
  }, []);

  const handleOpen = () => {
    setShow(true);
  };

  const handleGroup = (userAdd) => {
  
    if (selectedUsers.includes(userAdd)) {
      toast.warning("User already added", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/allUser?search=${search}`);
      setLoading(false);
      setSearchResult(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.warning("Please Enter something in search", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      alert(8);
      toast.warning("Please fill all the feilds", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    try {
      const response = await axiosInstance.post(`/chat/group`, {
        name: groupChatName,
        users: selectedUsers.map((u) => u),
      });
      dispatch(setChats([response.data, ...chats]));

      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setShow(false);
      setGroupChatName("");
      setSelectedUsers([]);
      setSearchResult([]);
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleClose = () => {
    setShow(false);
    setSearchResult([]);
    setSelectedUsers([]);
  };

  const handleRemoveUser =(userId)=>{
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  }

  console.log(chats,"selectedUsersselectedUsers")
  return (
    <Box
      sx={{
        display: { xs: selectedChat ? "none" : "flex", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        bgcolor: "white",
        width: { xs: "100%", md: "31%" },
        borderRadius: 2,
        border: 2,
        borderColor: "grey.300",
      }}
    >
      <Box
        sx={{
          pb: 3,
          px: 3,
          fontSize: { xs: "28px", md: "30px" },
          fontFamily: "'Work Sans', sans-serif",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <Button
          d="flex"
          fontSize={{ xs: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
          onClick={handleOpen}
        >
          New Group Chat
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          bgcolor: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: 2,
          overflowY: "hidden",
        }}
      >
        {Array.isArray(chats) && chats.length > 0 ? (
          <Stack sx={{  maxHeight: "400px", gap: 2 ,}}>
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => dispatch(setSelectedChat(chat))}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    selectedChat?._id === chat._id ? "#59f048" : "#d0e0ce",
                  color: selectedChat?._id === chat._id ? "white" : "black",
                  px: 3,
                  py: 2,
                  borderRadius: 2,
                  transition: "background 0.3s",
                  
                }}
              >
                <p>
                  {!chat.isGroupChat
                    ? getSender(users, chat.users)
                    : chat.chatName}
                </p>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <Modal open={show} onClose={() => setShow(false)}>
        <Box
          className="bg-white p-6 rounded-lg shadow-lg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" id="modal-title">
            Create Group Chat
          </Typography>

          <TextField
            label="Group Name"
            variant="outlined"
            fullWidth
            // value={groupName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <TextField
            label="Group Description"
            variant="outlined"
            fullWidth
            // value={groupDescription}
            onChange={handleSearch}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {selectedUsers.map((user) => (
              <Badge
                key={user._id}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 10,
                  m: 1,
                  mb: 2,
                  fontSize: 12,
                  color: "white",
                  bgcolor: "purple",
                  cursor: "pointer",
                }}
              >
                {user.firstName}
                <IconButton
        size="small"
        onClick={() => handleRemoveUser(user._id)}
        sx={{
          color: "white",
          ml: 1,
          p: 0,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
              </Badge>
            ))}
          </Box>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
          <Button onClick={handleSubmit} color="secondary">
            Create chat
          </Button>
          {/* Modal Footer */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              // borderTop: "1px solid #ccc",
              paddingTop: 2,
              marginTop: 3,
            }}
          >
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
            <Button onClick={() => setShow(false)} color="secondary">
              Leave Group
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
