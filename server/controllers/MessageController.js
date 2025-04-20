import Message from "../modals/MesageModel.js";
import chat from "../modals/Chat.js"
import UserModel from "../modals/User.js";
const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: req.user.id,
      content: content,
      chat: chatId,
    };
  console.log("User:", req.user.id)
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      message = await UserModel.populate(message, {
        path: "chat.users",
        select: "name pic email",
      });
  
      await chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  const getAllMessage= async(req,res)=>{
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }

  export {sendMessage,getAllMessage}