async function getContacts() {

    const db = await idb.openDB("model-storage");

    const chat = await db.getAll("chat");

    return chat;
}

class ContactExtractor {
    constructor() {
        this.extractedContacts = new Set();
    }

    filterContact(data) {
        data.forEach(item => {
            let userNumbers = item?.id.split("@")[0].split("-")[0];
            if (!item.name && userNumbers.length < 16 && userNumbers != "status")
                this.extractedContacts.add("+" + userNumbers);
        });

        this.createSaveButton();
    }

    createSaveButton() {
        let body = document.querySelector("#app > div > div.x78zum5.xdt5ytf.x5yr21d > div > div.x9f619.x1n2onr6.xyw6214.x5yr21d.x6ikm8r.x10wlt62.x17dzmu4.x1i1dayz.x2ipvbc.x1w8yi2h.xyyilfv.x1iyjqo2.xy80clv.x26u7qi.x1ux35ld");
        let btn = document.createElement("a");

        btn.innerText = `Download`;
        btn.id = "SaveButton";

        btn.style.backgroundColor = "#4CAF50";
        btn.style.color = "white";
        btn.style.padding = "15px 32px";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.borderRadius = "8px";
        btn.style.margin = "4px 2px";
        btn.style.display = "inline-block";
        btn.style.fontSize = "16px";
        btn.style.textAlign = "center";

        btn.addEventListener("click", this.exportCSV.bind(this));
        this.saveButton = btn;

        // Create Input Field
        let input = document.createElement("input");
        input.id = "SaveInput";
        input.type = "text";
        input.placeholder = "Start from";

        input.style.backgroundColor = "white";
        input.style.color = "black";
        input.style.padding = "12px";
        input.style.border = "1px solid #ccc";
        input.style.borderRadius = "8px";
        input.style.margin = "4px 2px";
        input.style.display = "inline-block";
        input.style.fontSize = "16px";
        input.style.textAlign = "left";

        this.inputField = input;

        // Append elements
        body.prepend(this.saveButton);
        body.prepend(this.inputField);
    }

    findUnsaved() {
        getContacts()
            .then(data => this.filterContact(data));
    }

    exportCSV() {
        let userContacts = [...this.extractedContacts];
        let startFrom = this.inputField.value != undefined ? this.inputField.value : 1;
        let contactList = ['Name,Phone\n'];

        userContacts.forEach((item, index) => {
            contactList.push(`Customer ${(startFrom)},${item}\n`);
            startFrom++;
        });

        // Create contact csv
        const blob = new Blob(contactList, { type: 'text/csv;charset=utf-8,' })
        const objUrl = URL.createObjectURL(blob);

        this.saveButton.setAttribute('href', objUrl)
        this.saveButton.setAttribute('download', 'Contact.csv');
    }
}

const start = new ContactExtractor()
start.findUnsaved();