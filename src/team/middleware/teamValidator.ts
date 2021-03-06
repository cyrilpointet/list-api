import { check, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const teamCreateValidator = [
  check("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`nom: ${errorMsg.validation.required}`)
    .bail()
    .isLength({ min: 3 })
    .withMessage(`${errorMsg.validation.minLenght} : 3`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export const teamUpdateValidator = [
  check("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`nom: ${errorMsg.validation.required}`)
    .bail()
    .isLength({ min: 3 })
    .withMessage(`${errorMsg.validation.minLenght} : 3`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
