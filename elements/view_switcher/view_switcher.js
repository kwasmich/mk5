import HTMLCustomElement from "/html_custom_element.js";
import Observable from "/util/observable.js";



let s_template;
const priv = Symbol("private");



class ViewSwticher extends HTMLCustomElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super();

        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);

        if (!s_template) {
            s_template = new Observable();
            super._load(s_template, this[priv].shadowRoot, import.meta);
        }

        s_template.subscribe((value) => value && super._init(value, this[priv].shadowRoot));
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}


customElements.define("mk-view-switcher", ViewSwticher);
