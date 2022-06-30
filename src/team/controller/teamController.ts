import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Team } from "../model/Team";
import { QueryHelper } from "../../utils/QueryHelper";
import { Member } from "../../member/model/Member";

const teamRepository = AppDataSource.getRepository(Team);
const memberRepository = AppDataSource.getRepository(Member);

const teamController = {
  async create(req: Request, res: Response) {
    try {
      const team = await teamRepository.save({
        ...req.body,
      });
      const member = await memberRepository.save({
        user: req.loggedUser,
        team: team,
        manager: true,
      });
      const { id, name, email } = member.user;
      res.json({
        ...team,
        posts: [],
        members: [{ id: member.id, manager: true, user: { id, name, email } }],
      });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  get(req: Request, res: Response) {
    res.json(req.team);
  },

  async getAll(req: Request, res: Response) {
    try {
      const teams = await teamRepository.find(QueryHelper.getOptions(req));
      res.json(teams);
    } catch (e) {
      console.log(e);
      res.status(401).json(e);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const {
        team,
        body: { name },
      } = req;
      team.name = name;
      const updatedTeam = await teamRepository.save(team);
      res.json(updatedTeam);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await teamRepository.delete(req.team.id);
      res.json({ message: "deleted" });
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
};

export { teamController };
