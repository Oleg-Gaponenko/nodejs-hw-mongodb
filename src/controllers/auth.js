import { THIRTY_DAYS } from "../constants/index.js";
import { logInUser, logOutUser, refreshSession, registerNewUser } from "../services/auth.js";


const baseCookieData = {
    httpOnly: true,
    path: '/',
};

export async function registerNewUserController(request, response, next) {
        const user = await registerNewUser(request.body);

        response.status(201).json({
            status: 201,
            message: 'Successfully registered a user!',
            data: user,
        });
};

export async function logInUserController(request, response, next) {
        const session = await logInUser(request.body);

        response
        .cookie('refreshToken', session.refreshToken, {...baseCookieData, maxAge: THIRTY_DAYS})
        .cookie('sessionId', String(session._id), {...baseCookieData, maxAge: THIRTY_DAYS})
        .status(200)
        .json({
            status: 200,
            message: 'Successfully logged in a user!',
            data: {accessToken: session.accessToken},
        });
};

export async function refreshSessionController (request, response, next) {
        const refreshedSession = await refreshSession({
            sessionId: request.cookies?.sessionId,
            refreshToken: request.cookies.refreshToken,
        });

        response
        .cookie('refreshToken', refreshedSession.refreshToken, {...baseCookieData, maxAge: THIRTY_DAYS})
        .cookie('sessionId', String(refreshedSession._id), {...baseCookieData, maxAge: THIRTY_DAYS})
        .status(200)
        .json({
            status: 200,
            message: 'Successfully refreshed a session!',
            data: {accessToken: refreshedSession.accessToken},
        });
};

export async function logOutUserController (request, response, next) {
        await logOutUser({
            sessionId: request.cookies?.sessionId,
            refreshToken: request.cookies?.refreshToken,
        });

        response
        .clearCookie('refreshToken', {path: '/'})
        .clearCookie('sessionId', {path: '/'})
        .status(204).send();
};