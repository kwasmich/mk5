import { loadHTML } from "/util/helper.js";



const priv = Symbol("private");



export default class HTMLCustomElement extends HTMLElement {
    constructor() {
        super();
    }


    _load(template, { url }) {
        const path = url.replace(".js", "");

        loadHTML(`${path}.html`).then((html) => {
            const temp = document.createElement("TEMPLATE");
            const domParser = new DOMParser();
            const doc = domParser.parseFromString(`<html><body>${html}</body></html>`, "text/html");
            const newElements = doc.body.childNodes;
            // const newElements = document.importNode(doc.body, true).children;
            
            const link = document.createElement("LINK");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = `${path}.css`;
            temp.content.append(link, ...newElements);
            template.value = temp;
        });
    }


    _init(template, shadowRoot) {
        const content = template.content.cloneNode(true);
        const link = content.childNodes[0];
        shadowRoot.appendChild(link);
        link.onload = () => shadowRoot.appendChild(content);
    }
}
