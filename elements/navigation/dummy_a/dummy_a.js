import { UIView } from "/base/ui-view.js";
import { DummyB, DummyC } from "../index.js";


const priv = Symbol("private");



export class DummyA extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].isConnected = false;
        this[priv].isInited = false;
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        
        this._onClick = this._onClick.bind(this);

        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    onInit() {
        super.onInit();
        this[priv].isInited = true;
        this._connect();
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}


    connectedCallback() {
        this[priv].isConnected = true;
        this._connect();
    }


    disconnectedCallback() {
        this[priv].shadowRoot.getElementById("a").removeEventListener("click", this._onClick);
        this[priv].shadowRoot.getElementById("b").removeEventListener("click", this._onClick);
        this[priv].shadowRoot.getElementById("c").removeEventListener("click", this._onClick);
        this[priv].shadowRoot.getElementById("pop").removeEventListener("click", this._onClick);
        this[priv].isConnected = false;
    }


    _connect() {
        if (this[priv].isConnected && this[priv].isInited) {
            this[priv].shadowRoot.getElementById("a").addEventListener("click", this._onClick);
            this[priv].shadowRoot.getElementById("b").addEventListener("click", this._onClick);
            this[priv].shadowRoot.getElementById("c").addEventListener("click", this._onClick);
            this[priv].shadowRoot.getElementById("pop").addEventListener("click", this._onClick);
        }
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



DummyA.templatePromise = null;
DummyA.metaURL = import.meta.url;
Object.seal(DummyA);



customElements.define("dummy-a", DummyA);
