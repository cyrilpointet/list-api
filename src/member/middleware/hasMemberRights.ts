import { NextFunction, Request, Response } from "express";
import { errorMsg } from "../../constantes/errorMsg";
import { AppDataSource } from "../../data-source";
import { Member } from "../model/Member";
import { Team } from "../../team/model/Team";

const memberRepository = AppDataSource.getRepository(Member);
const teamRepository = AppDataSource.getRepository(Team);

export const hasMemberRights = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.params.memberId) {
    res.status(403).json(errorMsg.validation.missingParam);
    return;
  }
  try {
    const member = await memberRepository.findOne({
      where: {
        id: req.params.memberId,
      },
      relations: ["team", "user"],
    });
    if (!member) {
      res.status(404).json(errorMsg.notFound);
      return;
    }
    const team = await teamRepository.findOne({
      where: {
        id: member.team.id,
      },
      relations: ["posts", "members.user"],
    });
    if (
      member.user.id === req.loggedUser.id ||
      team.members.find(
        (elem) => elem.user.id === req.loggedUser.id && elem.manager
      )
    ) {
      req.member = member;
      req.team = team;
      next();
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};
