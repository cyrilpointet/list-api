import { NextFunction, Request, Response } from "express";
import * as jsonwebtoken from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { User } from "../model/User";
import { errorMsg } from "../../constantes/errorMsg";

const userRepository = AppDataSource.getRepository(User);

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json(errorMsg.auth.missingToken);
    }
    const decodedToken = jsonwebtoken.verify(
      token,
      process.env.token || "RANDOM_TOKEN_SECRET"
    );
    const user = await userRepository.findOne({
      where: {
        id: decodedToken.userId,
      },
      relations: ["teams"],
    });
    if (!user) {
      res.status(401).json(errorMsg.auth.invalidToken);
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
