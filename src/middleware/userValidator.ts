import { check, validationResult } from "express-validator";

export const registerValidator = [
  check("name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email name can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Password name can not be empty!")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Minimum 4 characters required!")
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
    .withMessage("Email name can not be empty!")
    .bail()
    .isEmail()
    .withMessage("Invalid email address!")
    .bail(),
  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("Password name can not be empty!")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Minimum 4 characters required!")
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
