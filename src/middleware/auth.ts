import express from "express";
import * as jsonwebtoken from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const userRepository = AppDataSource.getRepository(User);

export const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw "Token missing";
    }
    const decodedToken = jsonwebtoken.verify(
      token,
      process.env.token || "RANDOM_TOKEN_SECRET"
    );
    const user = await userRepository.findOneBy({ id: decodedToken.userId });
    if (!user) {
      throw "Invalid user ID";
    } else {
      delete user.password;
      req.loggedUser = user;
      next();
    }
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
