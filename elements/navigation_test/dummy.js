import { UIView } from "/base/ui-view2.js";
import { DummyA, DummyB, DummyC } from "./index.js"; // one layer of indirection breaks circular dependency - somehow
// import { DummyA } from "./dummy_a/dummy_a.js";
// import { DummyB } from "./dummy_b/dummy_b.js";
// import { DummyC } from "./dummy_c/dummy_c.js";


export class Dummy extends UIView {
    static get observedAttributes() {
        return [];
    }


    #shadowRoot = this.attachShadow({ mode: "closed" });


    constructor(...args) {
        const self = super(args);
        this._onClick = this._onClick.bind(this);
        Object.seal(this);

        this._init(this.#shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        this.#shadowRoot.getElementById("a").addEventListener("click", this._onClick);
        this.#shadowRoot.getElementById("b").addEventListener("click", this._onClick);
        this.#shadowRoot.getElementById("c").addEventListener("click", this._onClick);
        this.#shadowRoot.getElementById("pop").addEventListener("click", this._onClick);
    }


    disconnectedCallback() {
        this.#shadowRoot.getElementById("a").removeEventListener("click", this._onClick);
        this.#shadowRoot.getElementById("b").removeEventListener("click", this._onClick);
        this.#shadowRoot.getElementById("c").removeEventListener("click", this._onClick);
        this.#shadowRoot.getElementById("pop").removeEventListener("click", this._onClick);
    }


    _onClick(mouseEvent) {
        switch (mouseEvent.currentTarget.textContent) {
            case "A":
                this.parentNode.pushView(new DummyA());
                break;

            case "B":
                this.parentNode.pushView(new DummyB());
                break;

            case "C":
                this.parentNode.pushView(new DummyC());
                break;

            default:
                this.parentNode.popView();
                break;
        }
    }
}