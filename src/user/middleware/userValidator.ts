import { check, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const registerValidator = [
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
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`email: ${errorMsg.validation.required}`)
    .bail()
    .isEmail()
    .withMessage(errorMsg.validation.invalidEmail)
    .bail(),
  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`mot de passe: ${errorMsg.validation.required}`)
    .bail()
    .isLength({ min: 4 })
    .withMessage(`${errorMsg.validation.minLenght} : 4`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export const loginValidator = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage(`email: ${errorMsg.validation.required}`)
    .bail()
    .isEmail()
    .withMessage(errorMsg.validation.invalidEmail)
    .bail(),
  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`mot de passe: ${errorMsg.validation.required}`)
    .bail()
    .isLength({ min: 4 })
    .withMessage(`${errorMsg.validation.minLenght} : 4`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
