import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
import { sessionsCollection } from "../db/models/session.js";
import { usersCollection } from "../db/models/user.js";
import httpError from "http-errors";
import bcrypt from 'bcrypt';
import {randomBytes} from 'crypto';
import { signResetToken, verifyResetToken } from "../utils/resetToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export async function registerNewUser({name, email, password}) {
    const userRegisteredBefore = await usersCollection.findOne({email});
    if (userRegisteredBefore) {
        throw httpError(409, 'Email in use');
    };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersCollection.create({name, email, password: hashedPassword});
    const safeData = newUser.toObject();
    delete safeData.password;
    return safeData;
};

export async function logInUser({email, password}) {
    const user = await usersCollection.findOne({email}).select('+password');
    if (!user) {
        throw httpError(401, 'Unauthorized');
    }

    const matchedData = await bcrypt.compare(password, user.password);
    if (!matchedData) {
        throw httpError(401, 'Unauthorized');
    }

    await sessionsCollection.deleteMany({userId: user._id});

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    const currentDate = Date.now();
    const session = await sessionsCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(currentDate + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(currentDate + THIRTY_DAYS),
    });

    return session;
};

export async function refreshSession({sessionId, refreshToken}) {
    if(!sessionId || !refreshToken) {
        throw httpError(401, 'Unauthorized');
    }

    const previousSession = await sessionsCollection.findOne({_id: sessionId, refreshToken});
    if(!previousSession) {
        throw httpError(401, 'Unauthorized');
    }

    if(previousSession.refreshTokenValidUntil.getTime() <= Date.now()) {
        await sessionsCollection.deleteOne({_id: previousSession._id});
        throw httpError(401, 'Unauthorized');
    }

    await sessionsCollection.deleteOne({_id: previousSession._id});
    const accessToken = randomBytes(30).toString('base64');
    const newRefreshToken = randomBytes(30).toString('base64');
    const currentDate = Date.now();

    const nextSession = await sessionsCollection.create ({
        userId: previousSession.userId,
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: new Date(currentDate + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(currentDate + THIRTY_DAYS),
    });

    return nextSession;
};

export async function logOutUser ({sessionId, refreshToken}) {
    if(!sessionId || !refreshToken) return;
    await sessionsCollection.deleteOne({_id: sessionId, refreshToken});
};

export async function resetEmail({email}){
    const user = await usersCollection.findOne({email});

    if(!user) {
        throw httpError(404, 'User not found!');
    }

    const token = signResetToken(email);
    const domain = process.env.APP_DOMAIN;

    try {
        await sendEmail({
            to: email,
            subject: 'Reset your password',
            text: 'Please click the link below to reset your password',
            html: `<p>Here is the link: </p><p><a href=${domain}/reset-password?token=${token}></a></p>`,
        });
    } catch {
        throw httpError(500, 'Failed to send the email, please try again later.');
    }
};

export async function resetPassword({token, password}){
    let data;

    try {
        data = verifyResetToken(token);
    } catch {
        throw httpError(401, 'Token is expired or invalid.');
    }

    const user = await usersCollection.findOne({email: data.email}).select('+password');
    if(!user) {
        throw httpError(404, 'User not found.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.save();

    await sessionsCollection.deleteMany({userId: user._id});
};