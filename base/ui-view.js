import { loadHTML } from "/util/helper.js";
import Observable from "/util/observable.js";



export default class UIView extends HTMLElement {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);
        return self;
    }


    adoptedCallback() {
        console.warn("adoptedCallback not implemented", this.constructor.name);
    }


    attributeChangedCallback(name, oldValue, newValue) {
        console.warn("attributeChangedCallback not implemented", name, oldValue, newValue, this.constructor.name);
    }
    
    
    connectedCallback() {
        console.warn("connectedCallback not implemented", this.constructor.name);
    }


    disconnectedCallback() {
        console.warn("disconnectedCallback not implemented", this.constructor.name);
    }


    onInit() {
        console.warn("onInit not implemented", this.constructor.name);
    }


    _init(shadowRoot) {
        if (!this.constructor.template) {
            this.constructor.template = new Observable();
            this._load(shadowRoot);
        } else {
            this.constructor.template.subscribe((value) => value && this._init2(shadowRoot));
        }
    }


    _load(shadowRoot) {
        const template = this.constructor.template;
        const url = this.constructor.metaURL;
        const path = url.replace(".js", "");
        const temp = document.createElement("TEMPLATE");
        const domParser = new DOMParser();

        const templatePromise = loadHTML(`${path}.html`).then((html) => {
            const doc = domParser.parseFromString(`<html><body>${html}</body></html>`, "text/html");
            const newElements = doc.body.childNodes;
            temp.content.append(...newElements);
            template.value = temp;
            return Promise.resolve(temp);
        });

        const link = document.createElement("LINK");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = `${path}.css`;
        temp.content.append(link);

        const copyLink = link.cloneNode();
        copyLink.onload = () => templatePromise.then((tmpl) => this._init2(shadowRoot));
        shadowRoot.appendChild(copyLink);
    }


    _init2(shadowRoot) {
        const template = this.constructor.template;
        const content = template.value.content.cloneNode(true);
        const appendContent = () => {
            shadowRoot.appendChild(content);
            this.onInit();
        }

        if (shadowRoot.hasChildNodes()) {
            content.removeChild(content.childNodes[0]);
            appendContent();
        } else {
            const link = content.childNodes[0];
            link.onload = appendContent;
            shadowRoot.appendChild(link);
        }
    }
}
