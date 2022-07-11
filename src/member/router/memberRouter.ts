import * as express from "express";
import { auth } from "../../user/middleware/auth";
import { isTeamManager } from "../../team/middleware/isTeamManager";
import { memberController } from "../controller/memberController";
import {
  memberCreateValidator,
  memberUpdateValidator,
} from "../middleware/memberValidator";
import { hasMemberRights } from "../middleware/hasMemberRights";

const memberRouter = express.Router();

memberRouter.post(
  "/",
  auth,
  isTeamManager,
  memberCreateValidator,
  memberController.create
);
memberRouter.get("/", auth, memberController.getAll);
memberRouter.get("/:memberId", auth, hasMemberRights, memberController.get);
memberRouter.put(
  "/:memberId",
  memberUpdateValidator,
  auth,
  hasMemberRights,
  memberController.update
);
memberRouter.delete(
  "/:memberId",
  auth,
  hasMemberRights,
  memberController.delete
);

export { memberRouter };
