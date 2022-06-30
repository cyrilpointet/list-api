import * as express from "express";
import { auth } from "../../user/middleware/auth";
import { isTeamManager } from "../../team/middleware/isTeamManager";
import { memberController } from "../controller/memberController";

const memberRouter = express.Router();

memberRouter.post("/", auth, isTeamManager, memberController.create);

export { memberRouter };
