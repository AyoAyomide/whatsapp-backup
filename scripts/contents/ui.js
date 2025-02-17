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
        chrome.storage.local.get("count", (result) => {
            let value = result.count || 0;
            this.contactStore.contactSize = value;
        });
    }

    watchEvent() {
        let isPrefix = event.target.matches('[input-prefix');
        let isSuffix = event.target.matches('[input-suffix');

        if (!isPrefix && !isSuffix) return;

        if (isPrefix) {
            this.contactStore.inputPrefix = event.target.value;
        } else if (isSuffix) {
            this.contactStore.inputSuffix = event.target.value;
        }
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
        <a href="#" class="button primary">Export</a>
        `;
    }

    initializeComponent() {
        let app = document.querySelector('#app');
        component(app, () => this.template());
        app.addEventListener('input', this.watchEvent.bind(this));
    }
}

// Initialize the UI
const ui = new UI();
