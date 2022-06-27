import * as express from "express";
import { auth } from "../../user/middleware/auth";

import { isTeamManager } from "../../team/middleware/isTeamManager";
import {
  postCreateValidator,
  postParamValidator,
} from "../middleware/postValidator";
import { postController } from "../controller/postController";
import { hasPostRights } from "../middleware/hasPostRights";

const postRouter = express.Router();

postRouter.post(
  "/",
  auth,
  isTeamManager,
  postCreateValidator,
  postController.create
);

postRouter.get("/:postId", auth, postParamValidator, postController.get);

postRouter.get("/", auth, postController.getAll);

postRouter.delete(
  "/:postId",
  auth,
  postParamValidator,
  hasPostRights,
  postController.delete
);

export { postRouter };
