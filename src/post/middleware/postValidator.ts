import { check, param, validationResult } from "express-validator";
import { errorMsg } from "../../constantes/errorMsg";

export const postCreateValidator = [
  check("content")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage(`nom: ${errorMsg.validation.required}`)
    .bail()
    .isLength({ min: 1 })
    .withMessage(`${errorMsg.validation.minLenght} : 1`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export const postParamValidator = [
  param("postId").exists(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
