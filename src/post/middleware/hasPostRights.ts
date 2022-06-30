import { NextFunction, Request, Response } from "express";
import { errorMsg } from "../../constantes/errorMsg";
import { AppDataSource } from "../../data-source";
import { Post } from "../model/Post";

const postRepository = AppDataSource.getRepository(Post);

export const hasPostRights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.postId && !req.body.postId) {
    res.status(403).json(errorMsg.validation.missingParam);
    return;
  }
  const postId = req.params.postId || req.body.postId;
  try {
    const post = await postRepository.findOne({
      where: {
        id: postId,
      },
      relations: ["author", "team", "team.manager"],
    });
    if (
      post.team.members.find(
        (elem) => elem.id === req.loggedUser.id && elem.manager
      ) ||
      post.author.id === req.loggedUser.id
    ) {
      req.post = post;
      next();
    } else {
      res.status(401).json(errorMsg.auth.insufficientRights);
    }
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
