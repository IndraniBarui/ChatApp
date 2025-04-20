import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./route/auth.js";
import chatRouter from "./route/chatRoute.js";
import messageRouter from "./route/messageRoutes.js";
import Chat from "./modals/Chat.js";
import { timeStamp } from "console";
import cors from "cors";
import './db.js'

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/auth/chat", chatRouter);
app.use("/auth/message", messageRouter);
app.get("/",(req,res)=>{
    res.json({ok:true});
})
const server = createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:5173", // ← match your frontend port
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

io.on("connection", (socket)=>{
console.log("connection to socket.io");

socket.on("setup", (userData)=>{
    socket.join(userData._id);
    socket.emit("connected")
})
socket.on("join chat", (room)=>{
    socket.join(room);
   console.log("user joined room:" + room)
})
socket.on('new message', (newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;
    if(!chat.users)
        return console.log("chat.users not defined")

    chat.users.forEach(user=>{
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
    })

})
// socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(userData._id);
//   });
})

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
