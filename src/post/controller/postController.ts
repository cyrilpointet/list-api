import { AppDataSource } from "../../data-source";
import { Post } from "../model/Post";
import { Request, Response } from "express";
import { errorMsg } from "../../constantes/errorMsg";
import { QueryHelper } from "../../utils/QueryHelper";

const postRepository = AppDataSource.getRepository(Post);

const postController = {
  async getAll(req: Request, res: Response) {
    try {
      const post = await postRepository.find(QueryHelper.getOptions(req));
      if (!post) {
        res.status(404).json(errorMsg.notFound);
      }
      res.json(post);
    } catch (e) {
      console.log(e);
      res.status(401).json(e);
    }
  },
  async get(req: Request, res: Response) {
    try {
      const post = await postRepository.findOne({
        where: {
          id: req.params.postId,
        },
        relations: ["team", "author", "team.manager"],
      });
      if (!post) {
        res.status(404).json(errorMsg.notFound);
      }
      res.json(post);
    } catch (e) {
      console.log(e);
      res.status(401).json(e);
    }
  },
  async create(req: Request, res: Response) {
    try {
      const post = await postRepository.save({
        ...req.body,
        author: req.loggedUser,
        team: req.team,
      });
      res.json({
        content: post.content,
        id: post.id,
      });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
  async delete(req: Request, res: Response) {
    try {
      await postRepository.delete(req.params.postId);
      res.json({ message: "deleted" });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
};

export { postController };
