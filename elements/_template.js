import HTMLCustomElement from "/html_custom_element.js";
import Observable from "/util/observable.js";



const template = new Observable();
const priv = Symbol("private");



class MyElement extends HTMLCustomElement {
    static get observedAttributes() {
        return [];
    }


    constructor() {
        super(template, import.meta);
        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({mode: 'closed'});
        Object.seal(this);

        template.subscribe((value) => value && this._init(value));
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _init() {
        const content = template.value.content.cloneNode(true);
        this[priv].shadowRoot.appendChild(content);
    }
}


customElements.define('my-element', MyElement);
