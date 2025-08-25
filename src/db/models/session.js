import { model, Schema } from "mongoose";

const sessions = new Schema ({
    userId: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        requred: true,
    },
    refreshTokenValidUntil: {
        type: Date,
        requred: true,
    },
});

export const sessionsCollection = model('sessions', sessions);