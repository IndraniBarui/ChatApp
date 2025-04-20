import { Router } from "express";
import { authenticate } from "../middleware/VerifyToken.js";
import {accessChat, fetchChats,createGroup, renameGroup, addToGroup, removeGroup} from "../controllers/ChatController.js"
const chatRouter = Router();

chatRouter.post('/', authenticate, accessChat)
chatRouter.get('/', authenticate, fetchChats)
chatRouter.post('/group', authenticate, createGroup)
chatRouter.put('/rename', authenticate, renameGroup)
chatRouter.put('/groupRemove', authenticate, removeGroup)
chatRouter.put('/groupAdd', authenticate, addToGroup)

export default chatRouter;
