import { HttpError } from 'http-errors';

export default function errorHandler(error, request, response, next) {
  if (error instanceof HttpError) {
    response.status(error.status).json({
      status: error.status,
      message: error.message,
      data: error,
    });

    return;
  }

  response.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
}
