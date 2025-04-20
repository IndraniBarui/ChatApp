import { Router } from "express";
import { newUserValidator } from "../middleware/newUserValidator.js";
import { create_user,getUserData,signIn } from "../controllers/Login.js";
import { allUsers } from "../controllers/userController.js";
import { authenticate } from "../middleware/VerifyToken.js";
const authRouter = Router();


authRouter.post("/signUp",newUserValidator , create_user);
authRouter.post("/signIn", newUserValidator, signIn)
authRouter.get("/allUser", authenticate,allUsers)
authRouter.get("/get-user-details/:userId", authenticate,getUserData)

 export default authRouter
