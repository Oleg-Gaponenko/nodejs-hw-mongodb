import { getAllContacts, getContactById } from "../services/contacts.js";

    export async function getAllContactsController(request, response) {
        const contacts = await getAllContacts();

        response.json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,
        });
    };
   
    export async function getContactByIdController(request, response) {
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
    };