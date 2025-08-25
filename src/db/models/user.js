import { model, Schema } from "mongoose";

const users = new Schema ({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        email: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
        versionKey: false,
    },
);

export const usersCollection = model('users', users);