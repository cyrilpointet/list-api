import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Member } from "../model/Member";
import { Team } from "../../team/model/Team";
import { User } from "../../user/model/User";
import { errorMsg } from "../../constantes/errorMsg";

const memberRepository = AppDataSource.getRepository(Member);
const teamRepository = AppDataSource.getRepository(Team);
const userRepository = AppDataSource.getRepository(User);

const memberController = {
  async create(req: Request, res: Response) {
    try {
      const testMember = await AppDataSource.getRepository(Member)
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
};

export { memberController };
