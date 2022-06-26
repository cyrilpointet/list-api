import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Team } from "../model/Team";
import { errorMsg } from "../../constantes/errorMsg";

const teamRepository = AppDataSource.getRepository(Team);

export const isTeamManager = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.teamId) {
    res.status(403).json(errorMsg.validation.missingParam);
    return;
  }
  try {
    const team = await teamRepository.findOne({
      where: {
        id: req.params.teamId,
      },
      relations: ["manager", "posts"],
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
