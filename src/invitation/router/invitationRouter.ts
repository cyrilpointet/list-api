import * as express from "express";

import { auth } from "../../user/middleware/auth";
import {
  invitationCreateFromTeamValidator,
  invitationCreateFromUserValidator,
} from "../middleware/invitationValidator";
import { isTeamManager } from "../../team/middleware/isTeamManager";
import { invitationController } from "../controller/invitationController";
import { hasInvitationRights } from "../middleware/hasInvitationRights";

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

invitationRouter.put(
  "/:invitationId",
  auth,
  hasInvitationRights,
  invitationController.accept
);

invitationRouter.delete(
  "/:invitationId",
  auth,
  hasInvitationRights,
  invitationController.delete
);

export { invitationRouter };
