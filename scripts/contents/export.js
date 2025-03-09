(async function () {
    try {
        const contactStore = window.contactStoreData;
        const prefix = contactStore.inputPrefix || "customers";
        let suffix = Number(contactStore.inputSuffix || 0);

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

    } catch (error) {
        console.log(error);
        console.log("Error executing job");
    }
})()