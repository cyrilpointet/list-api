import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Team } from "../model/Team";
import { errorMsg } from "../../constantes/errorMsg";
import { Invitation } from "../../invitation/model/Invitation";

const teamRepository = AppDataSource.getRepository(Team);
const invitationRepository = AppDataSource.getRepository(Invitation);

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
    if (!team.members.find((elem) => elem.user.id === req.loggedUser.id)) {
      res.status(401).json(errorMsg.auth.insufficientRights);
      return;
    }

    let invitations;
    // if manager, add invitations
    if (
      team.members.find(
        (elem) => elem.user.id === req.loggedUser.id && elem.manager
      )
    ) {
      invitations = await invitationRepository.find({
        where: {
          team: team,
          fromTeam: false,
        },
      });
    }
    req.team = { ...team, invitations };
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
