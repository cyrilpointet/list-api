import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { User } from "../model/User";
import { QueryHelper } from "../../utils/QueryHelper";

const userRepository = AppDataSource.getRepository(User);

const userController = {
  async getAll(req: Request, res: Response) {
    try {
      const users = await userRepository.find(QueryHelper.getOptions(req));
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(401).json(e);
    }
  },

  async read(req: Request, res: Response) {
    res.json(req.loggedUser);
  },

  async create(req: Request, res: Response) {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = await userRepository.save({
        ...req.body,
        password: hash,
      });
      delete newUser.password;
      res.json({
        user: newUser,
        token: jsonwebtoken.sign(
          { userId: newUser.id },
          process.env.token || "RANDOM_TOKEN_SECRET",
          {
            expiresIn: "72h",
          }
        ),
      });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const user = await userRepository
        .createQueryBuilder()
        .where(`"User"."email" = :email`, {
          email: req.body.email,
        })
        .addSelect(`"User"."password" AS "User_password"`)
        .getOne();

      if (!user) {
        res.status(404).json("no user with " + req.body.email);
        return;
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.status(401).json("wrong password");
        return;
      }
      const loggedUser = await userRepository.findOne({
        where: {
          id: user.id,
        },
        relations: ["teams"],
      });
      res.json({
        user: loggedUser,
        token: jsonwebtoken.sign(
          { userId: user.id },
          process.env.token || "RANDOM_TOKEN_SECRET",
          {
            expiresIn: "24h",
          }
        ),
      });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
};

export { userController };
