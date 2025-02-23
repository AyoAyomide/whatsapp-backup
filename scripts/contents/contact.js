function filterContact(contacts, extractedContacts) {
    contacts.forEach(item => {
        let userNumbers = item?.id.split("@")[0].split("-")[0];
        if (!item.name && userNumbers.length < 16 && userNumbers != "status")
            extractedContacts.add("+" + userNumbers);
    });

    return extractedContacts;
}

async function getContacts() {

    const db = await idb.openDB("model-storage");

    const chat = await db.getAll("chat");

    return chat;
}

(async function () {

    const contactSet = new Set();

    const unsavedContacts = await getContacts();

    const filteredContacts = filterContact(unsavedContacts, contactSet);

    await chrome.storage.local.set({ count: filteredContacts.size });
})();