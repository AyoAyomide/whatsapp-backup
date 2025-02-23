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

async function exportContact() {


    try {
        const tabs = await chrome.tabs.query({ url: `${WHATSAPP_URL}*` });

        if (tabs.length > 0) {
            const tab = tabs[0];
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: async () => {

                    const prefix = await chrome.storage.local.get("prefix") | "customers";
                    let suffix = Number(await chrome.storage.local.get("suffix") | 0);


                    const found = new Set();
                    const db = await idb.openDB("model-storage");
                    const chat = await db.getAll("chat");

                    chat.forEach(({ id, name }) => {
                        const userNumbers = id?.split("@")[0].split("-")[0];
                        if (!name && userNumbers.length < 16 && userNumbers !== "status") {
                            found.add(`+${userNumbers}`);
                        }
                    });

                    // prepare csv file
                    let contactList = ['Name,Phone\n'];
                    const unsavedContact = [...found];


                    unsavedContact.forEach((item) => {
                        contactList.push(`${prefix}${(suffix)},${item}\n`);
                        suffix++;
                    })

                    // create csv file
                    const blob = new Blob(contactList, { type: 'text/csv;charset=utf-8,' })
                    const objUrl = URL.createObjectURL(blob);

                    // Create temporary link and trigger download
                    const downloadLink = document.createElement('a');
                    downloadLink.href = objUrl;
                    const unixTimestamp = Math.floor(Date.now() / 1000);
                    downloadLink.download = `contact_${unixTimestamp}.csv`;
                    downloadLink.click();

                }
            });
        }
    } catch (error) {
        console.log("Error executing job");
    }
}


async function exportContact2() {

    try {
        const tabs = await chrome.tabs.query({ url: `${WHATSAPP_URL}*` });

        if (tabs.length > 0) {
            const tab = tabs[0];
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: async () => {

                    new Contact().exportContact();
                    // const db = await idb.openDB("model-storage");

                    // const chat = await db.getAll("chat");

                    // console.log(chat);

                    // const blob = new Blob([1, 2, 3, 4], { type: 'text/csv;charset=utf-8,' })
                    // const objUrl = URL.createObjectURL(blob);
                    // // Create temporary link and trigger download
                    // const downloadLink = document.createElement('a');
                    // downloadLink.href = objUrl;
                    // downloadLink.download = `contact.csv`;
                    // // document.body.appendChild(downloadLink);
                    // downloadLink.click();

                }
                // files: ['scripts/job/updateUnsaved.js']
            });
        }
    } catch (error) {
        console.log("Error executing job");
    }

}

