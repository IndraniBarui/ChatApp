import React, { useState } from "react";
import { Modal, Box, Typography, IconButton, Button, Avatar } from "@mui/material";
import { Close as CloseIcon, Visibility as ViewIcon } from "@mui/icons-material";

const UserProfileModal = ({ user, children }) => {
  const[isOpen,setIsOpen]=useState(false)
  const handleOpen=()=>{
    setIsOpen(true)
  }
  const handleClose=()=>{
    setIsOpen(false)
  }
  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton className="flex" onClick={handleOpen}>
          <ViewIcon />
        </IconButton>
      )}
      <Modal open={isOpen} onClose={handleClose} className="flex justify-center items-center">
        <Box className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
          <IconButton className="absolute top-2 right-2" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h4" className="font-sans text-center mb-4">
            {user?.firstName}
          
          </Typography>
          <div className="flex flex-col items-center space-y-4">
            <Avatar   className="w-36 h-36" />
            <Typography variant="h6" className="font-sans">
              Email: {user?.email}
             
            </Typography>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="contained" color="primary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default UserProfileModal;
