import { contactsCollection } from '../db/models/contact.js';

export async function getAllContacts(options = {}) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = options;

  const pageNumber = Math.max(1, Number(page) || 1);
  const perPageNumber = Math.min(100, Math.max(1, Number(perPage) || 10));
  const skip = (pageNumber - 1) * perPageNumber;

  const filter = {};
  if (typeof type !== 'undefined' && type !== '') {
    filter.contactType = type;
  }

  if (typeof isFavourite !== 'undefined') {
    filter.isFavourite = isFavourite;
  }

  const sort = { [sortBy]: sortOrder.toLowerCase() === 'desc' ? -1 : 1 };

  const [items, totalItems] = await Promise.all([
    contactsCollection.find(filter).sort(sort).skip(skip).limit(perPageNumber),
    contactsCollection.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalItems / perPageNumber));

  return {
    data: items,
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  };
}

export async function getContactById(contactId) {
  const contact = await contactsCollection.findById(contactId);
  return contact;
}

export async function createContact(contactData) {
  const createdContact = await contactsCollection.create(contactData);
  return createdContact;
}

export async function updateContact(contactId, dataToUpdate) {
  const updatedContact = await contactsCollection.findByIdAndUpdate(
    contactId,
    dataToUpdate,
    { new: true },
  );
  return updatedContact;
}

export async function deleteContact(contactId) {
  const outcome = await contactsCollection.findByIdAndDelete(contactId);
  return outcome;
}
