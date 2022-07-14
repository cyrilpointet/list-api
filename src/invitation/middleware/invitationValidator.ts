import { check, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const invitationCreateFromTeamValidator = [
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`email: ${errorMsg.validation.required}`)
    .bail()
    .isEmail()
    .withMessage(errorMsg.validation.invalidEmail)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export const invitationCreateFromUserValidator = [
  check("teamId")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`teamId: ${errorMsg.validation.required}`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
