import HTMLCustomElement from "/html_custom_element.js";
import Observable from "/util/observable.js";



let s_template;
const priv = Symbol("private");



class MyElement extends HTMLCustomElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super();

        if (!s_template) {
            s_template = new Observable();
            super._init(s_template, import.meta);
        }
        
        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({mode: "closed"});
        Object.seal(this);

        s_template.subscribe((value) => value && this._init(value));
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _init(template) {
        const content = template.content.cloneNode(true);
        const link = content.childNodes[0];
        this[priv].shadowRoot.appendChild(link);
        link.onload = () => this[priv].shadowRoot.appendChild(content);
    }
}


customElements.define("my-element", MyElement);
