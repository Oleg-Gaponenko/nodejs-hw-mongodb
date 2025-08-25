import httpError from "http-errors";
import { contactQuerySchema } from "../validation/contactQuerySchema.js";

export default function validateQuery(request, response, next) {
  const { error, value } = contactQuerySchema.validate(request.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return next (httpError(400, 'Bad request', {errors: error.details}));
  }

  Object.keys(request.query).forEach((key) => { if (!(key in value)) delete request.query[key]; });
  Object.assign(request.query, value);
  next();
}