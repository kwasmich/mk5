import { loadHTML } from "/util/helper.js";


const domParser = new DOMParser();


function fetchHTML(path) {
    return loadHTML(`${path}.html`).then((html) => {
        const doc = domParser.parseFromString(`<html><body>${html}</body></html>`, "text/html");
        const newElements = doc.body.childNodes;
        const templateElement = document.createElement("TEMPLATE");
        templateElement.content.append(...newElements);
        return Promise.resolve(templateElement);
    });
}



function fetchCSS(path, shadowRoot) {
    const cssPromise = (resolve, reject) => {
        const link = document.createElement("LINK");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = `${path}.css`;
        link.onload = () => resolve();
        shadowRoot.appendChild(link);
    }

    return new Promise(cssPromise);
}



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
        const url = this.constructor.metaURL;
        const path = url.replace(".js", "");

        const compose = ([templateElement]) => {
            const content = templateElement.content.cloneNode(true);
            shadowRoot.appendChild(content);
            this.onInit();
        };

        if (!this.constructor.templatePromise) {
            this.constructor.templatePromise = fetchHTML(path);
        }

        const promises = [];
        promises.push(this.constructor.templatePromise);
        promises.push(fetchCSS(path, shadowRoot));
        Promise.all(promises).then(compose);
    }
}
