import httpError from "http-errors";
import { isValidObjectId } from "mongoose";

export default function isValidId (request, response, next) {
    const { contactId } = request.params;
    if (!isValidObjectId(contactId)) {
        return next (httpError(400, 'This ID is not valid'));
    }

    next();
}