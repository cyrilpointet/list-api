import * as express from "express";

import { auth } from "../../user/middleware/auth";
import { invitationCreateValidator } from "../middleware/invitationValidator";
import { isTeamManager } from "../../team/middleware/isTeamManager";
import { invitationController } from "../controller/invitationController";

const invitationRouter = express.Router();

invitationRouter.post(
  "/",
  auth,
  invitationCreateValidator,
  isTeamManager,
  invitationController.create
);

export { invitationRouter };
