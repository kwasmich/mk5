import UIView from "/base/ui-view.js";



const priv = Symbol("private");



class DummyA extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



DummyA.templatePromise = null;
DummyA.metaURL = import.meta.url;
Object.seal(DummyA);



customElements.define("dummy-a", DummyA);
