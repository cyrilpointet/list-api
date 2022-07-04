import { check, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const memberCreateValidator = [
  check("userId")
    .bail()
    .not()
    .isEmpty()
    .withMessage(`userId: ${errorMsg.validation.required}`)
    .bail(),
  check("teamId")
    .bail()
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

export const memberUpdateValidator = [
  check("manager")
    .isBoolean()
    .not()
    .isEmpty()
    .withMessage(`manager: ${errorMsg.validation.required}`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
