import * as express from "express";

import { auth } from "../../user/middleware/auth";
import {
  teamParamValidator,
  teamCreateValidator,
} from "../middleware/teamValidator";
import { teamController } from "../controller/teamController";
import { isTeamManager } from "../middleware/isTeamManager";

const teamRouter = express.Router();

teamRouter.post("/", auth, teamCreateValidator, teamController.create);
teamRouter.get("/", auth, teamController.getAll);
teamRouter.get(
  "/:teamId",
  auth,
  teamParamValidator,
  isTeamManager,
  teamController.read
);
teamRouter.put("/:teamId", auth, isTeamManager, teamController.update);
teamRouter.delete("/:teamId", auth, isTeamManager, teamController.delete);

export { teamRouter };
