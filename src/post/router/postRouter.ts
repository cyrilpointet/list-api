import * as express from "express";
import { auth } from "../../user/middleware/auth";

import { isTeamManager } from "../../team/middleware/isTeamManager";
import {
  postCreateValidator,
  postParamValidator,
} from "../validator/postValidator";
import { postController } from "../controller/postController";
import { teamParamValidator } from "../../team/validator/teamValidator";

const postRouter = express.Router();

postRouter.post(
  "/:teamId",
  auth,
  teamParamValidator,
  isTeamManager,
  postCreateValidator,
  postController.create
);

postRouter.get("/:postId", auth, postParamValidator, postController.get);

postRouter.delete("/:postId", auth, postParamValidator, postController.delete);

export { postRouter };
