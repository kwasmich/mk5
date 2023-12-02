import { UIView } from "/base/ui-view.js";



export class ListItemTest extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });
    #data = "xxx";
    #textNode = undefined;

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
        this._onInit();
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    _onInit() {
        this.#textNode = this.#shadowRoot.ownerDocument.createTextNode(this.#data);
        this.#shadowRoot.append(this.#textNode);
    }


    _updateView() {
        this.#textNode.textContent = this.#data;
    }
}



UIView.define("list-item-test", ListItemTest, import.meta.url);
