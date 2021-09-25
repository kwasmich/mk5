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



function fetchCSS(path) {
    const link = document.createElement("LINK");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = `${path}.css`;

    const templateElement = document.createElement("TEMPLATE");
    templateElement.content.append(link);
    return Promise.resolve(templateElement);
}



export class UIView extends HTMLElement {
    static define(tagName, elementClass, url) {
        const path = url.replace(".js", "");

        const promises = [
            fetchHTML(path),
            fetchCSS(path)
        ];

        const define = ([html, css, ...args]) => {
            elementClass.htmlTemplate = html;
            elementClass.cssTemplate = css;
            Object.seal(elementClass);
            customElements.define(tagName, elementClass);
        }

        Promise.all(promises).then(define);
    }

    
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


    _init(shadowRoot) {
        const link = this.constructor.cssTemplate.content.cloneNode(true);
        shadowRoot.appendChild(link);
        const content = this.constructor.htmlTemplate.content.cloneNode(true);
        shadowRoot.appendChild(content);
    }
}
