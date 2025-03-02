let { render, signal, component } = reef;

class UI {
    constructor() {

        this.contactStore = signal({
            contactSize: "",
            inputPrefix: "",
            inputSuffix: "",
        });
        this.initializeComponent();
        this.getContactSize();
    }

    getContactSize() {

        refreshContact();

        chrome.storage.local.get("count", (result) => {
            let value = result.count || 0;
            this.contactStore.contactSize = value;
        });
    }

    watchInputEvent() {
        let isPrefix = event.target.matches('[input-prefix]');
        let isSuffix = event.target.matches('[input-suffix]');

        if (!isPrefix && !isSuffix) return;

        const value = event.target.value;


        if (isPrefix) {
            this.contactStore.inputPrefix = value;
            chrome.storage.local.set({ prefix: value });
        } else if (isSuffix) {
            this.contactStore.inputSuffix = value;
            chrome.storage.local.set({ suffix: value });
        }
    }

    watchClickEvent() {

        // Fix the selector syntax - add closing bracket ]
        let isExportButton = event.target.matches('[export-contact]');

        if (!isExportButton) return;

        exportContact(this.contactStore);

    }


    template() {
        let { contactSize, inputPrefix, inputSuffix } = this.contactStore;

        return `
        <p>Found ${contactSize} contact</p>

        <p class="grouped">
            <input placeholder="Prefix: Customer" input-prefix type="text"/>
            <input placeholder="Suffix: 001" input-suffix type="text"/>
        </p>
        
        <p>${inputPrefix} ${inputSuffix}</p>
        <button export-contact class="button primary">Export</button>
        `;
    }

    initializeComponent() {
        let app = document.querySelector('#app');
        component(app, () => this.template());
        app.addEventListener('input', this.watchInputEvent.bind(this));
        app.addEventListener('click', this.watchClickEvent.bind(this));
    }
}

// Initialize the UI
const ui = new UI();
