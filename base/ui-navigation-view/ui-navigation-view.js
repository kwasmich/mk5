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
        const currentView = slot.assignedElements()[0];
        const previousView = currentView.previousElementSibling;

        if (previousView && !previousView.hasAttribute("slot")) {
            previousView.setAttribute("slot", "secondary");
            this.removeChild(currentView);
            return previousView;
        } else {
            console.warn("nothing to pop!");
            return currentView;
        }
    }


    popToView(view) {
        const slot = this[priv].shadowRoot.querySelector("slot[name=secondary]");
        let currentView = slot.assignedElements()[0];

        if ([...this.children].includes(view)) {
            view.setAttribute("slot", "secondary");

            while (view.nextElementSibling) {
                this.removeChild(view.nextElementSibling);
            }

            return view;
        } else {
            console.warn("view not included!");
            return currentView;
        }
    }


    popToRootView() {
        const slot = this[priv].shadowRoot.querySelector("slot[name=secondary]");
        const currentView = slot.assignedElements()[0];
        let view = currentView;

        while (view.previousElementSibling && !view.previousElementSibling.hasAttribute("slot")) {
            view = view.previousElementSibling;
        }

        view.setAttribute("slot", "secondary");

        while (view.nextElementSibling) {
            this.removeChild(view.nextElementSibling);
        }

        return view;
    }
}



UINavigationView.templatePromise = null;
UINavigationView.metaURL = import.meta.url;
Object.seal(UINavigationView);



customElements.define("ui-navigation-view", UINavigationView);
