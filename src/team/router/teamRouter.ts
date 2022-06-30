import * as express from "express";

import { auth } from "../../user/middleware/auth";
import {
  teamCreateValidator,
  teamUpdateValidator,
} from "../middleware/teamValidator";
import { teamController } from "../controller/teamController";
import { isTeamManager } from "../middleware/isTeamManager";
import { isTeamMember } from "../middleware/isTeamMember";

const teamRouter = express.Router();

teamRouter.post("/", auth, teamCreateValidator, teamController.create);
teamRouter.get("/", auth, teamController.getAll);
teamRouter.get("/:teamId", auth, isTeamMember, teamController.get);
teamRouter.put(
  "/:teamId",
  auth,
  teamUpdateValidator,
  isTeamManager,
  teamController.update
);
teamRouter.delete("/:teamId", auth, isTeamManager, teamController.delete);

export { teamRouter };
