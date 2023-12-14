import { loadHTML, loadText } from "/util/helper.js";



const domParser = new DOMParser();
// const cssCache = new Map();



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
    // console.log(path);

    // if (cssCache.has(path)) {
    //     return Promise.resolve(cssCache.get(path));
    // }

    return loadText(`${path}.css`);
    // .then((result) => {
    //     console.log(path);
    //     cssCache.set(path, result);
    //     return Promise.resolve(cssCache.get(path));
    // });
}



const globalStyle = fetchCSS("/style");



export class UIView extends HTMLElement {
    static registry = new Map();


    static define(tagName, elementClass, url) {
        this.registry.set(elementClass, tagName);

        const path = url.replace(".js", "");

        const promises = [
            fetchHTML(path),
            fetchCSS(path),
            globalStyle
        ];

        const define = async ([html, css, css1, ...args]) => {
            // FUTURE: Supported in Safari 16
            // remove this:
            const style = document.createElement("STYLE");
            style.textContent = css;
            html.content.insertBefore(style, html.content.firstChild);
            const style1 = document.createElement("STYLE");
            style1.textContent = css1;
            html.content.insertBefore(style1, html.content.firstChild);
            // add that
            // elementClass.cssTemplate = css;
            
            elementClass.htmlTemplate = html;
            Object.seal(elementClass);
            

            // todo - track progress of missing 
            const undefElements = html.content.querySelectorAll(":not(:defined)");

            for (const element of undefElements) {
                customElements.upgrade(element);
            }

            if (undefElements.length > 0) {
                const undef = [...new Set([...undefElements].map((e) => e.localName))];
                console.log("Waiting for", undef);
                const promises = undef.map((u) => customElements.whenDefined(u));
                await Promise.all(promises, 3000).catch((error) => console.error(`Timeout while waiting for ${undef}`));
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
        console.debug(`new ${self.constructor.name}`);
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


    toString() {
        return `${this.constructor.name} derived from UIView`;
    }


    _init(shadowRoot) {
        // FUTURE: Supported in Safari 16
        //
        // globalStyle.then((gcssString) => {
        //     const gcss = new CSSStyleSheet();
        //     gcss.replaceSync(gcssString);
        //     shadowRoot.adoptedStyleSheets.push(gcss);
        // });

        // const css = new CSSStyleSheet();
        // css.replaceSync(this.constructor.cssTemplate);
        // shadowRoot.adoptedStyleSheets.push(css);

        const content = shadowRoot.ownerDocument.importNode(this.constructor.htmlTemplate.content, true);
        shadowRoot.appendChild(content);

        const undefElements = shadowRoot.querySelectorAll(":not(:defined)");

        for (const el of undefElements) {
            customElements.upgrade(el);
        }
    }
}
