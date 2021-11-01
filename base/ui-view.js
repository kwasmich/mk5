import { loadHTML, loadText } from "/util/helper.js";



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
    return loadText(`${path}.css`);
}



export class UIView extends HTMLElement {
    static define(tagName, elementClass, url) {
        const path = url.replace(".js", "");

        const promises = [
            fetchHTML(path),
            fetchCSS(path)
        ];

        const define = async ([html, css, ...args]) => {
            const style = document.createElement("STYLE");
            style.textContent = css;
            html.content.insertBefore(style, html.content.firstChild);
            elementClass.htmlTemplate = html;
            elementClass.cssTemplate = css;
            Object.seal(elementClass);
            
            const undefElements = html.content.querySelectorAll(":not(:defined)");

            for (const element of undefElements) {
                customElements.upgrade(element);
            }

            if (undefElements.length > 0) {
                const undef = [...new Set([...undefElements].map((e) => e.localName))];
                const promises = undef.map((u) => customElements.whenDefined(u));
                await Promise.all(promises);
            }

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
        const content = this.constructor.htmlTemplate.content.cloneNode(true);
        shadowRoot.appendChild(content);

        const undefElements = shadowRoot.querySelectorAll(":not(:defined)");

        for (const el of undefElements) {
            customElements.upgrade(el);
        }
    }
}
