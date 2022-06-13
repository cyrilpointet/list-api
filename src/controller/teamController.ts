import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Team } from "../entity/Team";

const teamRepository = AppDataSource.getRepository(Team);

const teamController = {
  async create(req: Request, res: Response) {
    try {
      const team = await teamRepository.save({
        ...req.body,
        manager: req.loggedUser,
      });
      res.json(team);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },

  read(req: Request, res: Response) {
    res.json(req.team);
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
