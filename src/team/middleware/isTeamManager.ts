import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Team } from "../model/Team";
import { errorMsg } from "../../constantes/errorMsg";
import { Invitation } from "../../invitation/model/Invitation";
import { User } from "../../user/model/User";
import { invitationHelper } from "../../utils/invitationHelper";

const teamRepository = AppDataSource.getRepository(Team);
const invitationRepository = AppDataSource.getRepository(Invitation);

export const isTeamManager = async (
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

    if (
      !team.members.find(
        (elem) => elem.user.id === req.loggedUser.id && elem.manager
      )
    ) {
      res.status(401).json(errorMsg.auth.insufficientRights);
      return;
    }

    const rawInvitations = await invitationRepository
      .createQueryBuilder("invitation")
      .where("invitation.teamId = :teamId AND invitation.fromTeam = false", {
        teamId: team.id,
      })
      .getMany();
    const invitations = await invitationHelper.populateInvitationWithUser(
      rawInvitations
    );

    req.team = { ...team, invitations };
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
