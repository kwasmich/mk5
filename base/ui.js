export class UIHStack extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



Object.seal(UIHStack);



export class UIVStack extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



Object.seal(UIVStack);



export class UISpacer extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



Object.seal(UISpacer);




customElements.define("ui-h-stack", UIHStack);
customElements.define("ui-v-stack", UIVStack);
customElements.define("ui-spacer", UISpacer);
