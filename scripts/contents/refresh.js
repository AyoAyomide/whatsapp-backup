const WHATSAPP_URL = 'https://web.whatsapp.com/';

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

async function getContactSet() {

    try {
        const contactSet = new Set();

        const unsavedContacts = await getContacts();

        const filteredContacts = filterContact(unsavedContacts, contactSet);

        console.log(filteredContacts);
    } catch (error) {
        console.log(error);
        console.log("Error getting contacts");
    }

    // await chrome.storage.local.set({ count: filteredContacts.size });

    console.log("hello from getting contacts");

}

async function refreshContact() {
    try {
        const tabs = await chrome.tabs.query({ url: `${WHATSAPP_URL}*` });

        if (tabs.length > 0) {
            const tab = tabs[0];
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: async () => {

                    const found = new Set();
                    const db = await idb.openDB("model-storage");
                    const chat = await db.getAll("chat");

                    chat.forEach(({ id, name }) => {
                        const userNumbers = id?.split("@")[0].split("-")[0];
                        if (!name && userNumbers.length < 16 && userNumbers !== "status") {
                            found.add(`+${userNumbers}`);
                        }
                    });

                    await chrome.storage.local.set({ count: found.size });

                }
            });
        }
    } catch (error) {
        console.log("Error executing job");
    }
}

async function exportContact(contactStore) {

    const tabs = await chrome.tabs.query({ url: `${WHATSAPP_URL}*` });

    if (tabs.length > 0) {
        const tab = tabs[0];

        // First, inject the data you want to pass
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (data) => {
                window.contactStoreData = data;
            },
            args: [contactStore]
        });

        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [
                './scripts/lib/idb.js',
                './scripts/contents/export.js'
            ]  // Path to your idb.js file
        });
    }

}


