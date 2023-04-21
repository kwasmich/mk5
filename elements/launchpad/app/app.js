import { UIView } from "/base/ui-view.js";



export class App extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });


    constructor(title, ...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        const tileElement = this.#shadowRoot.querySelector("FIGCAPTION");
        tileElement.textContent = title;
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}
}



UIView.define("ui-launchpad-app", App, import.meta.url);
