import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { registerUserSchema } from "../validation/registerUserSchema.js";
import { logInUserController, logOutUserController, refreshSessionController, registerNewUserController } from "../controllers/auth.js";
import { logInUserSchema } from "../validation/logInUserSchema.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerNewUserController));
authRouter.post('/login', validateBody(logInUserSchema), ctrlWrapper(logInUserController));
authRouter.post('/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logOutUserController));

export default authRouter;
