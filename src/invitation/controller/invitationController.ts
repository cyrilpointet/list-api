import { Request, Response } from "express";
import { mailer } from "../../services/mailer";
import { AppDataSource } from "../../data-source";
import { Invitation } from "../model/Invitation";
import { errorMsg } from "../../constantes/errorMsg";
import { Team } from "../../team/model/Team";
import { QueryHelper } from "../../utils/QueryHelper";

const invitationRepository = AppDataSource.getRepository(Invitation);
const teamRepository = AppDataSource.getRepository(Team);

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
};

export { invitationController };
