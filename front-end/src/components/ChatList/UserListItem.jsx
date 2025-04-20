import React from 'react'
// import { useSelector } from 'react-redux'
import { Box, Avatar, Typography } from "@mui/material";
export default function UserListItem({handleFunction,user}) {
  // const{user}=useSelector((state) => state.auth);
  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: "pointer",
        backgroundColor: "#E8E8E8",
        "&:hover": {
          backgroundColor: "#38B2AC",
          color: "white",
        },
        width: "100%",
        display: "flex",
        alignItems: "center",
        color: "black",
        px: 3,
        py: 2,
        mb: 2,
        borderRadius: "12px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Avatar
        sx={{ mr: 2, width: 32, height: 32, cursor: "pointer" }}
        alt={user?.firstName}
        // src={user?.pic || "/default-avatar.png"} // Fallback avatar
      />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {user?.firstName}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "12px", color: "gray" }}>
          <b>Email: </b> {user?.email}
        </Typography>
      </Box>
    </Box>
  )
}
