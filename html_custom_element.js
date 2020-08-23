import { loadHTML } from "/util/helper.js";



const priv = Symbol("private");



export default class HTMLCustomElement extends HTMLElement {
    constructor() {
        super();
    }


    _load(template, shadowRoot, { url }) {
        const path = url.replace(".js", "");
        const temp = document.createElement("TEMPLATE");
        const domParser = new DOMParser();

        loadHTML(`${path}.html`).then((html) => {
            const doc = domParser.parseFromString(`<html><body>${html}</body></html>`, "text/html");
            const newElements = doc.body.childNodes;
            temp.content.append(...newElements);
            template.value = temp;
        });

        const link = document.createElement("LINK");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = `${path}.css`;
        temp.content.append(link);
        shadowRoot.appendChild(link.cloneNode());
    }


    _init(template, shadowRoot) {
        const content = template.content.cloneNode(true);
        const appendContent = () => shadowRoot.appendChild(content);

        if (shadowRoot.hasChildNodes()) {
            content.removeChild(content.childNodes[0]);
            shadowRoot.childNodes[0].onload = appendContent;
        } else {
            const link = content.childNodes[0];
            shadowRoot.appendChild(link);
            link.onload = appendContent;
        }
    }
}
