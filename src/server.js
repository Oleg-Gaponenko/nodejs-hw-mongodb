import express from "express";
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT);

export default function setupServer() {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(pino({
        transport:{
            target: 'pino-pretty'
        },
    }),
);

    app.use('/', (request, response, next) => {
        response.status(404).json({
            message: 'Not found',
        });
    });

    app.listen( PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};