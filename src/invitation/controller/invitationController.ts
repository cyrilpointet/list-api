import { Request, Response } from "express";
import { mailer } from "../../services/mailer";
import { AppDataSource } from "../../data-source";
import { Invitation } from "../model/Invitation";
import { errorMsg } from "../../constantes/errorMsg";
import { Team } from "../../team/model/Team";
import { QueryHelper } from "../../utils/QueryHelper";
import { Member } from "../../member/model/Member";
import { User } from "../../user/model/User";

const invitationRepository = AppDataSource.getRepository(Invitation);
const teamRepository = AppDataSource.getRepository(Team);
const memberRepository = AppDataSource.getRepository(Member);
const userRepository = AppDataSource.getRepository(User);

const invitationController = {
  async createFromTeam(req: Request, res: Response) {
    try {
      const testInvitation = await invitationRepository
        .createQueryBuilder("invitation")
        .where("invitation.email = :email AND invitation.teamId = :teamId", {
          email: req.body.email,
          teamId: req.team.id,
        })
        .getOne();
      if (testInvitation) {
        res.status(422).json(errorMsg.invitation.allreadyExist);
        return;
      }

      if (req.team.members.find((elem) => elem.user.email === req.body.email)) {
        res.status(404).json(errorMsg.member.allreadyExist);
        return;
      }

      const invitation = await invitationRepository.save({
        email: req.body.email,
        team: req.team,
        fromTeam: true,
      });

      const text = `${req.loggedUser.name} veut partager la liste ${req.team.name} avec vous sur myList.com.`;
      await mailer.sendMail(
        req.body.email,
        text,
        `Invitation de ${req.loggedUser.name} sur myList.com`
      );

      res.json(invitation);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async createFromUser(req: Request, res: Response) {
    try {
      const testInvitation = await invitationRepository
        .createQueryBuilder("invitation")
        .where("invitation.email = :email AND invitation.teamId = :teamId", {
          email: req.loggedUser.email,
          teamId: req.body.teamId,
        })
        .getOne();
      if (testInvitation) {
        res.status(422).json(errorMsg.invitation.allreadyExist);
        return;
      }

      const team = await teamRepository.findOne({
        where: {
          id: req.body.teamId,
        },
        relations: ["members.user"],
      });
      if (!team) {
        res.status(404).json(errorMsg.notFound);
        return;
      }

      if (team.members.find((elem) => elem.user.id === req.loggedUser.id)) {
        res.status(404).json(errorMsg.member.allreadyExist);
        return;
      }

      const invitation = await invitationRepository.save({
        email: req.loggedUser.email,
        team,
        fromTeam: false,
      });

      res.json(invitation);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const invitations = await invitationRepository.find(
        QueryHelper.getOptions(req)
      );
      res.json(invitations);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async accept(req: Request, res: Response) {
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

      const invitedUser = await userRepository.findOne({
        where: {
          email: invitation.email,
        },
      });
      if (!invitedUser) {
        res.status(401).json(errorMsg.invitation.unknownMember);
        return;
      }

      if (
        invitation.team.members.find((elem) => elem.user.id === invitedUser.id)
      ) {
        await invitationRepository.delete(invitation.id);
        res.status(422).json(errorMsg.member.allreadyExist);
        return;
      }

      const member = await memberRepository.save({
        team: invitation.team,
        user: invitedUser,
        manager: false,
      });
      await invitationRepository.delete(invitation.id);

      res.json(member);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
};

export { invitationController };
