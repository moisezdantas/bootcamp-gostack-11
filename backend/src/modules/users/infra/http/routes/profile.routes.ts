import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ProfileController from "@modules/users/infra/http/controllers/ProfileController";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileController = new ProfileController();
profileRouter.use(ensureAuthenticated);

profileRouter.get("/", celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().valid(Joi.ref("password")),
    },
  }),profileController.show);

profileRouter.put("/", celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  profileController.update);

export default profileRouter;
