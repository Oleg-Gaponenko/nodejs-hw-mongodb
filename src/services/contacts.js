import { contactsCollection } from "../db/models/contact.js";

export async function getAllContacts () {
    const contacts = await contactsCollection.find();
    return contacts;
}

export async function getContactById (contactId) {
    const contact = await contactsCollection.findById(contactId);
    return contact;
}