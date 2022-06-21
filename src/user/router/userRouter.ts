import * as express from "express";

import { userController } from "../controller/userController";
import { registerValidator, loginValidator } from "../validator/userValidator";
import { auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/", auth, userController.read);
userRouter.post("/login", loginValidator, userController.login);
userRouter.post("/register", registerValidator, userController.create);

export { userRouter };
