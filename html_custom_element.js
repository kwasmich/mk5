import { loadHTML } from "/util/helper.js";
import Observable from "/util/observable.js";



const priv = Symbol("private");



export default class HTMLCustomElement extends HTMLElement {
    constructor(...args) {
        const self = super(args);
        return self;
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


    onInit() {}
}
