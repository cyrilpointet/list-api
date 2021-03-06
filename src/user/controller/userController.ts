import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { User } from "../model/User";
import { QueryHelper } from "../../utils/QueryHelper";
import { Invitation } from "../../invitation/model/Invitation";

const userRepository = AppDataSource.getRepository(User);
const invitationRepository = AppDataSource.getRepository(Invitation);

const userController = {
  async create(req: Request, res: Response) {
    try {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = await userRepository.save({
        ...req.body,
        password: hash,
      });
      delete newUser.password;
      const invitations = await invitationRepository.find({
        where: {
          email: newUser.email,
          fromTeam: true,
        },
        relations: ["team"],
      });
      res.json({
        user: { ...newUser, invitations },
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

  async getAll(req: Request, res: Response) {
    try {
      const users = await userRepository.find(QueryHelper.getOptions(req));
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(401).json(e);
    }
  },

  async get(req: Request, res: Response) {
    const invitations = await invitationRepository.find({
      where: {
        email: req.loggedUser.email,
        fromTeam: true,
      },
      relations: ["team"],
    });
    res.json({ ...req.loggedUser, invitations });
  },

  async update(req: Request, res: Response) {
    try {
      const {
        loggedUser,
        body: { name },
      } = req;
      loggedUser.name = name;
      const updatedUser = await userRepository.save(loggedUser);
      const invitations = await invitationRepository.find({
        where: {
          email: updatedUser.email,
          fromTeam: true,
        },
        relations: ["team"],
      });
      res.json({ ...updatedUser, invitations });
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
        relations: ["membership.team"],
      });
      const invitations = await invitationRepository.find({
        where: {
          email: user.email,
          fromTeam: true,
        },
        relations: ["team"],
      });
      res.json({
        user: { ...loggedUser, invitations },
        token: jsonwebtoken.sign(
          { userId: user.id },
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
};

export { userController };
