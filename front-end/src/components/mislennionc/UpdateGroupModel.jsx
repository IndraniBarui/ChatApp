import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Badge,
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../AxiosInstance";
import { setSelectedChat } from "../Rudux/AuthSlicer";
import UserListItem from "../ChatList/UserListItem";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
const UpdateGroupModel = ({ fetchAgain, setFetchAgain ,fetchMessages}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setgroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const dispatch = useDispatch();
  const { user, selectedChat } = useSelector((state) => state.auth);
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    setSearchResult([]);
  };
  

  const handleNameUpdate = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const reponse = await axiosInstance.put("/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      console.log(reponse.data.updatechat, "iiiiiii");
      dispatch(setSelectedChat(reponse.data.updatechat));
      setgroupChatName(reponse.data.chatName);
      // setFetchAgain(!fetchAgain)
      setRenameLoading(false);
    } catch (err) {
      console.log(err);
      setRenameLoading(false);
    }
    setgroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.get(`/allUser?search=${search}`);
      console.log(response);
      setLoading(false);
      setSearchResult(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1)) {
      toast.success("User Already in group!", {
        position: "top-right",
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

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.success("Only admins can add someone!", {
        position: "bottom",
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
      alert(8);
      const response = await axiosInstance.put(`/chat/groupAdd`, {
        chatId: selectedChat._id,
        userId: user1._id,
      });

      setSelectedChat(response.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setgroupChatName("");
  };

const handleRemove =async(user1)=>{
  alert(user1._id)
  if(selectedChat.groupAdmin._id !==user._id && user1._id !==user._id){
    toast.success("Only admins can add someone!", {
      position: "bottom",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
try{
  setLoading(true);
const response = await axiosInstance.put("/chat/groupRemove",{
chatId:selectedChat._id,
userId:user1._id
})
console.log(response,"iudrt_id")
if (user1._id === user._id) {
  dispatch(setSelectedChat(null));
} else {
  dispatch(setSelectedChat(response.data.removed)); 
}
setFetchAgain(!fetchAgain);
fetchMessages()
setLoading(false);
}catch(err){
   console.log(err)
   setLoading(false); 
}
}
console.log(user._id,"vvvvvvvvvvvv")

  return (
    <>
      <IconButton className="flex" onClick={handleOpen}>
        <ViewIcon />
      </IconButton>

      <Modal
        open={isOpen}
        onClose={handleClose}
        className="flex justify-center items-center"
      >
        <Box className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
          <IconButton className="absolute top-2 right-2" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" className="font-sans text-center mb-4">
            {selectedChat.chatName}
          </Typography>
          <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", pb: 3 }}>
            {selectedChat.users.map((data) => (
              <Badge
                key={data._id}
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
                {data.firstName}
                <IconButton
                  size="small"
                  onClick={() => handleRemove(data)}
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
          <Box display="flex" alignItems="center" gap={2}>
            {/* Button on the left side */}

            {/* TextField on the right side */}
            <TextField
              label="Chat Name"
              variant="outlined"
              fullWidth
              value={groupChatName}
              onChange={(e) => setgroupChatName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              // isLoading={renameloading}
              onClick={handleNameUpdate}
            >
              update
            </Button>
          </Box>
          <Box>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <TextField
                label="Add a user to a group"
                variant="outlined"
                fullWidth
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button variant="contained" color="primary">
                Add
              </Button>
            </Box>

            <Box mt={2}>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress size={30} />
                </Box>
              ) : (
                searchResult?.map((user) => (
                  <Box mb={1}>
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user._id)}
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
          <div className="flex justify-center mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRemove(user)}
            >
              Leave group
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupModel;
