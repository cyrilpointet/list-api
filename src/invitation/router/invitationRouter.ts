import * as express from "express";

import { auth } from "../../user/middleware/auth";
import {
  invitationCreateFromTeamValidator,
  invitationCreateFromUserValidator,
} from "../middleware/invitationValidator";
import { isTeamManager } from "../../team/middleware/isTeamManager";
import { invitationController } from "../controller/invitationController";

const invitationRouter = express.Router();

invitationRouter.post(
  "/user",
  auth,
  invitationCreateFromTeamValidator,
  isTeamManager,
  invitationController.createFromTeam
);

invitationRouter.post(
  "/team",
  auth,
  invitationCreateFromUserValidator,
  invitationController.createFromUser
);

invitationRouter.get("/", auth, invitationController.getAll);

export { invitationRouter };
