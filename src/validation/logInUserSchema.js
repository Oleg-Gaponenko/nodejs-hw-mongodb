import Joi from 'joi';

export const logInUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(100).required(),
});
