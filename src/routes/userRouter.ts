import * as express from "express";

import { userController } from "../controller/UserController";
import { registerValidator, loginValidator } from "../middleware/userValidator";

const userRouter = express.Router();

userRouter.get("/", userController.read);
userRouter.post("/login", loginValidator, userController.login);
userRouter.post("/register", registerValidator, userController.create);

export { userRouter };
