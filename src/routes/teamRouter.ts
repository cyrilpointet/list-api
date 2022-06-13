import * as express from "express";

import { auth } from "../middleware/auth";
import { teamParamValidator, teamValidator } from "../middleware/teamValidator";
import { teamController } from "../controller/teamController";
import { isTeamManager } from "../middleware/isTeamManager";

const teamRouter = express.Router();

teamRouter.post("/", auth, teamValidator, teamController.create);
teamRouter.get(
  "/:id",
  auth,
  teamParamValidator,
  isTeamManager,
  teamController.read
);
teamRouter.put("/:id", auth, isTeamManager, teamController.update);
teamRouter.delete("/:id", auth, isTeamManager, teamController.delete);

export { teamRouter };
