import * as express from "express";

import { userController } from "../controller/userController";
import { registerValidator, loginValidator } from "../middleware/userValidator";
import { auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/self", auth, userController.read);
userRouter.get("/", auth, userController.getAll);
userRouter.post("/login", loginValidator, userController.login);
userRouter.post("/register", registerValidator, userController.create);

export { userRouter };
