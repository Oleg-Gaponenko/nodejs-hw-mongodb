import { contactsCollection } from "../db/models/contact.js";

export async function getAllContacts () {
    const contacts = await contactsCollection.find();
    return contacts;
}

export async function getContactById (contactId) {
    const contact = await contactsCollection.findById(contactId);
    return contact;
}

export async function createContact (contactData) {
    const createdContact = await contactsCollection.create(contactData);
    return createdContact;
}

export async function updateContact (contactId, dataToUpdate) {
    const updatedContact = await contactsCollection.findByIdAndUpdate(contactId, dataToUpdate, {new: true});
    return updatedContact;
}

export async function deleteContact(contactId) {
    const outcome = await contactsCollection.findByIdAndDelete(contactId);
    return outcome;
}