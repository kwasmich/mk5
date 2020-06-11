class MyElement extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super();
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}


customElements.define('my-element', MyElement);
