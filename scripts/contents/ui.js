let { render, signal, component } = reef;

class UI {
    constructor() {
        this.contactStore = signal({
            contactSize: 2,
            inputValue: ""
        });
        this.initializeCounter();
        this.initializeComponent();
    }

    initializeCounter() {
        setInterval(() => {
            this.contactStore.contactSize++;
        }, 100);
    }

    watchEvent() {
        if (!event.target.matches('[c-input]')) return;
        this.contactStore.inputValue = event.target.value;
    }

    template() {
        let { contactSize, inputValue } = this.contactStore;

        return `<div>
        <p>${contactSize}</p>
        <input c-input type="text"/>
        <p>${inputValue}</p>
        <a href="#">Save contact</a>
        </div>`;
    }

    initializeComponent() {
        let app = document.querySelector('#app');
        component(app, () => this.template());
        app.addEventListener('input', this.watchEvent.bind(this));
    }
}

// Initialize the UI
const ui = new UI();
