import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Team } from "../entity/Team";
import { errorMsg } from "../constantes/errorMsg";

const teamRepository = AppDataSource.getRepository(Team);

export const isTeamManager = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const team = await teamRepository.findOne({
      where: {
        id: req.params.id,
      },
      relations: ["manager"],
    });
    if (team.manager.id === req.loggedUser.id) {
      req.team = team;
      next();
    } else {
      res.status(401).json(errorMsg.auth.insufficientRights);
    }
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
