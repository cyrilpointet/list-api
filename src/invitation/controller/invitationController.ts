import { Request, Response } from "express";
import { mailer } from "../../services/mailer";

const invitationController = {
  async create(req: Request, res: Response) {
    const text = `${req.loggedUser.name} veut partager une liste avec vous sur myList.com.`;
    try {
      const resp = await mailer.sendMail(
        req.body.email,
        text,
        `Invitation de ${req.loggedUser.name} sur myList.com`
      );
      res.json(resp);
    } catch (e) {
      console.log(e);
      res.status(422).json(e.message);
    }
  },
};

export { invitationController };
