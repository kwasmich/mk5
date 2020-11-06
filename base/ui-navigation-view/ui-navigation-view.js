import UIView from "/base/ui-view.js";



const priv = Symbol("private");



class UINavigationView extends UIView {
    static get observedAttributes() {
        return [];
    }


    constructor(...args) {
        const self = super(args);

        this[priv] = this[priv] ?? {};
        this[priv].shadowRoot = this.attachShadow({ mode: "closed" });
        Object.seal(this);
        Object.seal(this[priv]);

        this._init(this[priv].shadowRoot);
        return self;
    }


    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue) {}
    connectedCallback() {}
    disconnectedCallback() {}


    pushView(view) {
        this.appendChild(view);
        view.setAttribute("slot", "secondary");
        view.previousElementSibling.removeAttribute("slot");
    }


    popView() {
        const slot = this[priv].shadowRoot.querySelector("slot[name=secondary]");
        const view = slot.assignedElements()[0];
        const previousView = view.previousElementSibling;

        if (view.previousElementSibling && !previousView.hasAttribute("slot")) {
            previousView.setAttribute("slot", "secondary");
            this.removeChild(view);
        } else {
            console.warn("nothing to pop!");
        }
    }
}



UINavigationView.templatePromise = null;
UINavigationView.metaURL = import.meta.url;
Object.seal(UINavigationView);



customElements.define("ui-navigation-view", UINavigationView);
