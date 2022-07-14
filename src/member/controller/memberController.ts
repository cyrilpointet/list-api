import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Member } from "../model/Member";
import { Team } from "../../team/model/Team";
import { User } from "../../user/model/User";
import { errorMsg } from "../../constantes/errorMsg";
import { QueryHelper } from "../../utils/QueryHelper";

const memberRepository = AppDataSource.getRepository(Member);
const teamRepository = AppDataSource.getRepository(Team);
const userRepository = AppDataSource.getRepository(User);

const memberController = {
  async create(req: Request, res: Response) {
    try {
      const testMember = await memberRepository
        .createQueryBuilder("member")
        .where("member.userId = :userId AND member.teamId = :teamId", {
          userId: req.body.userId,
          teamId: req.body.teamId,
        })
        .getOne();
      if (testMember) {
        res.status(422).json(errorMsg.member.allreadyExist);
        return;
      }

      const user = await userRepository.findOne({
        where: {
          id: req.body.userId,
        },
      });
      const team = await teamRepository.findOne({
        where: {
          id: req.body.teamId,
        },
      });
      if (!user || !team) {
        res.status(404).json(errorMsg.notFound);
      }

      const member = await memberRepository.save({
        team,
        user,
        manager: false,
      });
      res.json(member);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const members = await memberRepository.find({
        ...QueryHelper.getOptions(req),
        relations: ["team", "user"],
      });
      res.json(members);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  get(req: Request, res: Response) {
    res.json(req.member);
  },

  async update(req: Request, res: Response) {
    try {
      const testMembers = await AppDataSource.getRepository(Member)
        .createQueryBuilder("member")
        .where("member.teamId = :teamId AND member.manager = true", {
          teamId: req.team.id,
        })
        .getMany();
      if (testMembers.length < 2 && req.body.manager === false) {
        res.status(403).json(errorMsg.member.notEnoughManager);
        return;
      }
      const {
        member,
        body: { manager },
      } = req;
      member.manager = manager;
      const updatedMember = await memberRepository.save(member);
      res.json(updatedMember);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async delete(req: Request, res: Response) {
    if (req.member.manager) {
      res.status(403).json(errorMsg.member.memberIsManager);
      return;
    }
    try {
      await memberRepository.delete(req.member.id);
      res.json({ message: "deleted" });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
};

export { memberController };
