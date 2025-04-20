import React from "react";
import { Skeleton } from "@mui/material";
export default function ChatLoading() {
  return (
    <>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
    </>
  );
}
