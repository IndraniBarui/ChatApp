import Chat from "../modals/Chat.js";
import UserModel from "../modals/User.js";

const accessChat = async(req,res)=>{
const {userId} = req.body;
if (!userId) {
    return res.status(404).json({
      error: "User not found",
    });
  }
  var isChat = await Chat.find({
isGroupChat:false,
$and:[
   {users:{
    $elemMatch:{$eq:req.user.id}
   }} ,
   {users:{
    $elemMatch:{$eq:userId}
   }} 
]
  }).populate('users', '-password').populate('latestMessage')
  isChat = await UserModel.populate(isChat, {
    path:"latestMessage.sender",
    select:"name pic email"
  })
  if(isChat.length>0){
    res.send(isChat[0]);
  }else{
    var chatData = {
        Chatname :'sender',
        isGroupChat:false,
        users:[req.user.id, userId]
    }
    try{
const createdChat= await Chat.create(chatData);
const fullChat = await Chat.findOne({_id:createdChat._id}).populate('users', '-password')
   res.status(200).send(fullChat);

}catch(err){
res.status(400).json({
    error: "Internal server error",
    details: err.message,
})
    }
  }
}

const fetchChats = async (req, res) => {
  try {
  
   console.log( req.user._id,"yyyyyyyyyyyyy")
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
      res.status(400).json({
          error: "Internal server error",
          details: err.message,
      })
  }
};

  const createGroup = async (req, res) => {
    try {
      if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" });
      }
  
      let users;
      try {
        users = typeof req.body.users === "string" ? JSON.parse(req.body.users) : req.body.users;
      } catch (err) {
        return res.status(400).send({ message: "Invalid users format" });
      }
  
      if (!Array.isArray(users) || users.length < 2) {
        return res.status(400).send({ message: "At least 2 users are required to form a group chat" });
      }
  
      users.push(req.user.id);
  
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user.id,
      });
 
      const fullGroupChat = await Chat.findOne({ _id: groupChat.id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: error.messageii7uh
      });
    }
  };
  const renameGroup = async(req,res)=>{
  const {chatId , chatName}=req.body;
  const updatechat = await Chat.findByIdAndUpdate(chatId,
    {
        chatName
    },
    {
        new:true,
    }
  ) 
  .populate("users", "-password") 
  .populate("groupAdmin", "-password");
  if(!updatechat){
    res.status(404).json({
        error: "Chat not found",
    });

  }else{
    res.status(200).json({ updatechat});
  }
  }


  const addToGroup = async(req,res)=>{
    const {chatId, userId}=req.body
    
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{
                users:userId
            },
        },{new:true}
    ).populate("users", "-password") 
    .populate("groupAdmin", "-password");
    if(!added){
        res.status(404).json({
            error:"Chat not found"
        })
    }else{
        res.status(200).json({ added});
    }
  }
  const removeGroup = async(req,res)=>{
    const {chatId, userId}=req.body
    
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{
                users:userId
            },
        },{new:true}
    ).populate("users", "-password") 
    .populate("groupAdmin", "-password");
    if(!removed){
        res.status(404).json({
            error:"Chat not found"
        })
    }else{
        res.status(200).json({ removed});
    }
  }

export {accessChat,fetchChats,createGroup,renameGroup,addToGroup,removeGroup}