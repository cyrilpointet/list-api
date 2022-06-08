import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User);

const userController = {
  async read(req: Request, res: Response, next: NextFunction) {
    res.json(req.loggedUser);
  },

  async create(req: Request, res: Response, next: NextFunction) {
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
            expiresIn: "24h",
          }
        ),
      });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const user = await userRepository.findOneBy({ email: req.body.email });
    if (!user) {
      res.status(404).json("no user with " + req.body.email);
      return;
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      res.status(401).json("wrong password");
      return;
    }
    delete user.password;
    res.json({
      user,
      token: jsonwebtoken.sign(
        { userId: user.id },
        process.env.token || "RANDOM_TOKEN_SECRET",
        {
          expiresIn: "24h",
        }
      ),
    });
  },
};

export { userController };
