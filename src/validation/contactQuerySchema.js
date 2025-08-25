import Joi from "joi";

export const contactQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  perPage: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('name').default('name'),
  sortOrder: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
  type: Joi.string().valid('work', 'home', 'personal'),
  isFavourite: Joi.boolean()
    .truthy('1', 'true', 'yes', 'on')
    .falsy('0', 'false', 'no', 'off'),
});