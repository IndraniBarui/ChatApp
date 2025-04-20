import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  InputBase,
  Button,
  Badge,
  Modal,
  Box,
  Slide,
} from "@mui/material";
import { Search, Notifications, ExpandMore } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";
import ChatLoading from "./ChatLoading";
import UserListItem from "../ChatList/UserListItem";
import { useDispatch } from "react-redux";
import { setSelectedChat } from "../Rudux/AuthSlicer";
const ChatHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const { user, chats, setChats } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    toast.error("Successfully logged out!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleSearch = async () => {
    if (!search) {
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
      return;
    }
    try {
      setLoading(true);

      const { data } = await axiosInstance.get(`/allUser?search=${search}`);
      setTimeout(() => {
        setLoading(false);
      }, 2000);

      setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleAllChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await axiosInstance.post("/chat", { userId });
      // if (response.status === 200) {
        if (!chats.find((c) => c._id === response.data._id))
          setChats([response.data, ...chats]);
        // const chatData  = response.data;
        console.log(response.data,"response.data")
        dispatch(setSelectedChat(response.data));
      // }

      setLoadingChat(false);
      setDrawerOpen(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  console.log(searchResult,chats,"tttttttttttt")

  return (
    <>
      <AppBar position="static" className="bg-white shadow-md">
        <Toolbar className="flex justify-between items-center px-4 py-2">
          <Tooltip title="Search Users to chat">
            <IconButton onClick={toggleDrawer(true)}>
              <Search className="text-gray-600" />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className="font-sans text-gray-800">
            Talk-A-Tive
          </Typography>
          <div className="flex items-center space-x-4">
            <IconButton>
              <Badge color="error">
                <Notifications className="text-gray-600" />
              </Badge>
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <Avatar />
              <ExpandMore className="text-gray-600" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => setShowModel(true)}>My Profile</MenuItem>
              <Divider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer for Searching Users */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="w-72 p-4">
          <Typography variant="h6" className="border-b pb-2">
            Search Users
          </Typography>
          <div className="flex items-center space-x-2 my-2">
            <InputBase
              placeholder="Search by name or email"
              className="border p-2 rounded w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Go
            </Button>
          </div>
        </div>
        {loading ? (
          <ChatLoading />
        ) : (
          searchResult?.map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={() => handleAllChat(user._id)}
            />
          ))
        )}
        {
          loadingChat && <></>
          //  <Spinner ml="auto" d="flex" />
        }
      </Drawer>

      {/* Profile Modal */}
      <Modal open={showModel} onClose={() => setShowModel(false)}>
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
          }}
        >
          <Typography variant="h6" id="modal-title">
            User Profile
          </Typography>

          <Typography variant="h4" className="font-sans text-center mb-4">
            {user.firstName}
          </Typography>
          <div className="flex flex-col items-center space-y-4">
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              className="w-36 h-36"
            />
            <Typography variant="h6" className="font-sans">
              Email: {user.email}
            </Typography>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="contained" color="primary">
              Close
            </Button>
          </div>
        </Box>
        {/* <UserProfileModal onClose={() => setShowModel(false)} /> */}
      </Modal>
    </>
  );
};

export default ChatHeader;
