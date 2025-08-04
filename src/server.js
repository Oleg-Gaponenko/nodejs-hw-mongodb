import express from "express";
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import { getAllContacts, getContactById } from "./services/contacts.js";

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

    app.get('/contacts', async (request, response) => {
        const contacts = await getAllContacts();

        response.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    });
   
    app.get('/contacts/:contactId', async (request, response) => {
        const { contactId } = request.params;
        const contact = await getContactById(contactId);

        if (!contact) {
            response.status(404).json({
                message: 'Contact not found',
            });
        }

        response.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}`,
            data: contact,
        });
    });

    app.use('/', (request, response, next) => {
        response.status(404).json({
            message: 'Not found',
        });
    });

    app.listen( PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};