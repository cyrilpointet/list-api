import { NextFunction, Request, Response } from "express";
import { errorMsg } from "../../constantes/errorMsg";
import { AppDataSource } from "../../data-source";
import { Invitation } from "../model/Invitation";
const invitationRepository = AppDataSource.getRepository(Invitation);

export const hasInvitationRights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.invitationId) {
    res.status(403).json(errorMsg.validation.missingParam);
    return;
  }
  try {
    const invitation = await invitationRepository.findOne({
      where: {
        id: req.params.invitationId,
      },
      relations: ["team", "team.members.user"],
    });

    if (!invitation) {
      res.status(404).json(errorMsg.notFound);
      return;
    }

    if (
      (invitation.fromTeam && req.loggedUser.email !== invitation.email) ||
      (!invitation.fromTeam &&
        !invitation.team.members.find(
          (elem) => elem.user.id === req.loggedUser.id && elem.manager
        ))
    ) {
      res.status(401).json(errorMsg.auth.insufficientRights);
      return;
    }

    req.invitation = invitation;
    next();
  } catch (e) {
    console.log(e);
    res.status(422).json(e.message);
    return;
  }
};
