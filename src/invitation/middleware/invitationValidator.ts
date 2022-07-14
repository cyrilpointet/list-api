import { check, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const invitationCreateValidator = [
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`nom: ${errorMsg.validation.required}`)
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
