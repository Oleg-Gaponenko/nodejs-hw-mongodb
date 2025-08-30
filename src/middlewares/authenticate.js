import httpError from "http-errors";
import { sessionsCollection } from "../db/models/session.js";
import { usersCollection } from "../db/models/user.js";

export default async function authenticate(request, response, next) {
    try {
        const authorization = request.headers.authorization || '';
        const [type = '', token = ''] = authorization.split(' ');

        if(type.toLowerCase() !== 'bearer' || !token) {
            return next(httpError(401, 'Unauthorized'));
        }

        const session = await sessionsCollection.findOne({
            accessToken: token,
            accessTokenValidUntil: { $gt: new Date() },
        });

        if(!session) {
            const inCaseNotValidToken = await sessionsCollection.findOne({ accessToken: token });
            if (inCaseNotValidToken && inCaseNotValidToken.accessTokenValidUntil.getTime() <= Date.now()) {
                return next(httpError(401, 'Access token expired'));
            }

        return next(httpError(401, 'Unauthorized'));
        }

        const user = await usersCollection.findById(session.userId);
        if(!user) {
            return next(httpError(401, 'Unauthorized'));
        }

        request.user = user;
        request.session = session;
        return next();
    } catch (error) {
        return next(error);
    }
};