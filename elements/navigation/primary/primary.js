import UIView from "/base/ui-view.js";



const priv = Symbol("private");



class PrimaryView extends UIView {
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
        console.log("disconnect");
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
        console.log(this, mouseEvent);

        switch (mouseEvent.currentTarget.textContent) {
            case "A":
                this.parentNode.pushView(new (customElements.get("dummy-a"))());
                break;

            case "B":
                this.parentNode.pushView(new (customElements.get("dummy-b"))());
                break;

            case "C":
                this.parentNode.pushView(new (customElements.get("dummy-c"))());
                break;

            default:
                this.parentNode.popView();
                break;
        }
    }
}



PrimaryView.templatePromise = null;
PrimaryView.metaURL = import.meta.url;
Object.seal(PrimaryView);



customElements.define("primary-view", PrimaryView);
