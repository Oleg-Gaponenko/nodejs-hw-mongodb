import createHttpError from 'http-errors';

const HttpError = createHttpError;

export default function errorHandler(error, request, response, next) {
  const status = (error instanceof HttpError ? error.status : error.statusCode) || 500;
  const message = error.message || 'Something went wrong';
  response.status(status).json({ status, message });
}
