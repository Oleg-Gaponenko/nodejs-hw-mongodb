import { Router } from "express";
import validateBody from "../middlewares/validateBody.js";
import { registerUserSchema } from "../validation/registerUserSchema.js";
import { logInUserController, logOutUserController, refreshSessionController, registerNewUserController, resetEmailController, resetPasswordController } from "../controllers/auth.js";
import { logInUserSchema } from "../validation/logInUserSchema.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { resetEmailSchema } from "../validation/resetEmailSchema.js";
import { resetPasswordSchema } from "../validation/resetPasswordSchema.js";

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerNewUserController));
authRouter.post('/login', validateBody(logInUserSchema), ctrlWrapper(logInUserController));
authRouter.post('/refresh', ctrlWrapper(refreshSessionController));
authRouter.post('/logout', ctrlWrapper(logOutUserController));
authRouter.post('/send-reset-email', validateBody(resetEmailSchema), ctrlWrapper(resetEmailController));
authRouter.post('reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRouter;
