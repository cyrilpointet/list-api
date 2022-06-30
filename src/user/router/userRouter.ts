import * as express from "express";

import { userController } from "../controller/userController";
import {
  loginValidator,
  userUpdateValidator,
  userCreateValidator,
} from "../middleware/userValidator";
import { auth } from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/register", userCreateValidator, userController.create);
userRouter.get("/", auth, userController.getAll);
userRouter.get("/self", auth, userController.get);
userRouter.put("/", auth, userUpdateValidator, userController.update);

userRouter.post("/login", loginValidator, userController.login);

export { userRouter };
