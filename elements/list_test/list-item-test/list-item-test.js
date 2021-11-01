import { UIView } from "/base/ui-view.js";



export class ListItemTest extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #data = "xxx";

    get item() {
        return this.#data
    }

    set item(val) {
        this.#data = val ?? "-";
        this._updateView();
    }


    constructor(...args) {
        const self = super(args);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _updateView() {
        this.#shadowRoot.appendChild(document.createTextNode(this.#data));
    }
}



UIView.define("list-item-test", ListItemTest, import.meta.url);
