import { Router } from "express";
import { authenticate } from "../middleware/VerifyToken.js";
import { getAllMessage, sendMessage } from "../controllers/MessageController.js";
const messageRouter = Router();

messageRouter.post('/', authenticate, sendMessage)
messageRouter.get('/:chatId', authenticate, getAllMessage)

export default messageRouter;