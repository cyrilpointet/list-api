import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Team } from "../model/Team";
import { errorMsg } from "../../constantes/errorMsg";

const teamRepository = AppDataSource.getRepository(Team);

export const isTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.teamId && !req.body.teamId) {
    res.status(403).json(errorMsg.validation.missingParam);
    return;
  }
  const teamId = req.params.teamId || req.body.teamId;
  try {
    const team = await teamRepository.findOne({
      where: {
        id: teamId,
      },
      relations: ["posts", "members.user"],
    });
    if (!team) {
      res.status(404).json(errorMsg.notFound);
      return;
    }
    if (team.members.find((elem) => elem.user.id === req.loggedUser.id)) {
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
