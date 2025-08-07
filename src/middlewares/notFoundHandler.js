import httpError from 'http-errors';

export default function notFoundHandler(request, response, next) {
    next(httpError(404, 'Route not found'));
}