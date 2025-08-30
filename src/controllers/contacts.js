import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import httpError from 'http-errors';

export async function getAllContactsController(request, response, next) {
  const userId = request.user._id;
  const contacts = await getAllContacts(request.query, userId);

  response.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(request, response, next) {
  const userId = request.user._id;
  const { contactId } = request.params;
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    return next(httpError(404, 'Contact not found'));
  }

  response.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
}

export async function createContactController(request, response, next) {
  const userId = request.user._id;
  const createdContact = await createContact(request.body, userId);

  response.status(201).json({
    status: 201,
    message: 'Successfully created a contact',
    data: createdContact,
  });
}

export async function updateContactController(request, response, next) {
  const userId = request.user._id;
  const { contactId } = request.params;
  const updatedContact = await updateContact(contactId, request.body, userId);

  if (!updatedContact) {
    return next(httpError(404, 'Contact not found'));
  }

  response.json({
    status: 200,
    message: 'Successfully patched a contact',
    data: updatedContact,
  });
}

export async function deleteContactController(request, response, next) {
  const userId = request.user._id;
  const { contactId } = request.params;
  const contactToDelete = await deleteContact(contactId, userId);

  if (!contactToDelete) {
    return next(httpError(404, 'Contact not found'));
  }

  response.status(204).send();
}
