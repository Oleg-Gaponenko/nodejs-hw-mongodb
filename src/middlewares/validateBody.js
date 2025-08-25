import httpError from "http-errors";

export default function validateBody(schema) {
    return async (request, response, next) => {
        const { error, value } = await schema.validate(request.body, {abortEarly: false, stripUnknown: true,});
        if (error) {
            return next(httpError(400, 'Bad request', {errors: error.details}));
        };
        request.body = value;
        next();
    };
}