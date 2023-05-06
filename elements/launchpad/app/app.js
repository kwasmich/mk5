import { UIView } from "/base/ui-view.js";



export class App extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #icon = undefined


    constructor(title, iconURL, ...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        const tilteElement = this.#shadowRoot.querySelector("FIGCAPTION");
        tilteElement.textContent = title;
        this.#icon = this.#shadowRoot.querySelector("IMG");
        this.#icon.src = iconURL;
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}

    
    getBoundingClientRect() {
        return this.#icon.getBoundingClientRect();
    }
}



UIView.define("ui-launchpad-app", App, import.meta.url);
