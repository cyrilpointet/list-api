import { check, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const teamUpdateValidator = [
  check("userId")
    .isNumeric()
    .withMessage(`userId: ${errorMsg.validation.invalidFormat}`)
    .bail()
    .not()
    .isEmpty()
    .withMessage(`userId: ${errorMsg.validation.required}`)
    .bail(),
  check("teamId")
    .isNumeric()
    .withMessage(`teamId: ${errorMsg.validation.invalidFormat}`)
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
